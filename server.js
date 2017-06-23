const express = require('express'),
      path = require('path'),
      compression = require('compression'),
      routes = require('./routes.js'),
      server = express();

server.enable('trust proxy');
server.set('port', process.env.PORT || 3000 );
server.use(compression());
server.use(express.static(path.resolve(__dirname, 'public')));
server.use('/', routes);
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

server.listen(server.get('port'), () => {
  console.log('server listening at port ' + server.get('port'));
});

