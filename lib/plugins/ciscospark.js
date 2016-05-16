import assert from 'assert';

// assert(process.env.CISCOSPARK_ACCESS_TOKEN);
// assert(process.env.CISCOSPARK_REFRESH_TOKEN);
assert(process.env.CISCOSPARK_CLIENT_ID);
assert(process.env.CISCOSPARK_CLIENT_SECRET);

import ciscospark from 'ciscospark/es6';

//const sparkMe = ciscospark.people.get(`me`);

function init(credentials, callback) {
  return ciscospark.init({
    credentials: {
      authorization: credentials
    },
    config: {
      hydraServiceUrl: ciscospark.config.hydraServiceUrl
    }
  });
  // return spark;
};

module.exports = {
  me: async function(credentials) {
    try {
      const spark = await init(credentials);
      const me = await spark.people.get('me');
      return me;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  authenticate: async function(code) {
    // Get authentication
    var spark = await ciscospark.init();
    await spark.authenticate(code);
    console.log(spark.credentials.authorization);
    return spark.credentials.authorization;
  }

}