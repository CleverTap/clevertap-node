const assert = require('assert');

const CT_ACCOUNT_ID = "948-4KK-444Z"
const CT_ACCOUNT_PASSCODE = "QAE-AWB-AAAL"
const CT_ENDPOINT = "eu1"

const CleverTap = require('../lib/clevertap');
const clevertap = CleverTap.init(CT_ACCOUNT_ID, CT_ACCOUNT_PASSCODE,CT_ENDPOINT);

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
            /*"props":
            [{"name":"value","operator":"contains", "value":"piz"}],*/
            "from": 20200814,
            "to": 20210814
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
           /* "props":
            [{"name":"value","operator":"contains", "value":"piz"}],*/
            "from": 20200814,
            "to": 20210814
        };

describe('#events()', function () {
    it('should return at least 1 event', function () {
      return clevertap.events(eventsQuery).then( (res) => {
          if (!res) res = [];
          assert(res.length >= 1);
      });
    });
});

