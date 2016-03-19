const CT_ACCOUNT_ID = "948-4KK-444Z"
const CT_ACCOUNT_PASSCODE = "QAE-AWB-AAAL"

const CleverTap = require('./lib/clevertap');
const clevertap = CleverTap.init(CT_ACCOUNT_ID, CT_ACCOUNT_PASSCODE);

var t = Math.floor((new Date).getTime()/1000);

var data = [
            {"type":"event",
                "identity":"6264372124",
                "evtName":"choseNewFavoriteFood", 
                "evtData":{
                    "value":"sushi"
                    },
                },

            {"type":"profile", 
                "identity":"6264372124",
                "ts":t, 
                "profileData":{
                    "favoriteColor":"green",
                    "Age":30,
                    "Phone":"+14155551234",
                    "Email":"peter@foo.com",
                    }, 
                },

            {"type":"event",
              "FBID":"34322423",
              "evtName":"Product viewed",
              "evtData":{
                "Product name":"Casio Chronograph Watch",
                "Category":"Mens Watch",
                "Price":59.99,
                "Currency":"USD"
                },
              },

            {'type': 'profile',
                'objectId': "-2ce3cca260664f70b82b1c6bb505f462", 
                'profileData': {'favoriteFood': 'hot dogs'}
                }, 

            {'type': 'event',
                'objectId': "-2ce3cca260664f70b82b1c6bb505f462",
                'evtName': 'choseNewFavoriteFood',
                'evtData': {}
                },

            {"type":"event",
              "identity":"jack@gmail.com",
              "ts":t,
              "evtName":"Charged",
              "evtData":{
                "Amount":300,
                "Currency":"USD",
                "Payment mode":"Credit Card",
                "Items":[
                  {
                    "Category":"books",
                    "Book name":"The millionaire next door",
                    "Quantity":1
                    },
                  {
                    "Category":"books",
                    "Book name":"Achieving inner zen",
                    "Quantity":4
                    }
                  ]
                },
              },
            ];


// callback style
clevertap.upload(data, {"debug":1, batchSize:1000}, (res) => {_log("upload", res)});

// or if you prefer Promises
//clevertap.upload(data, {"debug":1, batchSize:1000}).then( (res) => {_log("upload", res)} );

var eventsQuery = {"event_name":
            "choseNewFavoriteFood",
            "props": 
            [{"name":"value","operator":"contains", "value":"piz"}],
            "from": 20150810,
            "to": 20151025
        }

// callback style
//clevertap.events(eventsQuery, {debug:1, batchSize:6000}, (res) => {_log("events", res)});

// or if you prefer Promises
clevertap.events(eventsQuery, {debug:1, batchSize:6000}).then( (res) => {_log("events", res)} );

//callback style
//clevertap.profile({"objectId":"-2ce3cca260664f70b82b1c6bb505f462", debug:1}, (res) => {_log("profile", res)});

// or if you prefer Promises
clevertap.profile({"objectId":"-2ce3cca260664f70b82b1c6bb505f462", debug:1}).then( (res) => {_log("profile", res)} );

var profilesQuery = {"event_name":
            "choseNewFavoriteFood",
            "props": 
            [{"name":"value","operator":"contains", "value":"piz"}],
            "from": 20150810,
            "to": 20151025
        }

//callback style
//clevertap.profiles(profilesQuery, {debug:1, batchSize:200}, (res) => {_log("profiles", res)});

// or if you prefer Promises
clevertap.profiles(profilesQuery, {debug:1, batchSize:200}).then( (res) => {_log("profiles", res)} );

var estimatePayload = {
        "name": "green freedom",
        "when": "now",
        "where": {
            "event_name": "App Launched",
            "from": 20160101,
            "to": 20160317,
            },
        "content":{
            "title":"Hello!",
            "body":"Strictly Green Lantern fans only!",
            "platform_specific": {
                "ios": {
                    "deep_link": "judepereira.com",
                    "sound_file": "judepereira.wav",
                    "category": "reactive",
                    "badge_count": 1,
                    "foo": "bar_ios"
                    },
                "android": {
                    "background_image": "http://judepereira.com/a.jpg",
                    "default_sound": true,
                    "deep_link": "judepereira.com",
                    "foo": "bar_android"
                    }
                }
            },
        "devices": [
            "android",
            "ios"
            ],
        }

//callback style
//clevertap.targets(clevertap.TARGET_ESTIMATE, estimatePayload, {"debug":1}, (res) => { _log(clevertap.TARGET_ESTIMATE, res)} );

// or if you prefer Promises
clevertap.targets(clevertap.TARGET_ESTIMATE, estimatePayload, {"debug":1}).then( (res) => { _log(clevertap.TARGET_ESTIMATE, res)} );

var createPayload = {
        "name": "green freedom",
        "when": "now",
        "where": {
            "event_name": "App Launched",
            "from": 20160101,
            "to": 20160317,
            },
        "content":{
            "title":"Hello!",
            "body":"Strictly Green Lantern fans only!",
            "platform_specific": {
                "ios": {
                    "deep_link": "judepereira.com",
                    "sound_file": "judepereira.wav",
                    "category": "reactive",
                    "badge_count": 1,
                    "foo": "bar_ios"
                    },
                "android": {
                    "background_image": "http://judepereira.com/a.jpg",
                    "default_sound": true,
                    "deep_link": "judepereira.com",
                    "foo": "bar_android"
                    }
                }
            },
        "devices": [
            "ios"
            ],
        }

//callback style
//clevertap.targets(clevertap.TARGET_CREATE, createPayload, {"debug":1}, (res) => { _log(clevertap.TARGET_CREATE, res)} );

// or if you prefer Promises
clevertap.targets(clevertap.TARGET_CREATE, createPayload, {"debug":1}).then( (res) => { _log(clevertap.TARGET_CREATE, res)} );

var listPayload = {"from": 20160101, "to": 20160317}

//callback style
//clevertap.targets(clevertap.TARGET_LIST, listPayload, {"debug":1}, (res) => { _log(clevertap.TARGET_LIST, res)} );

// or if you prefer Promises
clevertap.targets(clevertap.TARGET_LIST, listPayload, {"debug":1}).then( (res) => { _log(clevertap.TARGET_LIST, res)} );

var stopPayload = {"id": 1458261857}

//callback style
//clevertap.targets(clevertap.TARGET_STOP, stopPayload, {"debug":1}, (res) => { _log(clevertap.TARGET_STOP, res)} );

// or if you prefer Promises
clevertap.targets(clevertap.TARGET_STOP, stopPayload, {"debug":1}).then( (res) => { _log(clevertap.TARGET_STOP, res)} );

var resultPayload = {"id": 1458261857}

//callback style
//clevertap.targets(clevertap.TARGET_RESULT, resultPayload, {"debug":1}, (res) => { _log(clevertap.TARGET_RESULT, res)} );

// or if you prefer Promises
clevertap.targets(clevertap.TARGET_RESULT, resultPayload, {"debug":1}).then( (res) => { _log(clevertap.TARGET_RESULT, res)} );

var _log = (type, result) => {
    console.log("\n");
    console.log(`${type} result is: `);
    console.log(JSON.stringify(result, null, 4));
};    

