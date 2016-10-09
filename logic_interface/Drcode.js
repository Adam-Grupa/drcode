var NLCService = require('../nlc/NLCService.js');


var method = Drcode.prototype;
var nlc;
function Drcode()
{
  nlc = new NLCService();
}

method.process = function(question, req, res)
{
  //console.log(questio n);  
  res.writeHead(200, {
      'content-type': 'text/plain'
  });
  res.write('received the data: ');
  res.write(question + '\n');
  
  // Define function here
  // Javascript closures allow us to remove unneeded function arguments
  var output = function(response) {
    // The response is already an object in JSON form
    var rList = response.classes;
    res.write('\n');

    // for now, print top three
    for (var i = 0; i<3; i++) {
        res.write(rList[i].class_name + '\n');
        res.write(rList[i].confidence + '\n\n');
    }

  res.end();
  
  };
  
  nlc.ask(question, output);
}

module.exports = Drcode;
