const REGIONS = require("./regions");
const fetch = require("node-fetch");
const querystring = require("querystring");

const API_HOSTNAME = "api.clevertap.com";
const API_VERSION = 1;

const CREATE = "create";
const ESTIMATE = "estimate";
const LIST = "list";
const RESULT = "result";
const STOP = "stop";

const TARGET_ACTIONS = [CREATE, ESTIMATE, LIST, RESULT, STOP];

const CleverTapAPI = function (
  CleverTapAccountId,
  CleverTapAccountPasscode,
  CleverTapAccountRegion
) {
  if (!CleverTapAccountId) {
    throw new Error("Please provide a CleverTap Account Id");
  }

  if (!CleverTapAccountPasscode) {
    throw new Error("Please provide a CleverTap Account Passcode");
  }

  if (!REGIONS.regionIsValid(CleverTapAccountRegion)) {
    throw new Error("Please provide a valid CleverTap Account Region");
  }

  this.accountId = CleverTapAccountId;
  this.accountPasscode = CleverTapAccountPasscode;
  this.apiEndpoint = `https://${CleverTapAccountRegion}.${API_HOSTNAME}/${API_VERSION}`;
};

CleverTapAPI.prototype.TARGET_CREATE = CREATE;
CleverTapAPI.prototype.TARGET_ESTIMATE = ESTIMATE;
CleverTapAPI.prototype.TARGET_LIST = LIST;
CleverTapAPI.prototype.TARGET_RESULT = RESULT;
CleverTapAPI.prototype.TARGET_STOP = STOP;
CleverTapAPI.prototype.TARGET_ACTIONS = TARGET_ACTIONS;

CleverTapAPI.prototype._call = function (endpoint, options, callback) {
  if (options.debug) {
    console.log(
      `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(
        options
      )}`
    );
  }

  callback = callback || function (res) {};

  const headers = options.headers || {};
  const url = `${this.apiEndpoint}/${endpoint}`;
  const method = options.method || "GET";

  // add the authentication headers
  headers["X-CleverTap-Account-Id"] = this.accountId;
  headers["X-CleverTap-Passcode"] = this.accountPasscode;
  headers["Content-Type"] = "application/json";

  const fetchOptions = {
    method: method,
    headers,
    body: options.data ? JSON.stringify(options.data) : undefined,
  };

  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((body) => {
      callback(body || {});
    })
    .catch((error) => {
      callback("error", error);
    });
};

CleverTapAPI.prototype._fetch = function (type, query, options, callback) {
  if (!query) {
    return [];
  }

  var cursor = null;
  var records = [];

  //API allows max 5000 records per request
  const maxBatchSize = 5000;

  var batchSize = 10; // default to 10

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  if (options.batchSize) {
    batchSize = options.batchSize;
  }

  batchSize = batchSize > maxBatchSize ? maxBatchSize : batchSize;

  const fetchNext = () => {
    let endpoint;
    let new_records = null;

    if (!cursor) {
      const args = { batch_size: batchSize, query: JSON.stringify(query) };
      endpoint = `${type}.json?${querystring.stringify(args)}`;
    } else {
      endpoint = `${type}.json?cursor=${cursor}`;
    }

    this._call(endpoint, options, (res) => {
      if (res) {
        cursor = res.cursor || res.next_cursor;
        new_records = res.records;

        if (new_records) {
          Array.prototype.push.apply(records, new_records);
        }
      } else {
        cursor = null;
      }

      if (cursor) {
        fetchNext();
      } else if (callback) {
        callback(records);
      }
    });
  };

  fetchNext();
};

CleverTapAPI.prototype.profile = function (options, callback) {
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  if (!options.email && !options.identity && !options.objectId) {
    if (callback) {
      callback({});
    }
  }

  var endpoint = "profile.json";

  if (options.email) {
    endpoint += "?email=" + options.email;
  } else if (options.identity) {
    endpoint += "?identity=" + options.identity;
  } else if (options.objectId) {
    endpoint += "?objectId=" + options.objectId;
  }

  this._call(endpoint, options, (res) => {
    if (callback) {
      callback(res);
    }
  });
};

