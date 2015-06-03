
var headers = {};
headers["Access-Control-Allow-Origin"] = "*";
headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
headers["Access-Control-Allow-Credentials"] = false;
headers["Access-Control-Max-Age"] = '86400'; // 24 hours
headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
headers['Content-Type'] = "text/plain";


var results = [];

exports.requestHandler = function (request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;

  // Handle http method
  if (request.method === 'GET') {
    statusCode = 200;
    if (request.url === '/classes/messages') {

    } else if (request.url === '/classes/room1') {
      results = results.filter(function(msg) {
        return msg.roomname === 'room1';
      });
    } else {
      statusCode = 404;
    }
  } else if (request.method === 'POST') {
    statusCode = 201;
    var body = '';
    request.on('data', function (data) {
      body += data;
      // Too much POST data, kill the connection!
      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function () {
      var post = JSON.parse(body);
      results.push(post);
    });
  } else if (request.method === 'OPTIONS') {
      statusCode = 200;
  } else {
    statusCode = 404;
  }
  var serverResponse = JSON.stringify({results: results});

  response.writeHead(statusCode, headers);

  response.end(serverResponse);
};



