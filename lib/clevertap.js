/**
 
 Copyright (c) 2016 CleverTap
 Released under the MIT license.

*/

const CleverTapAPI = require("./clevertap-api");

var CleverTap = function (CleverTapAccountId, CleverTapAccountPasscode) {
    if(!CleverTapAccountId) {
        throw new Error("Please provide a CleverTap Account Id");
    }

    if(!CleverTapAccountPasscode) {
        throw new Error("Please provide a CleverTap Account Passcode");
    }

    this.api = new CleverTapAPI(CleverTapAccountId, CleverTapAccountPasscode);
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

    if (!data || data.length <= 0) {
        throw new Error("CleverTap: upload data is empty");
    }

    var error = _validate("upload", data);
    if(error) {
        throw new Error(error);
    }    

    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    return new Promise( (resolve, reject) => {
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
    if (!query) {
        throw new Error("CleverTap.profiles requires a query object");
    }

    var error = _validate("profiles", query);
    if(error) {
        throw new Error(error);
    }    

    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    return new Promise( (resolve, reject) => {
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
    if (!query) {
        throw new Error("CleverTap.events requires a query object");
    }

    var error = _validate("profiles", query);
    if(error) {
        throw new Error(error);
    }    

    if (typeof(options) === 'function' || !options) {
        callback = options;
        options = {};
    }

    return new Promise( (resolve, reject) => {
        this.api.events(query, options, (res) => { 

            resolve(res);

            if(callback && typeof callback === 'function') {
                callback(res);
            }
        });
    });
};


var _validate = (type, data) => {
    var error = null;

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


var init = (CleverTapAccountId, CleverTapAccountPasscode) => {
    return new CleverTap(CleverTapAccountId, CleverTapAccountPasscode);
};

module.exports = {
    "init":init
};
