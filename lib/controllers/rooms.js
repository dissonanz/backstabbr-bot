import assert from 'assert';
var ciscospark = require('../plugins/ciscospark');
import combinatorics from 'js-combinatorics';

const RoomsForTwo = combinatorics.combination(['AUS','ENG','GER','RUS','TUR','ITA','FRA'],2);
const RoomsForThree = combinatorics.combination(['AUS','ENG','GER','RUS','TUR','ITA','FRA'],3);

export async function list(request, reply) {
  // Get the room list from spark
  try {
    const rooms = await ciscospark.rooms(request.auth.credentials.spark.authorization);
    reply(JSON.stringify(rooms))
      .type('application/json');
  } catch (error) {
    console.error(error.stack);
  }
};

export async function remove(request, reply) {
  // Remove the room from spark
  try {
    const room = await ciscospark.roomRemove(request.auth.credentials.spark.authorization, request.params.id);
    reply(room)
      .redirect('/rooms')
      .replacer('get');
  } catch (err) {
    reply(err);
  }
};

export async function create(request, reply) {
  // Add a new room to spark
  try {
    console.log(request.payload);
    const room = await ciscospark.roomCreate(request.auth.credentials.spark.authorization, request.payload.title);
    reply(room);
  } catch (err) {
    console.log(err);
    reply(err);
  }
};

export async function get(request, reply) {
  // Get the room list from spark
  const rooms = await ciscospark.rooms(request.auth.credentials.spark.authorization);
  var response = {};
  for (const room of rooms) {
    try {
      console.log(`Checking ${room.title}`);
      assert(room.title.match('\ ' + request.params.gameId + '$'));
      response[room.id] = room.title;
    }
    catch(reason) {
      console.log(reason);
    }
  }
  reply(JSON.stringify(response))
  .type('application/json');
};

export async function createGameRooms(request, reply) {
  RoomsForTwo.forEach( function(r) {
    console.log(`creating room for ${r}`);
    ciscospark.roomCreate(request.auth.credentials.spark.authorization, r + " " + request.params.gameId);
  });
  ciscospark.roomCreate(request.auth.credentials.spark.authorization, "Full Board" + " " + request.params.gameId);
  reply("Rooms created").redirect(`/rooms/${request.params.gameId}`);
};

export async function removeGameRooms(request, reply) {
  // Get the room list from spark
  const rooms = await ciscospark.rooms(request.auth.credentials.spark.authorization);
  var response = {};
  for (const room of rooms) {
    try {
      assert(room.title.match('\ ' + request.params.gameId + '$'));
      ciscospark.roomRemove(request.auth.credentials.spark.authorization, room.id);
    }
    catch(reason) {
      console.log(reason);
    }
  }
  reply(JSON.stringify(response))
  .type('application/json');
};

