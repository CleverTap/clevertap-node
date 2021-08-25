/**
 
 Copyright (c) 2016 CleverTap
 Released under the MIT license.

*/

const CleverTapAPI = require("./clevertap-api");

const CREATE = "create",
      ESTIMATE = "estimate",
      LIST = "list",
      RESULT = "result",
      STOP = "stop";

const TARGET_ACTIONS = [CREATE, ESTIMATE, LIST, RESULT, STOP];

var CleverTap = function (CleverTapAccountId, CleverTapAccountPasscode,CleverTapEndPoint) {
    if(!CleverTapAccountId) {
        throw new Error("Please provide a CleverTap Account Id");
    }

    if(!CleverTapAccountPasscode) {
        throw new Error("Please provide a CleverTap Account Passcode");
    }

    this.api = new CleverTapAPI(CleverTapAccountId, CleverTapAccountPasscode,CleverTapEndPoint);
};
        

/**
 
 upload(data, options, callback)

Sends an array of event and/or profile objects to CleverTap 

data: Array
options: Object; optional values {"debug":1, "batchSize":50}, debug enables some logging; maximum and default batchSize is 100
callback:function(result:Object), optional

returns a Promise, callback optional

Sample data:  
var data = [
            {"type":"event",
                "identity":"6264372124",
                "ts":Math.floor((new Date).getTime()/1000), 
                "evtName":"choseNewFavoriteFood", 
                "evtData":{
                    "value":"sushi"
                    },
                },

            {"type":"profile", 
                "identity":"6264372124",
                "profileData":{
                    "favoriteColor":"green",
                    "Age":30,
                    "Phone":"+14155551234",
                    "Email":"peter@foo.com",
                    }, 
                },
            ];    

Result format:
{
    "status":<success, partial, fail>, 
    "processed":<count>, 
    "unprocessed": [{"status":"fail", "code":<error code>, "error":<error msg>, "record":<record>}]
}
            
Sample result:
{
    "status": "success",
    "processed": 1,
    "unprocessed": []
}
            
for data sizes > than the specified (or default) batchSize, responses will be an Array of response objects.


For more see https://support.clevertap.com/server/uploading-profiles-and-actions/

*/
CleverTap.prototype.upload = function(data, options, callback) {

    var error = _validate("upload", data);

    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    return new Promise( (resolve, reject) => {
        if (error) {
            console.error(error);
            if (callback && typeof callback === 'function') {
                callback(null);
            }
            reject(error);
            return;
        }

        this.api.upload(data, options, (res) => { 
            // if there is only one reponse return response object rather than array
            try {
               if(res.length === 1) {
                    res = res[0];
               } 
            } catch(e) {
              // no-op
            }        
            
            resolve(res);

            if(callback && typeof callback === 'function') {
                callback(res);
            }
        });
    
    });    
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

Sample response:
{
    "status": "success",
    "record": {
        "email": "saifali9690@gmail.com",
        "profileData": {
            "Last Score": 308,
            "High Score": 308,
            "Replayed": true
        },
        "events": {
            "App Launched": {
                "count": 10,
                "first_seen": 1457271567,
                "last_seen": 1458041215
            },
            "Charged": {
                "count": 6,
                "first_seen": 1457962417,
                "last_seen": 1458041276
            }
        }
    }
}

For more see https://support.clevertap.com/server/downloading-profiles-and-actions/#user-profile-by-id 

*/
CleverTap.prototype.profile = function(options, callback) {
    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    var error = null;

    if(!options.email && !options.identity && !options.objectId) {
        error = "profile requires email, identity or objectId";
    }    

    return new Promise( (resolve, reject) => {
        if (error) {
            console.error(error);
            if (callback && typeof callback === 'function') {
                callback(null);
            }
            reject(error);
            return;
        }

        this.api.profile(options, (res) => { 

            resolve(res);

            if(callback && typeof callback === 'function') {
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

Sample queries:  
var query = {
                "event_name":"App Launched",
                "from": 20150810,
                "to": 20151025
            }   

var query = {
                "event_name": "choseNewFavoriteFood",
                "props": [{"name":"value","operator":"contains", "value":"piz"}],
                "from": 20150810,
                "to": 20151025
            }


Available query operators are: “equals”, “greater_than”, “greater_than_equals”, “less_than”, “less_than_equals”, “contains”.
The operator is optional and defaults to “equals”.

Sample result:
[ 
        { 
            "push_token" : "95f98af6ad9a5e714a56c5bf527a78cb1e3eda18d2f23bc8591437d0d8ae71a3" , 
            "identity" : "5555555555" , 
            "profileData": {"favoriteFood": "pizza"},
            "platformInfo" : [ 
                { "platform" : "iOS" , 
                  "objectId" : "-1a063854f83a4c6484285039ecff87cb"} , 
                { "platform" : "Web" , 
                  "objectId" : "a8ffcbc9-a747-4ee3-a791-c5e58ad03097"}
            ]
        }
]

For more see https://support.clevertap.com/server/downloading-profiles-and-actions/#user-profiles 

*/
CleverTap.prototype.profiles = function(query, options, callback) {

    var error = _validate("profiles", query);

    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    return new Promise( (resolve, reject) => {
        if (error) {
            console.error(error);
            if (callback && typeof callback === 'function') {
                callback(null);
            }
            reject(error);
            return;
        }

        this.api.profiles(query, options, (res) => { 

            resolve(res);

            if(callback && typeof callback === 'function') {
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

Sample queries:  
var query = {
                "event_name":"App Launched",
                "from": 20150810,
                "to": 20151025
            }   

var query = {
                "event_name": "choseNewFavoriteFood",
                "props": [{"name":"value","operator":"contains", "value":"piz"}],
                "from": 20150810,
                "to": 20151025
            }


Available query operators are: “equals”, “greater_than”, “greater_than_equals”, “less_than”, “less_than_equals”, “contains”.
The operator is optional and defaults to “equals”.

Sample result:
 [ 
        { 
            "profile": { 
                "objectId": "a8ffcbc9-a747-4ee3-a791-c5e58ad03097", 
                "platform": "Web", 
                "email": "peter@foo.com", 
                "profileData": { "favoriteColor" : "blue"}, 
                "identity" : "5555555555", 
                "id": 33
                }, 
                "ts": 20151023140416, 
                "event_props": { "value" : "pizza"}
        }, 
        { 
            "profile": { 
                "objectId": "a8ffcbc9-a747-4ee3-a791-c5e58ad03097", 
                "platform": "Web", 
                "email": "peter@foo.com", 
                "profileData": { "favoriteColor" : "blue"}, 
                "identity": "5555555555", 
                "id": 33
            }, 
            "ts": 20151024121636, 
            "event_props" : { "value" : "pizza"}
        }
   ]

For more see https://support.clevertap.com/server/downloading-profiles-and-actions/#user-actions 

*/
CleverTap.prototype.events = function(query, options, callback) {

    var error = _validate("profiles", query);

    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    return new Promise( (resolve, reject) => {
        if (error) {
            console.error(error);
            if (callback && typeof callback === 'function') {
                callback(null);
            }
            reject(error);
            return;
        }

        this.api.events(query, options, (res) => { 

            resolve(res);

            if(callback && typeof callback === 'function') {
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

CleverTap.prototype.targets = function(action, payload, options, callback) {
    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    var error = null;
    if (!action || this.TARGET_ACTIONS.indexOf(action) < 0) {
        error = `Invalid push target action ${action}`;
    }

    var _action = action;

    if (action == this.TARGET_ESTIMATE) {
        payload['estimate_only'] = true;
        action = this.TARGET_CREATE;
    }

    options.action = action;

    if (!error) {
        error = _validate(_action, payload);
    }

    options.data = payload;

    options.method = "POST";

    return new Promise( (resolve, reject) => {
        if (error) {
            console.error(error);
            if (callback && typeof callback === 'function') {
                callback(null);
            }
            reject(error);
            return;
        }

        this.api.targets(options, (res) => { 

            resolve(res);

            if(callback && typeof callback === 'function') {
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
        if(!data || typeof(data) !== "object") {
            error = `CleverTap.${type}: query must be an object: ${JSON.stringify(data)}`; 
        }    
    }    

    if (type === "profiles") {
        if(!data || typeof(data) !== "object") {
            error = `CleverTap.${type}: query must be an object: ${JSON.stringify(data)}`; 
        }    
    }    

    if (type === "upload") {
        data = data ? data : [];

        var identity = null,
            profileData = null;
            recordType = null;

        const validRecordTypes = ["event", "profile"];

        for (var record of data) {

            identity = record.identity || record.FBID || record.GPID || record.objectId;  
            if(!identity) {
                error = `upload record must contain an identity, FBID, GPID or objectId field: ${JSON.stringify(record)}`; 
                break;    
            }    

            recordType = record.type;
            if(validRecordTypes.indexOf(recordType) === -1) {
                error = `CleverTap.${type}: record type must be 'profile' or 'event': ${JSON.stringify(record)}`; 
                break;
            }    
            if(recordType === "profile") {
                profileData = record.profileData;
                if(!profileData || typeof(profileData) !== "object") {
                    error = `CleverTap.${type}: record with type '${recordType}' must contain a 'profileData' object: ${JSON.stringify(record)}`; 
                    break;
                }    
            }    

            if(recordType === "event") {
                evtData = record.evtData;
                if(!evtData || typeof(evtData) !== "object") {
                    error = `CleverTap.${type}: record with type '${recordType}' must contain a 'evtData' object: ${JSON.stringify(record)}`; 
                    break;
                }    
            }    
            
        }    
    }       

    return error;
};


var init = (CleverTapAccountId, CleverTapAccountPasscode,CleverTapEndPoint) => {
    return new CleverTap(CleverTapAccountId, CleverTapAccountPasscode,CleverTapEndPoint);
};

module.exports = {
    "init":init
};
