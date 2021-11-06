var StaticServer = require('static-server');
var server = new StaticServer({
  rootPath: '.',            // required, the root of the server file tree
  port: 2203              // required, the port to listen
});

server.start(function () {
    console.log('Server listening to', server.port);
});