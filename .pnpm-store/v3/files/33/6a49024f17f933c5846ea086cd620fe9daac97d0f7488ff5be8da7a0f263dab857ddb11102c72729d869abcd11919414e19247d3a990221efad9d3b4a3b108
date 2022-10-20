var http = require('http');
var fs = require('fs');
var browserify = require('browserify');
var bundle = browserify({ entry : __dirname + '/main.js', }).bundle();

var server = http.createServer(function (req, res) {
    if (req.url === '/browserify.js') {
        res.setHeader('content-type', 'text/javascript');
        res.end(bundle);
    }
    else {
        res.setHeader('content-type', 'text/html');
        fs.createReadStream(__dirname + '/index.html').pipe(res);
    }
});

server.listen(5000);
console.log('Listening on :5000');
