var request         = require('request'),
    querystring     = require('querystring');


var CleverTapAPI = function (CleverTapAccountId, CleverTapAccountPasscode) {
    if(!CleverTapAccountId) {
        throw new Error("Please provide a CleverTap Account Id");
    }

    if(!CleverTapAccountPasscode) {
        throw new Error("Please provide a CleverTap Account Passcode");
    }

    this.accountId = CleverTapAccountId;
    this.accountPasscode = CleverTapAccountPasscode;

    this.apiHostname = "api.clevertap.com";
    this.apiVersion = 1;
    this.apiEndpoint = `https://${this.apiHostname}/${this.apiVersion}`

};
        
CleverTapAPI.prototype.repr = function () {
    console.log(`CleverTap: Account Id: ${this.accountId}, Passcode: ${this.accountPasscode}`)
};


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
        console.log( `Uploading ${data.length} records in ${Math.ceil(totalRecords/batchSize)} batch(es)`);
    }

    processNextBatch();

};


CleverTapAPI.prototype.profiles = function(query, options, callback) {
    return this._fetch("profiles", query, options, callback);
};    


CleverTapAPI.prototype.events = function(query, options, callback) {
    return this._fetch("events", query, options, callback);
};    


CleverTapAPI.prototype._fetch = function (type, query, options, callback) {
    if (!query) {
        return [];
    }

    var cursor = null;

    var records = [];

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
    
    batchSize = batchSize > maxBatchSize ? maxBatchSize : batchSize;
    
    var fetchNext = () => {
        var args        = {},
            new_records = null,
            qString     = null;

        // do we already have a cursor
        if(!cursor) {
            // add query and batchSize as query args   
            var args = {"batch_size":batchSize, "query":JSON.stringify(query)};
            qString  = querystring.stringify(args);
            endpoint = `${type}.json?${qString}`
        
        } else {
            endpoint = `${type}.json?cursor=${cursor}`
        }    

        if (options.debug) {
            console.log( `fetching endpoint ${endpoint}`);
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
    callback = callback || function(res) {};
    var headers = options.headers || {};
    var url = `${this.apiEndpoint}/${endpoint}`;
    var method = options.method || "GET";
    
    // add the authentication headers
    headers['X-CleverTap-Account-Id'] = this.accountId;
    headers['X-CleverTap-Passcode'] = this.accountPasscode;

    var requestOptions = {
        url: url,
        method: method,
        headers: headers,
        json: true,
    };

    if (options.data) {
        requestOptions['json'] = options.data;
    }

    request(requestOptions, function (error, response, body){
        if(error) {
            callback(error);
        } else {
            callback(response.body);
        }
    });
};


module.exports = CleverTapAPI;
