const assert = require("assert");
const CleverTap = require("../lib/clevertap");

const CT_ACCOUNT_ID = "W9R-486-4W5Z";
const CT_ACCOUNT_PASSCODE = "dca1d7eb2b064d098fbb964b08cfb9f0";
const CT_ACCOUNT_REGION = "eu1"; // will default to CleverTap.REGIONS.EUROPE

const clevertap = CleverTap.init(
  CT_ACCOUNT_ID,
  CT_ACCOUNT_PASSCODE,
  CT_ACCOUNT_REGION
);

const t = Math.floor(new Date().getTime() / 1000);

describe("#profile()", function () {
  it("should return 1 user profile with a status of success", function () {
    return clevertap
      .profile({ objectId: "-2ce3cca260664f70b82b1c6bb505f462" })
      .then((res) => {
        if (!res) res = {};
        assert(res.record != null);
      });
  });
  it("should return 1 user profile with a status of success", function () {
    return clevertap.profile({ email: "jack@gmail.com" }).then((res) => {
      if (!res) res = {};
      assert(res.record != null);
    });
  });
});

const profilesQuery = {
  event_name: "App Launched",
  from: 20171201,
  to: 20171225,
};
describe("#profiles()", function () {
  it("should return 1 user profile", function () {
    return clevertap.profiles(profilesQuery).then((res) => {
      if (!res) res = {};
      assert.equal(1, res.records?.length);
    });
  });
});

const uploadData = [
  {
    objectId: "25b08803c1af4e00839f530264dac6f8",
    type: "profile",
    profileData: { Name: "Jack Test" },
  },
  {
    FBID: "34322423",
    ts: 1468308340,
    type: "event",
    evtName: "Product viewed",
    evtData: {
      "Product name": "Casio Chronograph Watch",
      Category: "Mens Watch",
      Price: 59.99,
      Currency: "USD",
    },
  },
];
describe("#upload()", function () {
  it("should upload 1 profile and 1 event", function () {
    return clevertap.upload(uploadData, { batchSize: 1000 }).then((res) => {
      if (!res) res = {};
      assert.equal(2, res.processed);
    });
  });
});

// Define the uploadDeviceTokenQuery object which includes the identities, properties
const uploadDeviceTokensQuery = [
  {
    type: "token",
    tokenData: {
      id: "frfsgvrwe:APfdsafsgdfsgghfgfgjkhfsfgdhjhbvcvnetry767456fxsasdf",
      type: "chrome",
      keys: {
        p256dh:
          "BLc4xRzKlKORKWlbdgFaBrrPK3ydWAHo4M0gs0i1oEKgPpWC5cW8OCzVrOQRv-1npXRWk8udnW3oYhIO4475rds=",
        auth: "5I2Bu2oKdyy9CwL8QVF0NQ==",
      },
    },
    objectId: "QBOpVJZmKilRAzfaiVS86Tovxm75lHxg",
  },
];
describe("#uploadDeviceTokens()", function () {
  it("should upload device token", function () {
    return clevertap.uploadDeviceTokens(uploadDeviceTokensQuery).then((res) => {
      if (!res) res = {};
      assert.equal(1, res.processed);
    });
  });
});

// Define the getProfilesCount object which includes the identities, properties
var getProfilesCountQuery = {
  event_name: "React Web Test",
  from: 20180810,
  to: 20231025,
};
describe("#getProfilesCount()", function () {
  it("should return success response", function () {
    return clevertap.getProfilesCount(getProfilesCountQuery).then((res) => {
      if (!res) res = [];
      assert(res.status === "success" || res.status === "partial");
    });
  });
});

// Define the deleteQuery object which includes the identities, properties
var deleteQuery = { guid: "df2e224d90874887b4d61153ef3a2508" };
describe("#delete()", function () {
  it("should delete the profile", function () {
    return clevertap.delete(deleteQuery).then((res) => {
      if (!res) res = {};
      assert.equal("success", res.status);
    });
  });
});

// Define the demergeQuery object which includes the identities, properties
var demergeQuery = {
  identities: ["client-19827239", "abc@ct.com"],
};
describe("#demerge()", function () {
  it("should demerge profiles", function () {
    return clevertap.demerge(demergeQuery).then((res) => {
      if (!res) res = [];
      assert.equal("success", res.status);
    });
  });
});

// Define the subscribeQuery object which includes the identities, properties
var subscribeQuery = {
  d: [
    { type: "phone", value: "+919213231415", status: "Unsubscribe" },
    { type: "phone", value: "+919213231416", status: "Resubscribe" },
    { type: "email", value: "johndoe@abc.com", status: "Unsubscribe" },
    { type: "email", value: "janedoe@abc.com", status: "Resubscribe" },
  ],
};
describe("#subscribe()", function () {
  it("should return success response", function () {
    return clevertap.subscribe(subscribeQuery).then((res) => {
      if (!res) res = [];
      assert(res.status === "success" || res.status === "partial");
    });
  });
});

