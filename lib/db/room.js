import assert from 'assert';
const util = require('util');
var helpers = require('../helpers/helpers');
var db = require('./db');

class Room {
  constructor(options) {
    const defaults = {
      id: undefined,
      title: undefined
    };
    const populated = Object.assign(defaults, options);
    for (const key in populated) {
      if (populated.hasOwnProperty(key)) {
        this[key] = populated[key];
      }
    }
  }
}

Room.prototype.options_list = function(n) {
  var arr = [];
  var keys = Object.keys(this);
  for (var prop in keys) {
    arr.push(`${n}.${keys[prop]} = "${this[keys[prop]]}"`);
  };
  return arr.join(', ');
}

Room.create = async function create(options) {
  try {
    var room = new Room(options);
    const query = `
      MERGE (g:Room {id: "${room.id}"})
      ON MATCH SET ${room.options_list('g')}
      ON CREATE SET ${room.options_list('g')}
      RETURN g`;
    const result = await db.db.query(query).getResults('g');
    for (const prop in Object.getOwnPropertyNames(room)) {
      assert(room[prop] == result[0][prop]);
    };
    return result;
  } catch (err) {
    console.log(err);
    return(err);
  }
};

Room.remove = async function remove(room) {
  try {
    var room = new Room(room);
    const query = `MATCH (r:Room {id: "${room.id}"}) DETACH DELETE r`;
    const result = await db.db.query(query).getResults('r');
    return;
  } catch (err) {
    console.log(err);
    return(err);
  }
};

Room.get = async function get(room) {
  try {
    var room = new Room(room);
    const query = `MATCH (n:${util.inspect(room)}) RETURN n`;
    const result = await db.db.query(query).getResults('n');
    return result;
  } catch (err) {
    console.log(err);
    return(err);
  }
};

Room.addToGame = async function addToGame(roomId, gameId) {
  try {
    var query = `
       MATCH (game:Game { gameId: "${gameId}" })
       MATCH (room:Room { id: "${roomId}" })
       MERGE (room)-[:PART_OF]->(game)
       RETURN room`
    var out = await db.db.query(query).getResults('room');
    console.log(out);
    return out;
  } catch (err) {
    console.log(err);
    return(err);
  }
}

module.exports = Room;