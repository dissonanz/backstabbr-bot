'use strict';

import assert from 'assert';
import combinatorics from 'js-combinatorics';
import ciscospark from 'ciscospark/es6';
const Hapi = require('hapi');

assert(process.env.CISCOSPARK_ACCESS_TOKEN);
// assert(process.env.CISCOSPARK_REFRESH_TOKEN);
assert(process.env.CISCOSPARK_CLIENT_ID);
assert(process.env.CISCOSPARK_CLIENT_SECRET);

const server = new Hapi.Server();
server.connection({ port: process.env.PORT });

const roomsForTwo = combinatorics.combination(['AUS','ENG','GER','RUS','TUR','ITA','FRA'],2);
const roomsForThree = combinatorics.combination(['AUS','ENG','GER','RUS','TUR','ITA','FRA'],3);
const serviceUrl = process.env.SERVICE_URL || `https://backstabbr-bot.herokuapp.com`;

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

server.route({
    method: 'GET',
    path: '/rooms',
    handler: async function (request, reply) {
        // Get the room list from spark
        const rooms = await ciscospark.rooms.list();
        reply(JSON.stringify(rooms))
          .type('application/json');
    }
});

async function createRoom(title){
  try {
    const room = await ciscospark.rooms.create({title: title});
    assert(room.id);
    assert(room.title);
    assert(room.created);
    console.log(`Trying to create webhook for ${room.title}`);
    await createWebhook(room.id, title);
  }
  catch(reason) {
    console.log("Failure: " + reason)
  }
};

async function createWebhook(roomId, powers) {
  console.log(`Creating webhook for ${powers} in room ${roomId}`);
  console.log(`service url is ${serviceUrl}`);
  try {
    const webhook = await ciscospark.webhooks.create({
      resource: `messages`,
      event: `created`,
      filter: `roomId=${roomId}`,
      targetUrl: `${serviceUrl}/webhook`,
      name: `${powers} messages`
    });
  }
  catch(reason) {
    console.log(`Failed to create webhook: ${reason}`);
  }
};

server.route({
  method: 'POST',
  path: '/rooms/{gameId}',
  handler: async function (request, reply) {
      roomsForTwo.forEach( function(r) {
        console.log(`creating room for ${r}`);
        createRoom(r + " " + request.params.gameId);
      });
      roomsForThree.forEach( function(r) {
        createRoom(r + " " + request.params.gameId);
      });
      reply("Rooms created");
  }
});

server.route({
    method: 'GET',
    path: '/rooms/{gameId}',
    handler: async function (request, reply) {
        // Get the room list from spark
        const rooms = await ciscospark.rooms.list();
        var response = {};
        for (const room of rooms) {
          try {
            assert(room.title.match('[A-Z]{3},[A-Z]{3}\ ' + request.params.gameId))
            response[room.id] = room.title;
          }
          catch(reason) {
            console.log(reason);
          }
        }
        reply(JSON.stringify(response))
          .type('application/json');
    }
});

server.route({
  method: 'DELETE',
  path: '/rooms/{gameId}',
  handler: async function (request, reply) {
    // Get the room list from spark
    const rooms = await ciscospark.rooms.list();
    var response = {};
    for (const room of rooms) {
      try {
        assert(room.title.match('[A-Z]{3}(,[A-Z]{3}){1,2}\ ' + request.params.gameId))
        await ciscospark.rooms.remove(room.id);
      }
      catch(reason) {
        console.log(reason);
      }
    }
    reply(JSON.stringify(response))
      .type('application/json');
  }
});

server.route({
  method: 'DELETE',
  path: '/room/{id}',
  handler: async function(request, reply) {
    console.log(request.params.id);
    await ciscospark.rooms.remove(request.params.id);

    try {
      room = await ciscospark.rooms.get(request.params.id);
      assert(false, `the previous line should have failed`);
      console.log(room);
    }
    catch(reason) {
      assert.equal(reason.statusCode, 404);
      console.log(reason);
      reply("Failed somehow");
    }
  }
});

server.route({
  method: 'POST',
  path: '/webhook',
  handler: function(request, reply) {
    console.log(request.payload);
    reply("OK");
  }
});

server.route({
  method: 'GET',
  path: '/webhooks',
  handler: async function(request, reply) {
    const webhooks = Array.from(await ciscospark.webhooks.list());
    reply(JSON.stringify(webhooks))
      .type('application/json');
  }
});
