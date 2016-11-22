var DRCODE = require('./logic_interface/Drcode.js');
var drcode = new DRCODE();
var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

//speech to txt part
var express = require('express');
var BinaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var port = 8001;
var outFile = 'demo.wav';
var app = express();
var username = 'c994201c-c8e1-4ec1-bed4-2ed88609aa7f';
var pwd = 'Lo4Klv8tzWBj';
var watson = require('watson-developer-cloud');
var recognizeStream;
var speech_to_text = watson.speech_to_text({
  username: username,
  password: pwd,
  version: 'v1'
});

var params = {
  content_type: 'audio/wav',
  continuous: true,
  interim_results: false
};

http.createServer(app).listen(port);
app.use(express.static(__dirname));

var savedString = "NULL";

app.get('/', function(req, res){
  //convertToTxt();
    displayForm(res);
});

app.post('/',function(req, res){
      processFormFieldsIndividual(req, res);
});

app.get('/getstring', function(req, res){
      getString(res);
});

convertToTxt();

function getString(res) {
  res.send(savedString);
}

function displayForm(res) {
  //convertToTxt();
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processFormFieldsIndividual(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];//syptom
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value) {
        //console.log(field);
        //console.log(value);value is input syptom
        drcode.process(value, req, res);
    });
    form.parse(req);
}

function convertToTxt(){
  console.log('server open on port ' + port);

  binaryServer = BinaryServer({port: 9001});

  binaryServer.on('connection', function(client) {
    console.log('new connection');

    var fileWriter;
    client.on('stream', function(stream, meta) {

      fileWriter = new wav.FileWriter(outFile, {
        channels: 1,
        sampleRate: 48000,
        bitDepth: 16
      });
      console.log('new stream');
      stream.pipe(fileWriter);
      //  fs.createReadStream(stream).pipe(recognizeStream);

      stream.on('end', function() {
        fileWriter.end();
        console.log('wrote to file ' + outFile);
        // Pipe in the audio.
        recognizeStream = speech_to_text.createRecognizeStream(params);
        fs.createReadStream(outFile).pipe(recognizeStream);

        // Pipe out the transcription to a file.
        recognizeStream.pipe(fs.createWriteStream('transcription.txt'));

        // Get strings instead of buffers from 'data' events.
        recognizeStream.setEncoding('utf8');

        // Listen for events.
        recognizeStream.on('data', function(event) { onEvent('Data:', event); });
        //  recognizeStream.on('results', function(event) { onEvent('Results:', event); });
        //  recognizeStream.on('error', function(event) { onEvent('Error:', event); });
        //  recognizeStream.on('close-connection', function(event) { onEvent('Close:', event); });

        // Displays events on the console.
        function onEvent(name, event) {
          console.log(name, JSON.stringify(event, null, 2));
          savedString = JSON.stringify(event, null, 2);
        }
      });
    });
  });
}
