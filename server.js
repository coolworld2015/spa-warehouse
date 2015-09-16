//cd Downloads\AJOB\AngularJS\Total
//node server.js
//npm install node-static
//node server.js

var static = require('node-static');

var file = new static.Server('.');
 
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        // 
        // Serve files! 
        // 
        file.serve(request, response);
    }).resume();
}).listen(8000);