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
        clientId: process.env.TOKENID,
        clientSecret: process.env.TOKENSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: process.env.ACCESSTOKEN,
        expires: 3600
    }
});

server.get(/^\/(index)?$/, (req, res) => {
  res.sendFile(getFile('index'));
});

server.get('/science/', (req, res) => {
  res.sendFile(getFile('science'));
});

server.get('/testimonials/', (req, res) => {
  res.sendFile(getFile('testimonials'));
});

server.get('/demo/', (req, res) => {
  res.sendFile(getFile('demo'));
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
  let googleRes = req.body['g-recaptcha-response'];
  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (error, response, data) => {
    if (error) {
      console.log('Error: ', error );
    } else if (response.statusCode !== 200) {
      console.log('Status: ', response.statusCode);
    } else {
      if(!data.success) {
        res.status(403).sendFile(getFile('invalid-captcha'));
      } else {
        sendEmail(emailAddress, senderName, emailSubject, emailMsg, res);
      }
    }
  });


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
    subject: emailSubject,
    html: '<strong><br>Customer name:</strong>  ' + sender + '<br><strong>Customer email address:  </strong>' + senderAddress  + '<br><strong>has sent you the following message:  </strong><br>' + emailMsg,
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(500).sendFile(getFile('bad-email'));
      return console.log(err);
    } else {
      //console.log('email %s sent: %s', info.messageId, info.response );
      res.status(200).redirect('/email-sent');
    }

  });
}
