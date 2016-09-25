var NLCService = require('../nlc/NLCService.js');


var method = Drcode.prototype;
var nlc;
function Drcode()
{
  nlc = new NLCService();
}

method.process = function(question, req, res)
{
  console.log(question);
  res.writeHead(200, {
      'content-type': 'text/plain'
  });
  res.write('received the data: ');
  res.write(question + '\n');
  nlc.ask(question, req, res, output);
}

output = function(response, req, res)
{
  var result = JSON.stringify(response, null,2);
  var rList = JSON.parse(result).classes;
  res.write('\n');

  // for now, print top three
  for (var i = 0; i<3; i++)
  {
    res.write(rList[i].class_name + '\n');
    res.write(rList[i].confidence + '\n\n');

  }

  res.end();
}

module.exports = Drcode;
