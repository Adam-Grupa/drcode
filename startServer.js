var http = require('http'),
    fs = require('fs');


fs.readFile(__dirname + '/index.html', function (err, html) {
    if (err) {
        throw err;
    }

    var express = require('express').
        app = express();

    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(8000);
});

console.log('server running. try localhost:8000')
