//database
var neo4j = require('neo4j-driver').v1;

switch (process.env.NEO4J_URL) {
  case undefined:
    assert(process.env.NEO4J_HOST);
    assert(process.env.NEO4J_USER);
    assert(process.env.NEO4J_PASSWORD);
    var driver = neo4j.driver(`bolt://${process.env.NEO4J_HOST}`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD), {connectionPoolSize: 50});
    break;
  default:
    var host = process.env.NEO4J_URL.match('^(\\w+://).*@(.*)').splice(1,2).join('');
    var user = process.env.NEO4J_URL.match('//(\\w+):')[1];
    var pass = process.env.NEO4J_URL.match(':(\\w+)@')[1];
    var driver = neo4j.driver(host, neo4j.auth.basic(user, pass), {connectionPoolSize: 50});
};

export { driver };