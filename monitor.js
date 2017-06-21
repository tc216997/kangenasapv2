const request = require('request'),
      nodemailer = require('nodemailer'),
      aes256 = require('aes256'),
      configs = require('./configs.js')
      tools = require('./tools.js')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: configs.email_address,
        pass: decryptHash(configs.emailPW)
    }
});

function decryptHash(hash){
  let salt = new RegExp(configs.salt, 'g'),
      pepper = new RegExp(configs.pepper, 'g'),
      decrypted = aes256.decrypt(configs.key, hash),
      unsalted = decrypted.replace(salt, ''),
      unpeppered = unsalted.replace(pepper, '');
  return unpeppered; 
}

function sendEmail() {
  let mailOptions = {
    to: configs.forward_email,
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
          console.log('Error send email');
          sendEmail();
        }
      });
    }, 120000);
  }, 
}