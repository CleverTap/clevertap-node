const assert = require('assert');
const CleverTap = require('../lib/clevertap');

const CT_ACCOUNT_ID = "948-4KK-444Z"
const CT_ACCOUNT_PASSCODE = "QAE-AWB-AAAL"
const CT_ACCOUNT_REGION = CleverTap.REGIONS.EUROPE

const clevertap = CleverTap.init(CT_ACCOUNT_ID, CT_ACCOUNT_PASSCODE, CT_ACCOUNT_REGION);

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
            "from": 20210101,
            "to": 20210701,
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


var listPayload = {"from": 20210101, "to": 20210701}

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

var deletePayload = {"id": 1629904249}

describe('#delete()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, deletePayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var demergePayload = {"id": 1629904249}

describe('#demerge()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, demergePayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var uploadEventsPayload = {"id": 1629904249}

describe('#uploadEvents()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, uploadEventsPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var getEventCountPayload = {"id": 1629904249}

describe('#getEventCount()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, getEventCountPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var uploadDeviceTokensPayload = {"id": 1629904249}

describe('#uploadDeviceTokens()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, uploadDeviceTokensPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var subscribePayload = {"id": 1629904249}

describe('#subscribe()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, subscribePayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var getCampaignsPayload = {"id": 1629904249}

describe('#getCampaigns()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, getCampaignsPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var getMessageReportsPayload = {"id": 1629904249}

describe('#getMessageReports()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, getMessageReportsPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var realTimeCountsPayload = {"id": 1629904249}

describe('#realTimeCounts()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, realTimeCountsPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var topPropertyCountsPayload = {"id": 1629904249}

describe('#topPropertyCounts()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, topPropertyCountsPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var trendsPayload = {"id": 1629904249}

describe('#trends()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, trendsPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var stopScheduledCampaignsPayload = {"id": 1629904249}

describe('#stopScheduledCampaigns()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, stopScheduledCampaignsPayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});
var disassociatePayload = {"id": 1629904249}

describe('#disassociate()', function () {
    it('should return status success', function () {
      return clevertap.targets(clevertap.TARGET_RESULT, disassociatePayload, {"debug":1}).then( (res) => {
          if (!res) res = {};
          assert.equal("success", res.status);
      });
    });
});


