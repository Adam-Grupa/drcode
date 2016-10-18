var r = require('./RNRService.js');

var watson = require('watson-developer-cloud');

var rr = new r.RNRService(watson, 'RNR Service username here', 'RNR Service password here');

rr.listClusters(function(err, response){
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(response, null, 2));
});