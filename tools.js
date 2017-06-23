require('dotenv').config();
const aes256 = require('aes256'),
      path = require('path'),
      nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAILUSER,
        pass: decryptHash(process.env.EMAILPW)
    }
});

function decryptHash(hash){
  let salt = new RegExp(process.env.SALT, 'g'),
      pepper = new RegExp(process.env.PEPPER, 'g'),
      decrypted = aes256.decrypt(process.env.KEY, hash),
      unsalted = decrypted.replace(salt, ''),
      unpeppered = unsalted.replace(pepper, '');
  return unpeppered;  
}

module.exports = {
  getFile: function(pathname) { //get and return file path
            let publicPath = path.resolve(__dirname, 'public');
            let filePath = path.resolve(publicPath, pathname +'.html');
            return filePath;
           }
  ,
  sendEmail: function (senderAddress, sender, emailSubject, emailMsg, res) {
              let mailOptions = {
                to: process.env.FORWARDEMAIL,
                subject: emailSubject,
                html: `
                      <strong>Customer name:</strong> ${sender}
                      <br><br><strong>Customer email:</strong> ${senderAddress}
                      <br><br><strong>Message:</strong><br> ${emailMsg}
                      `
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
  ,

}