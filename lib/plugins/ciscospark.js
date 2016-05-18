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
};

async function rooms(credentials, max = 100) {
  try {
    const spark = await init(credentials);
    const rooms = await spark.rooms.list({
      max: max
    });
    return rooms;
  } catch (err) {
    console.log(err);
    return err;
  }
};

async function roomRemove(credentials, roomId) {
  try {
    const spark = await init(credentials);
    console.log(`Trying to remove room ${roomId}`);
    await spark.rooms.remove(roomId);
    try {
      const room = await spark.rooms.get(roomId);
      assert(false, `room was not deleted`);
      console.log(room);
      return(room);
    }
    catch (reason) {
      assert.equal(reason.statusCode, 404);
      console.log(reason);
      return({message: `Room ${roomId} deleted`});
    }
  }
  catch (err) {
    console.log(err);
    return err;
  }
};

async function roomCreate(credentials, title) {
  try {
    const spark = await init(credentials);
    const room = await spark.rooms.create({title: title});
    assert(room.id);
    assert(room.title);
    assert(room.created);
    return room;
  } catch(err) {
    console.log(err);
    return err;
  }
};

module.exports = {
  me: getMe,
  getAuth: async function(code) {
    // Get authentication
    var spark = await ciscospark.init();
    await spark.authenticate(code);
    const creds = JSON.stringify(spark.credentials.authorization);
    return JSON.parse(creds);
  },
  rooms: rooms,
  roomRemove: roomRemove,
  roomCreate: roomCreate

}