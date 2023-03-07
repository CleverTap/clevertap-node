const REGIONS       = require('./regions');
const request       = require('request');
const querystring   = require('querystring');

const API_HOSTNAME  = "api.clevertap.com";
      API_VERSION   = 1;

const CREATE = "create",
      ESTIMATE = "estimate",
      LIST = "list",
      RESULT = "result",
      STOP = "stop";

const TARGET_ACTIONS = [CREATE, ESTIMATE, LIST, RESULT, STOP];

const CleverTapAPI = function (CleverTapAccountId, CleverTapAccountPasscode, CleverTapAccountRegion) {
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

CleverTapAPI.prototype.upload = function(data, options, callback) {

    if (!data || data.length <= 0) {
        return [];
    }

    var batchSize = 100, // default: API allows max 100 records per request
        totalRecords = data.length,
        completedRecords = 0,
        recordsBatchIdx = 0,
        responses = [];

    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    if (options.batchSize && options.batchSize < batchSize) {
           batchSize = options.batchSize;
    }

    var processNextBatch = () => {

        var batch = [];

        // determine the records for this batch
        for (var bidx = recordsBatchIdx; bidx < totalRecords && bidx < recordsBatchIdx + batchSize; bidx++) {
            batch.push(data[bidx]);
        }

        if (batch.length > 0) {

            options.data = {"d":batch};
            options.method = "POST";

            this._call('upload', options, (res) => {

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
        console.log( `CleverTap: Uploading ${data.length} records in ${Math.ceil(totalRecords/batchSize)} batch(es)`);
    }

    processNextBatch();

};


CleverTapAPI.prototype.profile = function(options, callback) {
    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    if(!options.email && !options.identity && !options.objectId) {
        if (callback) {
            callback({});
        }
    }

    var endpoint = "profile.json";

    if (options.email) {
        endpoint += "?email="+options.email;
    }

    else if (options.identity) {
        endpoint += "?identity="+options.identity;
    }

    else if (options.objectId) {
        endpoint += "?objectId="+options.objectId;
    }

    this._call(endpoint, options, (res) => {

        if (callback) {
            callback(res);
        }
    });
};


CleverTapAPI.prototype.profiles = function(query, options, callback) {
    return this._fetch("profiles", query, options, callback);
};


CleverTapAPI.prototype.events = function(query, options, callback) {
    return this._fetch("events", query, options, callback);
};


CleverTapAPI.prototype.targets = function(options, callback) {
    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    var action = options.action;

    if(!action || this.TARGET_ACTIONS.indexOf(action) < 0) {
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


CleverTapAPI.prototype._fetch = function (type, query, options, callback) {

    if (!query) {
        return [];
    }

    var cursor = null,
        records = [];

    //API allows max 5000 records per request
    const maxBatchSize = 5000;

    var batchSize = 10;// default to 10

    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    if (options.batchSize) {
        batchSize = options.batchSize;
    }

    batchSize = (batchSize > maxBatchSize) ? maxBatchSize : batchSize;

    const fetchNext = () => {

        let endpoint
        let new_records = null

        if(!cursor) {
            const args = {'batch_size': batchSize, 'query': JSON.stringify(query)}
            endpoint = `${type}.json?${querystring.stringify(args)}`

        } else {
            endpoint = `${type}.json?cursor=${cursor}`
        }

        this._call(endpoint, options, (res) => {

            if (res) {
                cursor = res.cursor || res.next_cursor;
                new_records = res.records;

                if(new_records) {
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


CleverTapAPI.prototype._call = function (endpoint, options, callback) {

    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "GET";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;

    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }

    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};

//Define a function called `delete` on the CleverTapAPI prototype
CleverTapAPI.prototype.delete = function (endpoint, options, callback) {

//log the endpoint and options if debug mode is enabled
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;

    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
//make the API request with request library
    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'demerge' on the CleverTapAPI prototype
CleverTapAPI.prototype.demerge = function (endpoint, options, callback) {
//log the endpoint and options if debug mode is enabled
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;

    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
//make the API request with request library
    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'uploadEvents' on the CleverTapAPI prototype
CleverTapAPI.prototype.uploadEvents = function (endpoint, options, callback) {
//log the endpoint and options if debug mode is enabled
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
 // Set headers, URL, and request method based on options
    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
//make the API request with request library
    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'getEventCount' on the CleverTapAPI prototype
CleverTapAPI.prototype.getEventCount = function (endpoint, options, callback) {
// If the 'debug' option is true, log the endpoint and options to the console
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
 // Set headers, URL, and request method based on options
    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
//make the API request with request library
    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'uploadDeviceTokens' on the CleverTapAPI prototype
CleverTapAPI.prototype.uploadDeviceTokens = function (endpoint, options, callback) {
// If the 'debug' option is true, log the endpoint and options to the console
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
 // Set headers, URL, and request method based on options

    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
//make the API request with request library
    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};

//Define the function 'subscribe' on the CleverTapAPI prototype
CleverTapAPI.prototype.subscribe= function (endpoint, options, callback) {
// If the 'debug' option is true, log the endpoint and options to the console

    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
     // Set headers, URL, and request method based on options

    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
     //Make the API request with request library

    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'getCampaigns' on the CleverTapAPI prototype
CleverTapAPI.prototype.getCampaigns= function (endpoint, options, callback) {
    // If debug option is provided, log the endpoint and options

    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "GET";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
     // Set headers, URL, and request method based on options
    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
 // Make the request to the CleverTap API and handle the response in the callback
    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'getMessageReports' on the CleverTapAPI prototype
CleverTapAPI.prototype.getMessageReports= function (endpoint, options, callback) {
    // If debug option is provided, log the endpoint and options

    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
 // Set headers, URL, and request method based on options
    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
     //make the API request with request library

    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'realTImeCounts' on the CleverTapAPI prototype
CleverTapAPI.prototype.realTimeCounts= function (endpoint, options, callback) {
// If debug option is provided, log the endpoint and options
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;

 // Set headers, URL, and request method based on options
    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
   //make the API request with request library
    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'topPropertyCounts' on the CleverTapAPI prototype
CleverTapAPI.prototype.topPropertyCounts= function (endpoint, options, callback) {
// If debug option is provided, log the endpoint and options

    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
 // Set headers, URL, and request method based on options
    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
   //make the API request with request library

    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'trends' on the CleverTapAPI prototype
CleverTapAPI.prototype.trends= function (endpoint, options, callback) {
// If debug option is provided, log the endpoint and options
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
 // Set headers, URL, and request method based on options

    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
   //make the API request with request library

    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'stopScheduledCampaigns' on the CleverTapAPI prototype
CleverTapAPI.prototype.stopScheduledCampaigns= function (endpoint, options, callback) {
// If debug option is provided, log the endpoint and options
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
// Set headers, URL, and request method based on options
    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
   //make the API request with request library

    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};
//Define the function 'disassociate' on the CleverTapAPI prototype
CleverTapAPI.prototype.disassociate= function (endpoint, options, callback) {
// If debug option is provided, log the endpoint and options
    if (options.debug) {
        console.log( `CleverTap: calling endpoint ${endpoint} with options ${JSON.stringify(options)}`);
    }

    callback = callback || function(res) {};

    const headers = options.headers || {},
          url = `${this.apiEndpoint}/${endpoint}`,
          method = options.method || "POST";

    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;
// Set headers, URL, and request method based on options

    const requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }
   //make the API request with request library

    request(requestOptions, function (error, response, body){
        if (error) {
            callback(error);
        } else {
            callback(response.body || {});
        }
    });
};




module.exports = CleverTapAPI;



module.exports = CleverTapAPI;
