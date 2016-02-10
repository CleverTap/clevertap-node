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

    this.api.upload(data, options, (res) => { 
        if(callback) {
            callback(res);
        }
    });
};


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

    this.api.profiles(query, options, (res) => { 
        if(callback) {
            callback(res);
        }
    });
};


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

    this.api.events(query, options, (res) => { 
        if(callback) {
            callback(res);
        }
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
