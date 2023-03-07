const assert = require('assert');
const CleverTap = require('../lib/clevertap');

const CT_ACCOUNT_ID = "948-4KK-444Z"
const CT_ACCOUNT_PASSCODE = "QAE-AWB-AAAL"
const CT_ACCOUNT_REGION = '' // will default to CleverTap.REGIONS.EUROPE

const clevertap = CleverTap.init(CT_ACCOUNT_ID, CT_ACCOUNT_PASSCODE, CT_ACCOUNT_REGION);

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


describe('#upload()', function () {
    it('should return 6 processed records', function () {
      return clevertap.upload(data, {batchSize:1000}).then( (res) => {
          if (!res) res = {};
          assert.equal(6, res.processed);
      });
    });
});


describe('#profile()', function () {
    it('should return 1 user profile with a status of success', function () {
      return clevertap.profile({"objectId":"-2ce3cca260664f70b82b1c6bb505f462"}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});


var profilesQuery = {"event_name":
            "choseNewFavoriteFood",
            "props":
            [{"name":"value","operator":"contains", "value":"piz"}],
            "from": 20210101,
            "to": 20210701
        };


describe('#profiles()', function () {
    it('should return 1 user profile', function () {
      return clevertap.profiles(profilesQuery).then( (res) => {
          if (!res) res = [];
          assert(res.length >= 1);
      });
    });
});


var eventsQuery = {"event_name":
            "choseNewFavoriteFood",
            "props":
            [{"name":"value","operator":"contains", "value":"piz"}],
            "from": 20210101,
            "to": 20210701
        };

describe('#events()', function () {
    it('should return at least 1 event', function () {
      return clevertap.events(eventsQuery).then( (res) => {
          if (!res) res = [];
          assert(res.length >= 1);
      });
    });
});
// Define the deleteQuery object which includes the identities, properties
var deleteQuery =  {"identity":
                    ["client-19827239", "abc"],
                    "props":
                    [{"name":"value","operator":"contains", "value":"piz"}],
                    "guid": ["ctid123", "ctid456"]
                    
              };

describe('#delete()', function () {
                it('should return success response', function () {
                  return clevertap.delete(deleteQuery).then( (res) => {
                      if (!res) res = [];
                      assert(res.length >= 1);
                  });
                });
    });
    // Define the demergeQuery object which includes the identities, properties
    var demergeQuery =  {"identity":
    ["client-19827239", "abc"],
    "props":
    [{"name":"value","operator":"contains", "value":"piz"}]

    };


describe('#demerge()', function () {
it('should return success response', function () {
  return clevertap.demerge(demergeQuery).then( (res) => {
      if (!res) res = [];
      assert(res.length >= 1);
  });
});
});
// Define the uploadEventsQuery object which includes the identities, properties
var uploadEventsQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#uploadEvents()', function () {
it('should return success response', function () {
return clevertap.uploadEvents(uploadEventsQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});
// Define the getEventCountQuery object which includes the identities, properties
var getEventCountQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#getEventCount()', function () {
it('should return success response', function () {
return clevertap.getEventCount(getEventCountQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the uploadDeviceTokenQuery object which includes the identities, properties
var uploadDeviceTokensQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#uploadDeviceTokens()', function () {
it('should return success response', function () {
return clevertap.uploadDeviceTokens(uploadDeviceTokensQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the subscribeQuery object which includes the identities, properties
var subscribeQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#subscribe()', function () {
it('should return success response', function () {
return clevertap.subscribe(subscribeQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the getCampaignsQuery object which includes the identities, properties
var getCampaignsQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#getCampaigns()', function () {
it('should return success response', function () {
return clevertap.getCampaigns(getCampaignsQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the getMessageReportsQuery object which includes the identities, properties
var getMessageReportsQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#getMessageReports()', function () {
it('should return success response', function () {
return clevertap.getMessageReports(getMessageReportsQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the realTimeCountsQuery object which includes the identities, properties
var realTimeCountsQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#realTimeCounts()', function () {
it('should return success response', function () {
return clevertap.realTimeCounts(realTimeCountsQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the topPropertyCountsQuery object which includes the identities, properties
var topPropertyCountsQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#topPropertyCounts()', function () {
it('should return success response', function () {
return clevertap.topPropertyCounts(topPropertyCountsQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the trendsQuery object which includes the identities, properties
var trendsQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#trends()', function () {
it('should return success response', function () {
return clevertap.trends(trendsQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the stopScheduledCampaignsQuery object which includes the identities, properties
var stopScheduledCampaignsQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#stopScheduledCampaigns()', function () {
it('should return success response', function () {
return clevertap.stopScheduledCampaigns(stopScheduledCampaignsQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

// Define the disassociateQuery object which includes the identities, properties
var disassociateQuery =  {"identity":
["client-19827239", "abc"],
"props":
[{"name":"value","operator":"contains", "value":"piz"}]

};


describe('#disassociate()', function () {
it('should return success response', function () {
return clevertap.disassociate(disassociateQuery).then( (res) => {
  if (!res) res = [];
  assert(res.length >= 1);
});
});
});

