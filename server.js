require('dotenv').config();
const express = require('express'),
      path = require('path'),
      nodemailer = require('nodemailer'),
      expressSanitizer = require('express-sanitizer'),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      RateLimit = require('express-rate-limit'),
      aes256 = require('aes256'),
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

server.enable('trust proxy');
server.set('port', process.env.PORT || 3000 );
server.use(compression());
server.use(bodyParser.urlencoded({extended:true}));
server.use(expressSanitizer());
server.use(express.static(path.resolve(__dirname, 'public')));
server.use('/send-email', emailLimiter);

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAILUSER,
        pass: decryptHash(process.env.EMAILPW)
    }
});

server.get(/^\/(index)?$/, (req, res) => {
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
  sendEmail(emailAddress, senderName, emailSubject, emailMsg, res);
});

// 404 and 500 status error handling
server.use((req, res) => {
  res.status(400).sendFile("404.html", {"root": path.resolve(__dirname, 'public')});
});

server.use((error, req, res, next) => {
  res.status(500).sendFile("500.html", {"root": path.resolve(__dirname, 'public')});;
});

server.listen(server.get('port'), () => {
  console.log('server listening at port ' + server.get('port'));
});

//get and return file path
function getFile(pathname) {
  let publicPath = path.resolve(__dirname, 'public');
  let filePath = path.resolve(publicPath, pathname +'.html');
  return filePath;
}

// send email using nodemailer
function sendEmail(senderAddress, sender, emailSubject, emailMsg, res) {
  let mailOptions = {
    to: process.env.FORWARDADDRESS,
    subject: emailSubject,
    html: '<strong>Customer name:</strong>  ' + sender + '<br><br><strong>Customer email:  </strong>' + senderAddress  + '<br><br><strong>Message:  </strong><br>' + emailMsg,
  }
  
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(500).json({ status:'Error! <br> Please try again', error:err});
      console.log(err);
    } else {
      console.log('email %s sent: %s', info.messageId, info.response);
      res.status(200).json({ status:'Email sent!', error:null});
    }
  });
}

function decryptHash(hash){
  let salt = new RegExp(process.env.SALT, 'g'),
      pepper = new RegExp(process.env.PEPPER, 'g'),
      decrypted = aes256.decrypt(process.env.KEY, hash),
      unsalted = decrypted.replace(salt, ''),
      unpeppered = unsalted.replace(pepper, '');
  return unpeppered;  
}