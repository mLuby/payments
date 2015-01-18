var http = require('http');
var url = require('url');

var PORT = '1337';
var IP = '127.0.0.1'
var serverURL = 'http://'+IP+':'+PORT+'/';

http.createServer(function (request, response) {
  if (request.method === 'POST') {
    var data = '';
    request.on('data', function(chunk) {
      data += chunk;
    });

    request.on('end', function() {
      var url_parts = url.parse(serverURL+'?'+data, true);
      var query = url_parts.query
      console.log('query', query);
      response.writeHead(200, "OK", {'Content-Type': 'text/html'});
      response.end();
    });
  } else {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
  }
}).listen(PORT, IP);
console.log('Server running at', serverURL);

/*
curl http://127.0.0.1:1337/ \
  --user mLuby: \
  --data amount=100 \
  --data 'transfer[description]="bob wuz hear"'
*/