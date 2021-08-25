const assert = require('assert');

const CT_ACCOUNT_ID = "948-4KK-444Z"
const CT_ACCOUNT_PASSCODE = "QAE-AWB-AAAL"
const CT_ENDPOINT = "eu1"

const CleverTap = require('../lib/clevertap');
const clevertap = CleverTap.init(CT_ACCOUNT_ID, CT_ACCOUNT_PASSCODE,CT_ENDPOINT);

var t = Math.floor((new Date).getTime()/1000);

var estimatePayload = {
        "name": "green freedom",
        "when": "now",
        "estimate_only": true,
        "where": {
            "event_name": "App Launched",
            "from": 20160101,
            "to": 20160801,
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
                    "foo": "bar_android",
                    "wzrk_cid":"BRTesting"
                }
                }
            },
        "devices": [
            "android",
            "ios"
            ],
        }

describe('#targets_estimate()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_ESTIMATE, estimatePayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});


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
                    "foo": "bar_android",
                    "wzrk_cid":"BRTesting"
                }
                }
            },
        "devices": [
            "android",
            "ios"
            ],
        }

describe('#targets_create()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_CREATE, createPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          id=res.id;
          assert.equal("success", res.status);
      });
    });
});


var listPayload = {"from": 20160101, "to": 20170101}

describe('#targets_list()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_LIST, listPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});


var stopPayload = {"id": 1629904249}

describe('#targets_stop()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_STOP, stopPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});


var resultPayload = {"id": 1629904249}

describe('#targets_result()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, resultPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
