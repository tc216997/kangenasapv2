const express = require('express'),
      bodyParser = require('body-parser'),
      path = require('path'),
      RateLimit = require('express-rate-limit'),
      expressSanitizer = require('express-sanitizer'),
      tools = require('./tools.js'),
      app = express(),
      router = express.Router(),
      emailLimiter = new RateLimit({
        windowMs: 10*60*1000,
        max: 5,
        delay: 0,
        handler: function(req, res) {
          res.format({
            json: function() {
              res.status(429).json({status:'Email limit exceeded.<br> Please try again later.'});
            }
          });
        }
      });

router.use(bodyParser.urlencoded({extended:true}));
router.use(expressSanitizer());
router.use('/send-email', emailLimiter);

router.get('/videos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/videos.html'));
});

router.get('/studies', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/studies.html'));
});

router.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/shop.html'));
});

router.get('/pdf', (req, res) => {
  let fileName = path.join(__dirname, '/pdf', req.query.filename + '.pdf');
  res.download(fileName);
});

router.post('/send-email', (req, res) => {
  let emailAddress = req.sanitize(req.body.email);
  let senderName = req.sanitize(req.body.name);
  let emailSubject = req.sanitize(req.body.subject);
  let emailMsg = req.sanitize(req.body.message);
  tools.sendEmail(emailAddress, senderName, emailSubject, emailMsg, res);
});

// redirect all non matching routes back to homepage
router.all('*', (req, res) => {
  res.redirect('/');
})

module.exports = router;