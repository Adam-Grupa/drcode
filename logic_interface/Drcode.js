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
  nlc.ask(question);

  //output(question, req, res);
}

output = function(result, req, res)
{
  res.writeHead(200, {
      'content-type': 'text/plain'
  });
  res.write('received the data: ');
  res.write(result + '\n');
  res.write('For now, look at the terminal window.');
  res.end();
}

module.exports = Drcode;
