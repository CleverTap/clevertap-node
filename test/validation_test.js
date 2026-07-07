const assert = require("assert");
const CleverTap = require("../lib/clevertap");

// Fake credentials — validation runs before any API call is made
const clevertap = CleverTap.init("FAKE_ID", "FAKE_PASSCODE", "eu1");

describe("upload() event record validation", function () {
  it("rejects event record missing evtData", function () {
    return clevertap
      .upload([{ objectId: "user1", type: "event", evtName: "Product Viewed" }])
      .then(
        () => assert.fail("expected validation to reject"),
        (err) =>
          assert(
            String(err).includes("evtData"),
            `expected error about evtData, got: ${err}`
          )
      );
  });

  it("rejects event record with non-object evtData", function () {
    return clevertap
      .upload([
        {
          objectId: "user1",
          type: "event",
          evtName: "Product Viewed",
          evtData: "not an object",
        },
      ])
      .then(
        () => assert.fail("expected validation to reject"),
        (err) =>
          assert(
            String(err).includes("evtData"),
            `expected error about evtData, got: ${err}`
          )
      );
  });

  it("rejects event record with null evtData", function () {
    return clevertap
      .upload([
        {
          objectId: "user1",
          type: "event",
          evtName: "Product Viewed",
          evtData: null,
        },
      ])
      .then(
        () => assert.fail("expected validation to reject"),
        (err) =>
          assert(
            String(err).includes("evtData"),
            `expected error about evtData, got: ${err}`
          )
      );
  });

  // Regression: evtData was undeclared before the loop, causing ReferenceError
  // in strict-mode environments such as esbuild-bundled output.
  it("does not throw ReferenceError for event record with valid evtData", function () {
    return clevertap
      .upload([
        {
          objectId: "user1",
          type: "event",
          evtName: "Product Viewed",
          evtData: { product: "Widget", price: 9.99 },
        },
      ])
      .then(
        () => {},
        (err) =>
          assert(
            !(err instanceof ReferenceError),
            `unexpected ReferenceError: ${err.message || err}`
          )
      );
  });

  it("rejects second event record in batch when it is missing evtData", function () {
    return clevertap
      .upload([
        {
          objectId: "user1",
          type: "event",
          evtName: "First Event",
          evtData: { step: 1 },
        },
        {
          objectId: "user2",
          type: "event",
          evtName: "Second Event",
          // evtData intentionally missing
        },
      ])
      .then(
        () => assert.fail("expected validation to reject"),
        (err) =>
          assert(
            String(err).includes("evtData"),
            `expected error about evtData, got: ${err}`
          )
      );
  });
});