import assert from 'assert';
const util = require('util');
var helpers = require('../helpers/helpers');
var db = require('./db');

class Game {
  constructor(options) {
    const defaults = {
      id: 'undefined',
      status: 'Created'
    };
    const populated = Object.assign(defaults, options);
    for (const key in populated) {
      if (populated.hasOwnProperty(key)) {
        this[key] = populated[key];
      }
    }
  }
}

Game.add =  async function add(options) {
  var game = new Game(options);
  var session = db.driver.session();
  let run = await session.run(
    `MERGE (g:${util.inspect(game)}) RETURN g`
  );
  session.close();
  var gameArr = await helpers.dbToObjects(run);
  gameArr.map(function(game) {
    return new Game(game);
  });
  for (const prop in Object.getOwnPropertyNames(game)) {
    assert(game[prop] == gameArr[0][prop]);
  };
  return game;
}

Game.find = async function get(gameId) {
  switch (gameId) {
    case undefined:
      var query = `MATCH (g:Game) RETURN g`
      break;
    default:
      var query = `MATCH (g:Game { id: "${gameId}" }) RETURN g`
  };
  try {
    var session = db.driver.session();
    const run = await session.run(query);
    session.close();
    var gameArr = await helpers.dbToObjects(run);
    gameArr.map(function(game) {
      return new Game(game);
    });
    return gameArr;
  } catch (err) {
    console.log(err);
    return(err);
  }
}

module.exports = Game;