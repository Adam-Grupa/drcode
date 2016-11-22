var r = require('./RNRService.js');

var watson = require('watson-developer-cloud');

var rr = new r.RNRService(watson, '4f279b5f-3155-4be5-a09d-9850b9443855', 'RaBN8XXz3bWX');

rr.listClusters(function(err, response){
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(response, null, 2));
});