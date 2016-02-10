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
        
CleverTap.prototype.repr = function () {
    this.api.repr();
};


CleverTap.prototype.upload = function(data, options, callback) {

    if (!data || data.length <= 0) {
        return [];
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
        return [];
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
        return [];
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


var init = (CleverTapAccountId, CleverTapAccountPasscode) => {
    return new CleverTap(CleverTapAccountId, CleverTapAccountPasscode);
};

module.exports = {
    "init":init
};