// Define the disassociateQuery object which includes the identities, properties
var disassociateQuery = {
  d: [
    { type: "phone", value: "+919213231415" },
    { type: "phone", value: "+919213231416" },
  ],
};
describe("#disassociate()", function () {
  it("should return success response", function () {
    return clevertap.disassociate(disassociateQuery).then((res) => {
      if (!res) res = [];
      assert(res.status === "success" || res.status === "partial");
    });
  });
});

const eventsQuery = {
  event_name: "App Launched",
  from: 20171201,
  to: 20171225,
};
describe("#events()", function () {
  it("should return at least 1 event", function () {
    return clevertap.events(eventsQuery).then((res) => {
      if (!res) res = [];
      assert.equal(1, res.records?.length);
    });
  });
});

// Define the getEventsCountQuery object which includes the identities, properties
var getEventsCountQuery = {
  event_name: "React Web Test",
  from: 20180810,
  to: 20231025,
};
describe("#getEventsCount()", function () {
  it("should return success response", function () {
    return clevertap.getEventsCount(getEventsCountQuery).then((res) => {
      if (!res) res = [];
      assert(res.status === "success" || res.status === "partial");
    });
  });
});

// Define the getCampList object which campaign Id
const createCampaignData = {
  name: "My Webpush API campaign",
  estimate_only: true,
  target_mode: "webpush",
  where: {
    event_name: "Charged",
    from: 20171001,
    to: 20171220,
    common_profile_properties: {
      profile_fields: [
        {
          name: "Customer Type",
          operator: "equals",
          value: "Platinum",
        },
      ],
    },
  },
  respect_frequency_caps: false,
  content: {
    title: "Hi!",
    body: "How are you doing today?",
    platform_specific: {
      safari: {
        deep_link: "https://www.google.com",
        ttl: 10,
      },
      chrome: {
        image: "https://www.exampleImage.com",
        icon: "https://www.exampleIcon.com",
        deep_link: "http://www.example.com",
        ttl: 10,
        require_interaction: true,
        cta_title1: "title",
        cta_link1: "http://www.example2.com",
        cta_iconlink1: "https://www.exampleIcon2.com",
      },
      firefox: {
        icon: "https://www.exampleIcon.com",
        deep_link: "https://www.google.com",
        ttl: 10,
      },
      kaios: {
        icon: "https://www.exampleIcon.com",
        ttl: 10,
        kaiosKV: {
          key1: "value1",
          key2: "value2",
        },
      },
    },
  },
  devices: ["web"],
  when: "now",
};
describe("#createCampaign()", function () {
  it("should create campaign with given data", function () {
    return clevertap.targets("create", createCampaignData).then((res) => {
      if (!res) res = {};
      assert.equal("success", res.status);
    });
  });
});

// Define the stopScheduledCampaign object which campaign Id
const stopScheduledCampaign = { id: 1652101199 };
describe("#stopScheduledCampaign()", function () {
  it("should stop the campaign", function () {
    return clevertap.targets("stop", stopScheduledCampaign).then((res) => {
      if (!res) res = {};
      assert.equal("success", res.status);
    });
  });
});

// Define the getCampReport object which campaign Id
const getCampReport = { id: 1646808734 };
describe("#getCampReport()", function () {
  it("should return campaign report", function () {
    return clevertap.targets("result", getCampReport).then((res) => {
      if (!res) res = {};
      assert.equal("success", res.status);
    });
  });
});

// Define the getCampList object which campaign Id
const getCampList = { from: 20230401, to: 20230416 };
describe("#getCampList()", function () {
  it("should return campaign list for the given range", function () {
    return clevertap.targets("list", getCampList).then((res) => {
      if (!res) res = {};
      assert.equal("success", res.status);
    });
  });
});

// Define the getMessageReportsQuery object which includes the identities, properties
var getMessageReportsQuery = { from: "20171101", to: "20171225" };
describe("#getMessageReports()", function () {
  it("should return success response", function () {
    return clevertap.getMessageReports(getMessageReportsQuery).then((res) => {
      if (!res) res = [];
      assert.equal("success", res.status);
    });
  });
});

// Define the realTimeCountsQuery object which includes the identities, properties
var realTimeCountsQuery = { user_type: true };
describe("#realTimeCounts()", function () {
  it("should return success response", function () {
    return clevertap.realTimeCounts(realTimeCountsQuery).then((res) => {
      if (!res) res = [];
      assert.equal("success", res.status);
    });
  });
});

// Define the topPropertyCountsQuery object which includes the identities, properties
var topPropertyCountsQuery = {
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
describe("#topPropertyCounts()", function () {
  it("should return top property count", function () {
    return clevertap.topPropertyCounts(topPropertyCountsQuery).then((res) => {
      if (!res) res = [];
      assert(res.status === "success" || res.status === "partial");
    });
  });
});

// Define the trendsQuery object which includes the identities, properties
var trendsQuery = {
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
describe("#trends()", function () {
  it("should return success response", function () {
    return clevertap.trends(trendsQuery).then((res) => {
      if (!res) res = [];
      assert(res.status === "success" || res.status === "partial");
    });
  });
});
