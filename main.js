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
        reply(JSON.stringify(rooms));
    }
});

server.route({
    method: 'POST',
    path: '/rooms/{gameId}',
    handler: async function (request, reply) {
        // Get the room list from spark
        var r;
        while(r = roomsForTwo.next()) {
          try {
            const room = await ciscospark.rooms.create({title: r + " " + request.params.gameId});
            assert(room.id);
            assert(room.title);
            assert(room.created);
          }
          catch(reason) {
            console.log("Failure: " + reason)
          }
        }
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
          assert(room.title.match('[A-Z]{3},[A-Z]{3}\ ' + request.params.gameId))
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
