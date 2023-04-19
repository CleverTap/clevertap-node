# clevertap-node
[![npm version](https://badge.fury.io/js/clevertap.svg)](https://badge.fury.io/js/clevertap)

[![CI Status](https://app.travis-ci.com/CleverTap/clevertap-node.svg?branch=master)](https://app.travis-ci.com/CleverTap/clevertap-node)

Fully async Node.js server module for accessing the [CleverTap](https://clevertap.com/) Server API

## Install

`npm install clevertap`

## Usage  

```javascript

// require the library
const CleverTap = require('clevertap');
/**
 init the library with your CleverTap Account Id, CleverTap Account Passcode and CleverTap Account Region
 Clevertap Account Regions:
 EUROPE: 'eu1', // default for most accounts
 INDIA: 'in1',
 SINGAPORE: 'sg1',
 US: 'us1',
 INDONESIA: 'aps3',
 MIDDLEEAST: 'mec1'
*/
const clevertap = CleverTap.init(YOUR_CLEVERTAP_ACCOUNT_ID, YOUR_CLEVERTAP_ACCOUNT_PASSCODE, CleverTap.REGIONS.EUROPE);

// the library supports both callbacks and Promises

/* Upload Profile or events */
var data = [
  {
    type: "event",
    identity: "6264372124",
    evtName: "choseNewFavoriteFood",
    evtData: {
      value: "sushi",
    },
  },

  {
    type: "profile",
    identity: "6264372124",
    ts: t,
    profileData: {
      favoriteColor: "green",
      Age: 30,
      Phone: "+14155551234",
      Email: "peter@foo.com",
    },
  },

  {
    type: "event",
    FBID: "34322423",
    evtName: "Product viewed",
    evtData: {
      "Product name": "Casio Chronograph Watch",
      Category: "Mens Watch",
      Price: 59.99,
      Currency: "USD",
    },
  },

  {
    type: "profile",
    objectId: "-2ce3cca260664f70b82b1c6bb505f462",
    profileData: { favoriteFood: "hot dogs" },
  },

  {
    type: "event",
    objectId: "-2ce3cca260664f70b82b1c6bb505f462",
    evtName: "choseNewFavoriteFood",
    evtData: {},
  },

  {
    type: "event",
    identity: "jack@gmail.com",
    ts: t,
    evtName: "Charged",
    evtData: {
      Amount: 300,
      Currency: "USD",
      "Payment mode": "Credit Card",
      Items: [
        {
          Category: "books",
          "Book name": "The millionaire next door",
          Quantity: 1,
        },
        {
          Category: "books",
          "Book name": "Achieving inner zen",
          Quantity: 4,
        },
      ],
    },
  },
];
// callback style
clevertap.upload(data, { debug: 1, batchSize: 1000 }, (res) => {
  console.log(res);
});
// or if you prefer Promises
clevertap.upload(data, { debug: 1, batchSize: 1000 }).then((res) => {
  console.log(res);
});

/* Get Events data */
var eventsQuery = {
  event_name: "choseNewFavoriteFood",
  props: [{ name: "value", operator: "contains", value: "piz" }],
  from: 20150810,
  to: 20151025,
};
// callback style
clevertap.events(eventsQuery, { debug: 1, batchSize: 6000 }, (res) => {
  console.log(res);
});
// or if you prefer Promises
clevertap.events(eventsQuery, { debug: 1, batchSize: 6000 }).then((res) => {
  console.log(res);
});

/* Get profile info */
//callback style
clevertap.profile(
  { objectId: "-2ce3cca260664f70b82b1c6bb505f462", debug: 1 },
  (res) => {
    console.log(res);
  }
);
// or if you prefer Promises
clevertap
  .profile({ objectId: "-2ce3cca260664f70b82b1c6bb505f462", debug: 1 })
  .then((res) => {
    console.log(res);
  });

var profilesQuery = {
  event_name: "choseNewFavoriteFood",
  props: [{ name: "value", operator: "contains", value: "piz" }],
  from: 20150810,
  to: 20151025,
};
//callback style
clevertap.profiles(profilesQuery, { debug: 1, batchSize: 200 }, (res) => {
  console.log(res);
});
// or if you prefer Promises
clevertap.profiles(profilesQuery, { debug: 1, batchSize: 200 }).then((res) => {
  console.log(res);
});

/* Campaign API's - CREATE, ESTIMATE, LIST, RESULT, STOP, TARGET_ACTIONS */
var estimatePayload = {
  name: "green freedom",
  when: "now",
  where: {
    event_name: "App Launched",
    from: 20160101,
    to: 20160317,
  },
  content: {
    title: "Hello!",
    body: "Strictly Green Lantern fans only!",
    platform_specific: {
      ios: {
        deep_link: "judepereira.com",
        sound_file: "judepereira.wav",
        category: "reactive",
        badge_count: 1,
        foo: "bar_ios",
      },
      android: {
        background_image: "http://judepereira.com/a.jpg",
        default_sound: true,
        deep_link: "judepereira.com",
        foo: "bar_android",
      },
    },
  },
  devices: ["android", "ios"],
};
//callback style
clevertap.targets(
  clevertap.TARGET_ESTIMATE,
  estimatePayload,
  { debug: 1 },
  (res) => {
    console.log(res);
  }
);
// or if you prefer Promises
clevertap
  .targets(clevertap.TARGET_ESTIMATE, estimatePayload, { debug: 1 })
  .then((res) => {
    console.log(res);
  });

var createPayload = {
  name: "green freedom",
  when: "now",
  where: {
    event_name: "App Launched",
    from: 20160101,
    to: 20160317,
  },
  content: {
    title: "Hello!",
    body: "Strictly Green Lantern fans only!",
    platform_specific: {
      ios: {
        deep_link: "judepereira.com",
        sound_file: "judepereira.wav",
        category: "reactive",
        badge_count: 1,
        foo: "bar_ios",
      },
      android: {
        background_image: "http://judepereira.com/a.jpg",
        default_sound: true,
        deep_link: "judepereira.com",
        foo: "bar_android",
      },
    },
  },
  devices: ["ios"],
};
//callback style
clevertap.targets(
  clevertap.TARGET_CREATE,
  createPayload,
  { debug: 1 },
  (res) => {
    console.log(res);
  }
);
// or if you prefer Promises
clevertap
  .targets(clevertap.TARGET_CREATE, createPayload, { debug: 1 })
  .then((res) => { console.log(res); });

var listPayload = { from: 20160101, to: 20160317 };
//callback style
clevertap.targets(clevertap.TARGET_LIST, listPayload, { debug: 1 }, (res) => { console.log(res); });
// or if you prefer Promises
clevertap
  .targets(clevertap.TARGET_LIST, listPayload, { debug: 1 })
  .then((res) => {console.log(res);});

var stopPayload = { id: 1458261857 };
//callback style
clevertap.targets(clevertap.TARGET_STOP, stopPayload, { debug: 1 }, (res) => {console.log(res);});
// or if you prefer Promises
clevertap
  .targets(clevertap.TARGET_STOP, stopPayload, { debug: 1 })
  .then((res) => { console.log(res);});

var resultPayload = { id: 1458261857 };
//callback style
clevertap.targets(
  clevertap.TARGET_RESULT,
  resultPayload,
  { debug: 1 },
  (res) => {console.log(res);}
);
// or if you prefer Promises
clevertap
  .targets(clevertap.TARGET_RESULT, resultPayload, { debug: 1 })
  .then((res) => {console.log(res);});

/* Report API's */
// Get Message Reports
var getMessageReportspayload = { from: "20171101", to: "20171225" };
clevertap
  .getMessageReports(getMessageReportspayload, { debug: 1 })
  .then((res) => {console.log(res);});

// This endpoint enables you to get a real-time count of active users in the past five minutes in your app
var realTimeCountspayload = { user_type: true };
clevertap.realTimeCounts(realTimeCountspayload, { debug: 1 }).then((res) => {console.log(res);});

// This endpoint is used to retrieve counts for the most and least frequently occurring properties for a particular event in a specified duration
var topPropertyCountspayload = {
  event_name: "Charged",
  from: 20161229,
  to: 20170129,
  groups: {
    foo: {
      property_type: "event_properties",
      name: "Amount",
    },
    bar: {
      property_type: "profile_fields",
      name: "Customer Type",
      top_n: 2,
      order: "asc",
    },
  },
};
clevertap
  .topPropertyCounts(topPropertyCountspayload, { debug: 1 })
  .then((res) => {console.log(res);});

// This endpoint is used to retrieve daily, weekly, and monthly event trends in a specified duration.
var trendspayload = {
  event_name: "Charged",
  from: 20161224,
  to: 20170103,
  unique: false,
  sum_event_prop: "Amount",
  groups: {
    foo: {
      trend_type: "daily",
    },
    bar: {
      trend_type: "weekly",
    },
    foobar: {
      trend_type: "monthly",
    },
  },
};
clevertap.trends(trendspayload, { debug: 1 }).then((res) => {console.log(res);});



```

See [example.js](https://github.com/CleverTap/clevertap-node/blob/master/example.js) for more detailed usage.

Also please see our [Server API documentation](https://developer.clevertap.com/docs/api-overview).

## Tests
```
npm install  
npm test // all tests 
```
