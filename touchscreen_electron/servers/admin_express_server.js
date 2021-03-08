console.log('in express admin server')


var http = require('http');

http.createServer(function (request, response) {

    response.writeHead(200, {'Content-Type': 'text/plain'});

    // send "Hello World"
    response.end('admin server\n');
}).listen(4000);

console.log('Server running at http://127.0.0.1:4000/');