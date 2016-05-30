import assert from 'assert';

// database
var db = require("neo4j-simple")(process.env.NEO4J_URL);

// // neo4j official driver can only be used with bolt protocol
// // which is not yet supported by graph story or graphenedb

// var neo4j = require('neo4j-driver').v1;
// var url = require('url').parse(process.env.NEO4J_URL)

// switch (process.env.NEO4J_URL) {
//   case undefined:
//     assert(process.env.NEO4J_HOST);
//     assert(process.env.NEO4J_USER);
//     assert(process.env.NEO4J_PASSWORD);
//     var driver = neo4j.driver(`bolt://${process.env.NEO4J_HOST}`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD), {connectionPoolSize: 50});
//     break;
//   default:
//     var host = url.protocol + '//' + url.host;
//     var user = url.auth.split(':')[0];
//     var pass = url.auth.split(':')[1];
//     var driver = neo4j.driver(host, neo4j.auth.basic(user, pass), {
//         connectionPoolSize: 50,
//         encrypted: false
//     });
// };

// Set Constraints
// const constraints = [
//   `CREATE CONSTRAINT ON (player:Player) ASSERT player.backstabbrEmail IS UNIQUE;`,
//   `CREATE CONSTRAINT ON (game:Game) ASSERT game.gameId IS UNIQUE;`
// ]

// for (var query in constraints) {
//   async function (query) {
    // await db.query(query);
//   }
// }

export { db };