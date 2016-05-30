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
  switch (options.gameId) {
    case undefined:
      var query = `MATCH (g:Game) RETURN g`
      break;
    default:
      var query = `MATCH (g:Game { gameId: "${options.gameId}" }) RETURN g`
  };
  try {
    return await db.db.query(query).getResults('g');
  } catch (err) {
    console.log(err);
    return(err);
  }
}

module.exports = Game;