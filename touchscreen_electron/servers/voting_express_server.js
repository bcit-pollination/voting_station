console.log('in express voting server')


var http = require('http');

http.createServer(function (request, response) {

    response.writeHead(200, {'Content-Type': 'text/plain'});

    // send "Hello World"
    response.end('voting server\n');
}).listen(3000);

console.log('Server running at http://127.0.0.1:3000/');