const request = require('request'),
      queryString = require('querystring'),
      url = 'http://localhost:3000'
      getRoutes = ['/', '/videos', '/studies', '/shop'];

testGetRoutes(url, getRoutes)
testEmail(url);

function testGetRoutes(address, routes) {
  console.log('');
  console.log('testing the get routes');
  routes.map(endpoint => {
    request
      .get(address + endpoint)
      .on('response', response => {
        if (response.statusCode >= 400 && response.statusCode <= 600) {
        console.log('Error on ', route)
        return;
        }
        console.log(response.statusCode + ' on ' + address + endpoint);
      });
  });
}

function testEmail(address) {
  console.log('');
  console.log('testing the post requests');
  let formBody = {
      name: 'terry chong',
      email: 'tc216997@gmail.com',
      subject: 'testing email',
      message: 'Hello this is an automated testing of the email',
  };
  request.post({
    headers: {
      'Content-Length': formBody.length,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: address + '/send-email',
    body: queryString.stringify(formBody)
  }, (err, res, body) => {
    console.log(res.statusCode + ' on ' + address + '/send-email');
  });
}