CleverTapAPI.prototype.profiles = function (query, options, callback) {
  return this._fetch("profiles", query, options, callback);
};

CleverTapAPI.prototype.upload = function (data, options, callback) {
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  if (!data || data.length <= 0) {
    if (callback) {
      callback({});
    }
    return [];
  }

  var batchSize = 100; // default: API allows max 100 records per request
  var totalRecords = data.length;
  var completedRecords = 0;
  var recordsBatchIdx = 0;
  var responses = [];

  if (options.batchSize && options.batchSize < batchSize) {
    batchSize = options.batchSize;
  }

  var processNextBatch = () => {
    var batch = [];

    // determine the records for this batch
    for (
      var bidx = recordsBatchIdx;
      bidx < totalRecords && bidx < recordsBatchIdx + batchSize;
      bidx++
    ) {
      batch.push(data[bidx]);
    }

    if (batch.length > 0) {
      options.data = { d: batch };
      options.method = "POST";

      this._call("upload", options, (res) => {
        completedRecords += batch.length;

        if (res) {
          responses.push(res);
        }

        if (completedRecords < totalRecords) {
          processNextBatch();
        } else if (callback) {
          callback(responses);
        }
      });

      recordsBatchIdx += batch.length;
    }
  };

  if (options.debug) {
    console.log(
      `CleverTap: Uploading ${data.length} records in ${Math.ceil(
        totalRecords / batchSize
      )} batch(es)`
    );
  }

  processNextBatch();
};

CleverTapAPI.prototype.profileCounts = function (data, options, callback) {
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }
  this._call(
    "counts/profiles.json",
    { ...options, data, method: "POST" },
    (res) => {
      if (callback) {
        callback(res);
      }
    }
  );
};

CleverTapAPI.prototype.delete = function (query, options, callback) {
  this._call(
    "delete/profiles.json",
    {
      ...options,
      method: "POST",
      data: query,
    },
    callback
  );
};

CleverTapAPI.prototype.demerge = function (query, options, callback) {
  this._call(
    "demerge/profiles.json",
    {
      ...options,
      method: "POST",
      data: query,
    },
    callback
  );
};

CleverTapAPI.prototype.subscribe = function (query, options, callback) {
  this._call(
    "subscribe",
    {
      ...options,
      method: "POST",
      data: query,
    },
    callback
  );
};

CleverTapAPI.prototype.disassociate = function (query, options, callback) {
  this._call(
    "disassociate",
    {
      ...options,
      method: "POST",
      data: query,
    },
    callback
  );
};

CleverTapAPI.prototype.events = function (query, options, callback) {
  return this._fetch("events", query, options, callback);
};

CleverTapAPI.prototype.getEventsCount = function (data, options, callback) {
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }
  this._call(
    "counts/events.json",
    { ...options, data, method: "POST" },
    (res) => {
      if (callback) {
        callback(res);
      }
    }
  );
};

CleverTapAPI.prototype.targets = function (options, callback) {
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  var action = options.action;

  if (!action || this.TARGET_ACTIONS.indexOf(action) < 0) {
    if (options.debug) {
      console.log(`Invalid push target action ${action}`);
    }

    if (callback) {
      callback(null);
    }
  }

  var endpoint = `targets/${action}.json`;

  this._call(endpoint, options, (res) => {
    if (callback) {
      callback(res);
    }
  });
};

CleverTapAPI.prototype.getMessageReports = function (query, options, callback) {
  this._call(
    "message/report.json",
    {
      ...options,
      method: "POST",
      data: query,
    },
    callback
  );
};

CleverTapAPI.prototype.realTimeCounts = function (query, options, callback) {
  this._call(
    "now.json",
    {
      ...options,
      method: "POST",
      data: query,
    },
    callback
  );
};

CleverTapAPI.prototype.topPropertyCounts = function (query, options, callback) {
  this._call(
    "counts/top.json",
    {
      ...options,
      method: "POST",
      data: query,
    },
    callback
  );
};

CleverTapAPI.prototype.trends = function (query, options, callback) {
  this._call(
    "counts/trends.json",
    {
      ...options,
      method: "POST",
      data: query,
    },
    callback
  );
};

module.exports = CleverTapAPI;
