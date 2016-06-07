import assert from 'assert';
const util = require('util');
var helpers = require('../helpers/helpers');
var db = require('./db');


class Game {
  constructor(options) {
    const defaults = {
      gameId: undefined,
      status: 'Created'
    };
    const populated = Object.assign(defaults, options);
    for (const key in populated) {
      if (populated.hasOwnProperty(key)) {
        this[key] = populated[key];
      }
    };
  }
}

Game.prototype.id = function() {
  return this.gameId;
}

Game.prototype.options_list = function(n) {
  var arr = [];
  var keys = Object.keys(this);
  for (var prop in keys) {
    arr.push(`${n}.${keys[prop]} = "${this[keys[prop]]}"`);
  };
  return arr.join(', ');
}

Game.create = async function create(options) {
  try {
    var game = new Game(options);
    const query = `
      MERGE (g:Game {gameId: "${game.gameId}"})
      ON MATCH SET ${game.options_list('g')}
      ON CREATE SET ${game.options_list('g')}
      RETURN g`;
      console.log(query)
    const result = await db.db.query(query).getResults('g');
    for (const prop in Object.getOwnPropertyNames(game)) {
      assert(game[prop] == result[0][prop]);
    };
    return result;
  } catch (err) {
    console.log(err);
    return(err);
  }
};

Game.del = async function del(options) {
  try {
    var game = new Game(options);
    const query = `MATCH (g:Game {gameId: "${game.gameId}"}) DELETE g`;
    const result = await db.db.query(query);
    return;
  } catch (err) {
    console.log(err);
    return(err);
  }
};

Game.find = async function get(options) {
  try {
    switch (options.gameId) {
      case undefined:
        console.log(`Finding all games in db`);
        var query = `MATCH (g:Game) RETURN g`;
        return await db.db.query(query).getResults('g');
        break;
      default:
        console.log(`Finding games that match ${JSON.stringify(options)}`);
        var query = `MATCH (g:Game { gameId: "${options.gameId}" }) RETURN g LIMIT 1`
        var res = await db.db.query(query).getResults('g');
        return new Game(res[0]);
    };
  } catch (err) {
    console.log(err);
    return(err);
  }
}

Game.prototype.rooms = async function gameRooms() {
  try {
    console.log(`Trying to find rooms for game ${util.inspect(this)}`)
    var query = `MATCH (g:Game { gameId: "${this.gameId}" })<-[:PART_OF]-(r:Room) RETURN r`;
    var out = await db.db.query(query).getResults('r');
    return(out);
  } catch (err) {
    console.log(err);
    return(err);
  }
}

module.exports = Game;