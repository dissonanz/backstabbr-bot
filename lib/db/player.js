var helpers = require('../helpers/helpers');
var db = require('./db');
var session = db.driver.session();


export async function add(name, backstabbrEmail) {
  let out = await session.run(
    `MERGE (r:Player { name: "${name}", backstabbrEmail: "${backstabbrEmail}" }) RETURN r`
  )
  return out.records;
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
