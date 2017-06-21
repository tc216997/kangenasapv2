require('dotenv').config();
const request = require('request'),
      nodemailer = require('nodemailer'),
      aes256 = require('aes256'),
      tools = require('./tools.js')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.WEBMEMAIL,
        pass: decryptHash(process.env.WEBMPW)
    }
});

function decryptHash(hash){
  let salt = new RegExp(process.env.WEBMSALT, 'g'),
      pepper = new RegExp(process.env.WEBMPEPPER, 'g'),
      decrypted = aes256.decrypt(process.env.WEBMKEY, hash),
      unsalted = decrypted.replace(salt, ''),
      unpeppered = unsalted.replace(pepper, '');
  return unpeppered; 
}

function sendEmail() {
  let mailOptions = {
    to: process.env.WEBMFORWARD,
    subject: 'Website is down',
    html: 'Website is unresponsive'
  }
  
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('email %s sent: %s', info.messageId, info.response);
    }
  });
}

module.exports = {
  checkStatus: () => {
    setTimeout( () => {
      request('https://www.getkangenasap.com', (err, response, body) => {
        console.log(response.statusCode);
        if (response.statusCode >= 400 && response.statusCode <= 600) {
          console.log('Error');
          sendEmail();
        }
      });
    }, 120000);
  }, 
}