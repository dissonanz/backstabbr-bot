export async function add(gameId, session) {
  let out = await session.run(
    `MERGE (g:Game { id: "${gameId}", status: "Created" }) RETURN g`
  )
  return out;
}

export async function get(gameId, session) {
  let out = await session.run(
    `MATCH (g:Game { id: "${gameId}", status: "Created" }) RETURN g`
  )
  return out;
}