const CLEVERTAP_REGIONS = {
  EUROPE: "eu1",
  INDIA: "in1",
  SINGAPORE: "sg1",
  US: "us1",
};

const VALID_REGIONS = [
  CLEVERTAP_REGIONS.EUROPE,
  CLEVERTAP_REGIONS.INDIA,
  CLEVERTAP_REGIONS.SINGAPORE,
  CLEVERTAP_REGIONS.US,
];

const regionIsValid = (region) => {
  return region && VALID_REGIONS.includes(region);
};

module.exports = {
  CLEVERTAP_REGIONS,
  VALID_REGIONS,
  regionIsValid,
};
