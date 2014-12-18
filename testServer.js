var http = require('http');
http.createServer(function (req, res) {
  if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });

    req.on('end', function() {
      console.log('data', data);
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.end();
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

/*
curl http://127.0.0.1:1337/ \
  --user mLuby: \
  --data amount=100 \
  --data 'transfer[description]="bob wuz hear"'
*/