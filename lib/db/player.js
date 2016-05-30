import assert from 'assert';
const util = require('util');
var helpers = require('../helpers/helpers');
var db = require('./db');
var chatPlugin = require('../plugins/ciscospark');

async function checkChatUser(credentials, email) {
  try {
    return await chatPlugin.getUser(credentials, email)
  } catch (err) {
    console.log(err);
    return null
  }
}

class Player {
  constructor(options) {
    const defaults = {
      backstabbrEmail: undefined,
    };
    const populated = Object.assign(defaults, options);
    for (const key in populated) {
      if (populated.hasOwnProperty(key)) {
        this[key] = populated[key];
      }
    }
  }
}

Player.create = async function create(credentials, options) {
  try {
    const chatUser = await checkChatUser(credentials, options.backstabbrEmail);
    const p = helpers.merge_options(options, chatUser);
    const player = new Player(p);
    const query = `MERGE (p:${util.inspect(player)}) RETURN p LIMIT 1`;
    const result = await db.db.query(query).getResults('p');
    for (const prop in Object.getOwnPropertyNames(player)) {
      assert(player[prop] == result[0][prop]);
    };
    console.log(result[0]);
    return result[0];
  } catch (err) {
    console.log(err);
    return(err);
  }
}

export async function addToGame(name, gameId, role) {
  let out = await session.run(
    `MATCH (r:Player { name: "${name}" })
    MATCH (g:Game { id: "${gameId}" })
    CREATE (r)-[:PARTICIPATES { role: "${role}" }]->(g)
    RETURN r`
  )
  return out.records;
}

export async function get(roomId) {
  let out = await session.run(
    `MATCH (r:Room { id: "${roomId}" }) RETURN r`
  )
  return out.records;
}

export async function list() {
  let out = await session.run(
    `MATCH (r:Player) RETURN r`
  )
  return out.records;
}

module.exports = Player;