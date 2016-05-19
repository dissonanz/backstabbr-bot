var helpers = require('../helpers/helpers');

export async function add(gameId, session) {
  let out = await session.run(
    `MERGE (g:Game { id: "${gameId}", status: "Created" }) RETURN g`
  )
  return helpers.dbToObjects(out);
}

export async function get(gameId, session) {
  switch (gameId) {
    case undefined:
      var query = `MATCH (g:Game) RETURN g`
      break;
    default:
      var query = `MATCH (g:Game { id: "${gameId}" }) RETURN g`
  };
  const out = await session.run(query);
  return helpers.dbToObjects(out);
}