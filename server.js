require('dotenv').config();
const express = require('express'),
      path = require('path'),
      expressSanitizer = require('express-sanitizer'),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      RateLimit = require('express-rate-limit'),
      configs = require('./configs.js'),
      tools = require('./tools.js'),
      monitor = require('./monitor.js'),
      server = express(),
      emailLimiter = new RateLimit({
        windowMs: 10*60*1000,
        max: 10,
        delay: 0,
        handler: function(req, res) {
          res.format({
            json: function() {
              res.status(429).json({status:'Email limit exceeded.<br> Please try again later.'});
            }
          });
        }
      });

// check website status after a minute
monitor.checkStatus();

server.enable('trust proxy');
server.set('port', process.env.PORT || 3000 );
server.use(compression());
server.use(bodyParser.urlencoded({extended:true}));
server.use(expressSanitizer());
server.use(express.static(path.resolve(__dirname, 'public')));
server.use('/send-email', emailLimiter);

server.get('/', (req, res) => {
  res.sendFile(getFile('index'));
});

server.get('/videos/', (req, res) => {
  res.sendFile(getFile('videos'));
});

server.get('/studies/', (req, res) => {
  res.sendFile(getFile('studies'));
});

server.get('/shop/', (req, res) => {
  res.sendFile(getFile('shop'));
});

server.get('/pdf', (req, res) => {
  let filePath = path.resolve(__dirname, 'pdf');
  let fileName = path.resolve(filePath, req.query.filename + '.pdf');
  res.download(fileName);
})

server.post('/send-email', (req, res) => {
  let emailAddress = req.sanitize(req.body.email);
  let senderName = req.sanitize(req.body.name);
  let emailSubject = req.sanitize(req.body.subject);
  let emailMsg = req.sanitize(req.body.message);
  tools.sendEmail(emailAddress, senderName, emailSubject, emailMsg, res);
});

// 500 status error handling
server.use((error, req, res, next) => {
  res.status(500).sendFile("500.html", {"root": path.resolve(__dirname, 'public')});;
});

// redirect all non matching routes back to homepage
server.all('*', (req, res) => {
  res.redirect('/');
})

server.listen(server.get('port'), () => {
  console.log('server listening at port ' + server.get('port'));
});

