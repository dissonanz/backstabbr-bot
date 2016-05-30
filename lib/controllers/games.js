const Game = require(`../db/game`);

export function find(gameId) {
  return Game.find(gameId);
};

export async function create(request, reply) {
  try {
    let output = await Game.create(request.payload);
    reply(output);
  } catch (err) {
    console.error(`ERROR: ${err}`);
    reply(err);
  }
}

export async function del(request, reply) {
  try {
    console.log(request.params)
    let output = await Game.del(request.params);
    reply(output);
  } catch (err) {
    console.log(err);
    reply(err);
  }
}

export async function get(request, reply) {
  try {
    let output = await Game.find(request.params);
    reply(output);
  } catch (err) {
    reply(err);
  }
}