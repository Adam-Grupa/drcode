var DRCODE = require('./logic_interface/Drcode.js')
var drcode = new DRCODE();
var http = require('http')
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');


var server = http.createServer(function(req, res) {

  if (req.method.toLowerCase() == 'get') {
      displayForm(res);
  } else if (req.method.toLowerCase() == 'post') {
      processFormFieldsIndividual(req, res);
  }
})

function displayForm(res) {
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}
server.listen(8000);
console.log('server running. try localhost:8000')


function processFormFieldsIndividual(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value) {
        //console.log(field);
        //console.log(value);

        drcode.process(value, req, res);
    });
    form.parse(req);
}
