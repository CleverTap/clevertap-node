/**

 Copyright (c) 2016 CleverTap
 Released under the MIT license.

*/

const CleverTapAPI = require("./clevertap-api");
const REGIONS = require("./regions");

const CREATE = "create";
const ESTIMATE = "estimate";
const LIST = "list";
const RESULT = "result";
const STOP = "stop";

const TARGET_ACTIONS = [CREATE, ESTIMATE, LIST, RESULT, STOP];

/* Reference Doc  https://developer.clevertap.com/docs/api-reference */

const CleverTap = function (
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

  this.api = new CleverTapAPI(
    CleverTapAccountId,
    CleverTapAccountPasscode,
    CleverTapAccountRegion
  );
};

/**

profile(options, callback)

Retrieve an individual user profile by ID.

Supported ID values are email, a custom identity value you have set on the profile via the SDKs or the Server API,
or the unique CleverTap objectID used by CleverTap to identify the user profile.
The CleverTap objectID is available via the SDKs as well as displayed in the user profile on the CleverTap dashboard.

options: Object; required value is one of email "email":"foo@foo.com", identity "identity":"1234567" or objectId "objectId":"-1a063854f83a4c6484285039ecff87cb".
optional values "debug":1, debug enables some logging.

callback:function(result:Object), optional

returns a Promise, callback optional
*/
CleverTap.prototype.profile = function (options, callback) {
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  var error = null;

  if (!options.email && !options.identity && !options.objectId) {
    error = "profile requires email, identity or objectId";
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }

    this.api.profile(options, (res) => {
      resolve(res);

      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/**
profiles(query, options, callback)

Queries the CleverTap Server API for user profiles defined by query

query: Object
options: Object; optional values {"debug":1, "batchSize":100}, debug enables some logging; default batchSize is 10, maximum batch size is 5000
callback:function(result:Array<Object>), optional

returns a Promise, callback optional
*/
CleverTap.prototype.profiles = function (query, options, callback) {
  var error = _validate("profiles", query);

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }

    this.api.profiles(query, options, (res) => {
      resolve(res);

      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/**
upload(data, options, callback)

Sends an array of event and/or profile objects to CleverTap

data: Array
options: Object; optional values {"debug":1, "batchSize":50}, debug enables some logging; maximum and default batchSize is 100
callback:function(result:Object), optional

returns a Promise, callback optional
*/
CleverTap.prototype.upload = function (data, options, callback) {
  var error = _validate("upload", data);

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }

    this.api.upload(data, options, (res) => {
      // if there is only one reponse return response object rather than array
      try {
        if (res.length === 1) {
          res = res[0];
        }
      } catch (e) {
        // no-op
      }

      resolve(res);

      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*uploadDeviceTokens Api
uploadDeviceTokens enables  to add an existing device token to a CleverTap user profile.
*/
CleverTap.prototype.uploadDeviceTokens = function (query, options, callback) {
  return this.upload(query, options, callback);
};

/*getProfilesCount Api
 CleverTap Api to get the count of profiles
 */
CleverTap.prototype.getProfilesCount = function (query, options, callback) {
  var error = _validate("profiles", query);

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }
    //Call the events API with the query
    this.api.profileCounts(query, options, (res) => {
      resolve(res);
      //Call the callback function if provided
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*Delete Api
 Deletes a user profile from the CleverTap system.
 */
CleverTap.prototype.delete = function (query, options, callback) {
  //Validate the query object for the "profiles" endpoint
  var error = _validate("profiles", query);

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }

    this.api.delete(query, options, (res) => {
      resolve(res);
      //Call the callback function if provided
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*Demerge Api
Demerges a user profile from another profile in the CleverTap system
*/
CleverTap.prototype.demerge = function (query, options, callback) {
  //Validate the query object for the "profiles" endpoint
  var error = _validate("profiles", query);

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }

    this.api.demerge(query, options, (res) => {
      resolve(res);
      //Call the callback function if provided
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*subscribe Api
subscribe Api provides the ability to set a phone number or email status as subscribed or unsubscribed.
*/
CleverTap.prototype.subscribe = function (query, options, callback) {
  //Validate the query for profiles
  var error = _validate("profiles", query);
  //Set the callback function if `options` is a function or not provided
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }
    //Call the API with the provided query
    this.api.subscribe(query, options, (res) => {
      resolve(res);
      //Call the callback function if provided
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*disassociate Api
disassociate API enables you to disconnect a phone number from a user profile.
*/
CleverTap.prototype.disassociate = function (query, options, callback) {
  //Validate the Query for profiles
  var error = _validate("profiles", query);
  //Set the callback function if `options` is a function or not provided
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }
    //Call the Api with the provided Query
    this.api.disassociate(query, options, (res) => {
      resolve(res);
      //Call the callback function if provided
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/**

events(query, options, callback)

Queries the CleverTap Server API for user action events defined by query

query: Object
options: Object; optional values {"debug":1, "batchSize":100}, debug enables some logging; default batchSize is 10, maximum batch size is 5000
callback:function(result:Array<Object>), options

returns a Promise, callback optional
*/
CleverTap.prototype.events = function (query, options, callback) {
  var error = _validate("events", query);

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }

    this.api.events(query, options, (res) => {
      resolve(res);

      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*getEventCount Api
 CleverTap Api to get the count of event
 */
CleverTap.prototype.getEventsCount = function (query, options, callback) {
  //Validate the query for profiles
  var error = _validate("events", query);

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }
    //Call the events API with the query
    this.api.getEventsCount(query, options, (res) => {
      resolve(res);
      //Call the callback function if provided
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*getMessageReports Api
The Get Message Reports API lets you download a list of messages sent by CleverTap.
*/
CleverTap.prototype.getMessageReports = function (query, options, callback) {
  var error = null; //_validate("profiles", query);
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }
    this.api.getMessageReports(query, options, (res) => {
      resolve(res);
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*realTimeCounts Api
This realTimeCounts Api enables you to get a real-time count of active users in the past five minutes in your app.
*/
CleverTap.prototype.realTimeCounts = function (query, options, callback) {
  //Validate the query
  var error = null; //_validate("profiles", query);
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }
    this.api.realTimeCounts(query, options, (res) => {
      resolve(res);
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*topPropertyCounts Api
This Api is used to retrieve counts for the most and least frequently occurring properties for a particular event in a specified duration.
*/
CleverTap.prototype.topPropertyCounts = function (query, options, callback) {
  var error = null; //_validate("profiles", query);

  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }
    this.api.topPropertyCounts(query, options, (res) => {
      resolve(res);
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/*trends Api
This Api is used to retrieve daily, weekly, and monthly event trends in a specified duration.
*/
CleverTap.prototype.trends = function (query, options, callback) {
  var error = null; //_validate("profiles", query);
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }
    this.api.trends(query, options, (res) => {
      resolve(res);
      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

/**

Push Notifications

CREATE:  creates a push notification target. Sends the notification to the segment of users defined by your payload.
ESTIMATE:  estimates the reach of a potential push notification target.  Returns an estimate of reach, will not create (send) the notification.
LIST: lists the targets you have created via the API.
RESULT:  returns the status and stats of a target.
STOP: stops a running target.

For info on required payloads and more in general see https://support.clevertap.com/server/send-notifications/push/

*/

CleverTap.prototype.TARGET_CREATE = CREATE;
CleverTap.prototype.TARGET_ESTIMATE = ESTIMATE;
CleverTap.prototype.TARGET_LIST = LIST;
CleverTap.prototype.TARGET_RESULT = RESULT;
CleverTap.prototype.TARGET_STOP = STOP;
CleverTap.prototype.TARGET_ACTIONS = TARGET_ACTIONS;

CleverTap.prototype.targets = function (action, payload, options, callback) {
  if (typeof options === "function" || !options) {
    callback = options;
    options = {};
  }

  var error = null;
  if (!action || this.TARGET_ACTIONS.indexOf(action) < 0) {
    error = `Invalid push target action ${action}`;
  }

  var _action = action;

  if (action == this.TARGET_ESTIMATE) {
    payload["estimate_only"] = true;
    action = this.TARGET_CREATE;
  }

  options.action = action;

  if (!error) {
    error = _validate(_action, payload);
  }

  options.data = payload;

  options.method = "POST";

  return new Promise((resolve, reject) => {
    if (error) {
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(null);
      }
      reject(error);
      return;
    }

    this.api.targets(options, (res) => {
      resolve(res);

      if (callback && typeof callback === "function") {
        callback(res);
      }
    });
  });
};

var _validate = (type, data) => {
  var error = null;

  if (type === CREATE || type === ESTIMATE) {
    if (!data) {
      return `Push targets action ${type} requires a payload`;
    }

    if (!data.name) {
      return `Push targets action ${type} requires a name`;
    }

    if (!data.where && !data.segment) {
      return `Push targets action ${type} requires a where or segment value`;
    }

    if (data.where && data.segment) {
      return `Push targets action ${type} does not support both a where value and a segment value, specify one or the other`;
    }

    if (data.segment) {
      if (data.segment !== "all") {
        return `Push targets action ${type} segment value must be all`;
      }
    }

    if (!data.content) {
      return `Push targets action ${type} requires a content dict`;
    }

    if (data.content) {
      if (!data.content.title || !data.content.body) {
        return `Push targets action ${type} content dict requires a title and a body`;
      }
    }

    if (!data.devices) {
      return `Push targets action ${type} requires a devices array`;
    }

    return error;
  }

  if (type === LIST) {
    // no-op
    return error;
  }

  if (type === RESULT || type === STOP) {
    if (!data || !data.id) {
      error = `Push targets action ${type} requires a target id`;
    }
    return error;
  }

  if (type === "events") {
    if (!data || typeof data !== "object") {
      error = `CleverTap.${type}: query must be an object: ${JSON.stringify(
        data
      )}`;
    }
  }

  if (type === "profiles") {
    if (!data || typeof data !== "object") {
      error = `CleverTap.${type}: query must be an object: ${JSON.stringify(
        data
      )}`;
    }
  }

  if (type === "upload") {
    data = data ? data : [];

    var identity = null,
      profileData = null,
      recordType = null;

    const validRecordTypes = ["event", "profile", "token"];

    for (var record of data) {
      identity =
        record.identity || record.FBID || record.GPID || record.objectId;
      if (!identity) {
        error = `upload record must contain an identity, FBID, GPID or objectId field: ${JSON.stringify(
          record
        )}`;
        break;
      }

      recordType = record.type;
      if (validRecordTypes.indexOf(recordType) === -1) {
        error = `CleverTap.${type}: record type must be 'profile' or 'event': ${JSON.stringify(
          record
        )}`;
        break;
      }
      if (recordType === "profile") {
        profileData = record.profileData;
        if (!profileData || typeof profileData !== "object") {
          error = `CleverTap.${type}: record with type '${recordType}' must contain a 'profileData' object: ${JSON.stringify(
            record
          )}`;
          break;
        }
      }

      if (recordType === "event") {
        evtData = record.evtData;
        if (!evtData || typeof evtData !== "object") {
          error = `CleverTap.${type}: record with type '${recordType}' must contain a 'evtData' object: ${JSON.stringify(
            record
          )}`;
          break;
        }
      }
    }
  }

  return error;
};

const init = (
  CleverTapAccountId,
  CleverTapAccountPasscode,
  CleverTapAccountRegion
) => {
  if (!CleverTapAccountRegion) {
    CleverTapAccountRegion = REGIONS.CLEVERTAP_REGIONS.EUROPE;
    console.log(
      "CleverTap Account Region not provided; defaulting to Europe (eu1) region"
    );
  } else if (!REGIONS.regionIsValid(CleverTapAccountRegion)) {
    throw new Error(
      `the CleverTap Account Region provided: ${CleverTapAccountRegion} - is invalid`
    );
  }
  return new CleverTap(
    CleverTapAccountId,
    CleverTapAccountPasscode,
    CleverTapAccountRegion
  );
};

module.exports = {
  REGIONS: REGIONS.CLEVERTAP_REGIONS,
  init: init,
};
