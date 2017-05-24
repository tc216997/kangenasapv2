require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const request = require('request');
const compression = require('compression');
const server = express();
server.set('port', process.env.PORT || 3000 );
server.use(compression());
server.use(bodyParser.urlencoded({extended:true}));
server.use(express.static(path.resolve(__dirname, 'public')));

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAILUSER,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: process.env.ACCESSTOKEN,
        expires: 3600
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

server.get('/contact/', (req, res) => {
  res.sendFile(getFile('contact'));
});

server.get('/email-sent', (req, res) => {
  res.status(200).sendFile(getFile('email-sent'));
});

server.get('/pdf', (req, res) => {
  let filePath = path.resolve(__dirname, 'pdf')
  let fileName = path.resolve(filePath, req.query.filename + '.pdf')
  res.download(fileName);
})

server.post('/send-email', (req, res) => {
  let emailAddress = req.body.email;
  let senderName = req.body.name;
  let emailSubject = req.body.subject;
  let emailMsg = req.body.message;
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
    from: sender + ' ' + senderAddress,
    to: process.env.EMAILUSER,
    subject: sender + ' ' + emailSubject,
    html: '<strong>Customer name:</strong>  ' + sender + '<br><br><strong>Customer email:  </strong>' + senderAddress  + '<br><br><strong>Message:  </strong><br>' + emailMsg,
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(500).json({ status:'failed', error:err});
      console.log(err);
    } else {
      console.log('email %s sent: %s', info.messageId, info.response);
      res.status(200).json({ status:'success', error:null});
    }
  });
}
