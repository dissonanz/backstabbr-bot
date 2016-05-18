const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Jwt2 = require('hapi-auth-jwt2');
const Inert = require('inert');
const Vision = require('vision');
const Pack = require('../../package');

const options = {
    info: {
            'title': 'Test API Documentation',
            'version': Pack.version,
        }
    };

export function server(port = 3000) {
  const server = new Hapi.Server();
  server.connection({ port: port });
  server.register(
    [Inert, Vision, HapiSwagger,
    {
        'register': HapiSwagger,
        'options': options
    }]
  )
  return server;
};
