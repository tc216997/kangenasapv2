require('dotenv').config();
const exec = require('child_process').exec,
      fs = require('fs'),
      path = require('path'),
      cmd = 'heroku config:set ';

fs.readFile(path.join(__dirname, '../..', '.env'), 'utf8', (err, data) => {
  let array = data.split('\r\n');
  let i = 0;
  array.map( item => {
    exec(cmd + item, (err, stdout, stderr) => {
      if(err) console.log(err);
      console.log(stdout);
    });
  });
});

