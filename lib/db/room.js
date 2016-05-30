import assert from 'assert';
const util = require('util');
var helpers = require('../helpers/helpers');
var db = require('./db');

class Room {
  constructor(options) {
    const defaults = {
      id: '',
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

export async function add(room) {
  try {
    var room = new Room(room);
    const query = `MERGE (g:${util.inspect(room)}) RETURN g`;
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

export async function remove(room) {
  try {
    var room = new Room(room);
    const query = `MATCH (g:${util.inspect(room)}) DETACH DELETE g`;
    const result = await db.db.query(query).getResults('g');
    return;
  } catch (err) {
    console.log(err);
    return(err);
  }
};

export async function get(room) {
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

export async function addToGame(roomId, gameId) {
  try {
    var out = await db.db.query(
      `MATCH (game:Game { gameId: "${gameId}" })
       MATCH (room:Room { id: "${roomId}" })
       MERGE (room)-[:PART_OF]->(game) RETURN room`
    ).getResults('r')
    console.log(out);
    return out;
  } catch (err) {
    console.log(err);
    return(err);
  }
}

