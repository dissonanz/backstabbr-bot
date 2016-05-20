const Game = require(`../db/game`);

export function find(gameId) {
  return Game.find(gameId);
};

export function add(gameInfo) {
  return Game.add(gameInfo);
};