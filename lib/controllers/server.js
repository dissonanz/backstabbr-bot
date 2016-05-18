const Hapi = require('hapi');

export function server(port = 3000) {
  const server = new Hapi.Server();
  server.connection({ port: port });
  return server;
};
