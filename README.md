# clevertap-node

[![CI Status](http://img.shields.io/travis/CleverTap/clevertap-node.svg?style=flat)](https://travis-ci.org/CleverTap/clevertap-node)

Fully async Node.js server module for accessing the [CleverTap](https://clevertap.com/) Server API

## Install

`npm install clevertap`

## Usage  

```javascript

// require the library
const CleverTap = require('clevertap');

// init the library with your CleverTap Account Id and CleverTap Account Passcode
const clevertap = CleverTap.init(YOUR_CLEVERTAP_ACCOUNT_ID, YOUR_CLEVERTAP_ACCOUNT_PASSCODE);

// the library supports both callbacks and Promises

// upload an array of event/profile records callback style
clevertap.upload(data, {"debug":1, batchSize:50}, (res) => {console.log(res)});

// or if you prefer Promises
clevertap.upload(data, {"debug":1, batchSize:50}).then( (res) => {console.log(res)} );

// query for events
var query = {"event_name":"choseNewFavoriteFood",
              "props": 
                [{"name":"value","operator":"contains", "value":"piz"}],
              "from": 20150810,
              "to": 20151025
            };

//callback style
clevertap.events(query, {debug:1, batchSize:500}, (res) => {console.log(res)});

// or if you prefer Promises
clevertap.events(query, {debug:1, batchSize:500}).then( (res) => {console.log(res)} );

//query for user profiles
var query = {"event_name":"choseNewFavoriteFood",
              "props": 
                [{"name":"value","operator":"contains", "value":"piz"}],
              "from": 20150810,
              "to": 20151025
            }

//callback style
clevertap.profiles(query, {debug:1, batchSize:200}, (res) => {console.log(res)});

// or if you prefer Promises
clevertap.profiles(query, {debug:1, batchSize:200}).then( (res) => {console.log(res)} );

// send a push notification
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
clevertap.targets(clevertap.TARGET_CREATE, createPayload, {"debug":1}, (res) => {console.log(res)} );

// or if you prefer Promises
clevertap.targets(clevertap.TARGET_CREATE, createPayload, {"debug":1}).then( (res) => {console.log(res)} );

```

See [example.js](https://github.com/CleverTap/clevertap-node/blob/master/example.js) for more detailed usage.

Also please see our [Server API documentation](https://support.clevertap.com/server/overview/).

## Tests
```
npm install  
npm test // all tests 
npm run testpush // just push specific tests
```
