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

```

See [example.js](https://github.com/CleverTap/clevertap-node/blob/master/example.js) for more detailed usage.

Also please see our [Server API documentation](https://support.clevertap.com/server/overview/).

## Tests
```
npm install  
npm test
```
