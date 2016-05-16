import assert from 'assert';

// assert(process.env.CISCOSPARK_ACCESS_TOKEN);
// assert(process.env.CISCOSPARK_REFRESH_TOKEN);
assert(process.env.CISCOSPARK_CLIENT_ID);
assert(process.env.CISCOSPARK_CLIENT_SECRET);

import ciscospark from 'ciscospark/es6';

function init(credentials) {
  return ciscospark.init({
    credentials: {
      authorization: credentials
    },
    config: {
      hydraServiceUrl: ciscospark.config.hydraServiceUrl
    }
  });
};

async function getMe(credentials) {
  try {
    const spark = await init(credentials);
    const me = await spark.people.get('me');
    return me;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = {
  me: getMe,
  getAuth: async function(code) {
    // Get authentication
    var spark = await ciscospark.init();
    await spark.authenticate(code);
    const creds = JSON.stringify(spark.credentials.authorization);
    return JSON.parse(creds);
  }

}