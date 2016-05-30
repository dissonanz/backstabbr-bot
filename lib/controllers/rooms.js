import assert from 'assert';
var ciscospark = require('../plugins/ciscospark');
import combinatorics from 'js-combinatorics';
var room = require('../db/room');

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
    const dbRoom = await ciscospark.roomRemove(request.auth.credentials.spark.authorization, request.params.id);
    await room.delete(dbRoom);
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
    const newRoom = await ciscospark.roomCreate(request.auth.credentials.spark.authorization, request.payload.title);
    console.log(newRoom);
    const dbRoom = await room.add(newRoom);
    console.log(dbRoom);
    reply(newRoom);
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
  try {
    RoomsForTwo.forEach( async function(r) {
      console.log(`creating room for ${r}`);
      var newRoom = await ciscospark.roomCreate(request.auth.credentials.spark.authorization, r + " " + request.params.gameId);
      console.log(newRoom);
      var dbRoom = await room.add(newRoom);
      await room.addToGame(dbRoom[0].id, request.params.gameId);
    });
    var newRoom = await ciscospark.roomCreate(request.auth.credentials.spark.authorization, "Full Board" + " " + request.params.gameId);
    var dbRoom = await room.add(newRoom);
    await room.addToGame(dbRoom[0].id, request.params.gameId);
    reply("Rooms created").redirect(`/rooms/${request.params.gameId}`);
  } catch (err) {
    console.log(err);
    reply(err);
  }
};

export async function removeGameRooms(request, reply) {
  // Get the room list from spark
  const rooms = await ciscospark.rooms(request.auth.credentials.spark.authorization);
  var response = {};
  for (const r of rooms) {
    try {
      assert(r.title.match('\ ' + request.params.gameId + '$'));
      await ciscospark.roomRemove(request.auth.credentials.spark.authorization, r.id);
      await room.remove(r);
    }
    catch(reason) {
      console.log(reason);
    }
  }
  reply(JSON.stringify(response))
  .type('application/json');
};

