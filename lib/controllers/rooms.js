import assert from 'assert';
const util = require('util');
var chatPlugin = require('../plugins/ciscospark');
var consts = require('../config/constants');
var helpers = require('../helpers/helpers');
var Game = require('../db/game');
var Room = require('../db/room');
var Webhook = require('../db/webhook');

export async function list(request, reply) {
  // Get the room list from spark
  try {
    const rooms = await chatPlugin.rooms(request.auth.credentials.spark.authorization);
    reply(JSON.stringify(rooms))
      .type('application/json');
  } catch (error) {
    console.error(error.stack);
  }
};

export async function remove(request, reply) {
  // Remove the room from spark
  try {
    const dbRoom = await chatPlugin.roomRemove(request.auth.credentials.spark.authorization, request.params.id);
    await Room.delete(dbRoom);
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
    const room = await Room.get(request.payload);
    if (room.length == 0) {
      const newRoom = await chatPlugin.roomCreate(request.auth.credentials.spark.authorization, request.payload.title);
      const dbRoom = await Room.create(newRoom);
      console.log(dbRoom);
      // Create webhook for this room
      const newWebhook = await chatPlugin.webhookCreate(
        request.auth.credentials.spark.authorization,
        newRoom.id,
        newRoom.title,
        newRoom.id
        );
      var dbWebhook = await Webhook.create(newWebhook);
      await Webhook.addToRoom(dbWebhook.id, dbRoom.id);
      reply(newRoom);
    } else {
      reply(room);
    }
  } catch (err) {
    console.log(err);
    reply(err);
  }
};

export async function get(request, reply) {
  // Get the room list from spark
  const rooms = await chatPlugin.rooms(request.auth.credentials.spark.authorization);
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
    var game = await Game.find({gameId: request.params.gameId});
    assert(game.gameId != undefined);
    consts.roomsForTwo.forEach( async function(r) {
      var rooms = helpers.calcRoomNames(r, request.params.gameId);
      let promises = rooms.map(async function(room) {
        var newRoom = await chatPlugin.roomCreate(request.auth.credentials.spark.authorization, room.title);
        var dbRoom = await Room.create(newRoom);
        await Room.addToGame(dbRoom.id, request.params.gameId);
        return dbRoom;
      });
      let roomsOut = [];
      for (let promise of promises) {
        roomsOut.push(await promise);
      }
      const webhooks = await helpers.calcRoomWebhooks(roomsOut);

      let morePromises = webhooks.map(async function(hook) {
        try {
          var h = await chatPlugin.webhookCreate(
                    request.auth.credentials.spark.authorization,
                    hook.sourceRoom,
                    hook.title,
                    hook.targetRoom
                  );
          var dbWebhook = await Webhook.create(h);
          await Webhook.addToRoom(dbWebhook.id, hook.sourceRoom);
          await Webhook.addToRoom(dbWebhook.id, hook.targetRoom, 'TARGETS');
          return dbWebhook;
        } catch (err) {
          console.log(err);
          return(err);
        }
      });
    });
    var newRoom = await chatPlugin.roomCreate(request.auth.credentials.spark.authorization, "Full Board" + " " + request.params.gameId);
    var dbRoom = await Room.create(newRoom);
    var dbConn = await Room.addToGame(dbRoom.id, request.params.gameId);
    reply("Rooms created").redirect(`/rooms/${request.params.gameId}`);
  } catch (err) {
    console.log(err);
    reply(err);
  }
};

export async function removeGameRooms(request, reply) {
  try {
    // Get the room list from DB
    var game = await Game.find(request.params);
    console.log(`Finding rooms for game ${util.inspect(game)}`);
    const rooms = await game.rooms();
    console.log(`Found rooms for game ${util.inspect(game)}: ${JSON.stringify(rooms)}`);
    var response = {};
    for (const r of rooms) {
      assert(r.title.match('\ ' + request.params.gameId + '$'));
      // Try to delete from Spark
      chatPlugin.roomRemove(request.auth.credentials.spark.authorization, r.id);
      // Find Webhooks in DB
      var dbWebhooks = await Room.webhooks(r);
      dbWebhooks.map(async function(wh) { await Webhook.remove(wh) })
      // Remove from DB
      await Room.remove(r);
    }
    reply(JSON.stringify(response))
    .type('application/json');
  } catch(reason) {
    console.log(reason);
  }
};

export async function getRoomWebhooks(request, reply) {
  try {
    var webhooks = await Room.webhooks(request.params);
    reply(webhooks);
  } catch (err) {
    console.log(err);
    reply(err);
  }
}