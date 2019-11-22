const secrets = {
  dbUri: "mongodb://localhost:27017/jelotest1"
};

const getSecret = key => secrets[key];

module.exports = getSecret;
