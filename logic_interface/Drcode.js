var NLCService = require('../nlc/NLCService.js');
//var NLCService_OLD = require('../nlc/NLCService_old.js');
var result="";

var method = Drcode.prototype;
var nlc, nlc_old;
function Drcode()
{
  nlc = new NLCService();
  //nlc_old = new NLCService_OLD();
}

method.process = function(question, req, res)
{
  //console.log(questio n);
  res.writeHead(200, {
      'content-type': 'text/plain'
  });
  res.write('received the data: ');
  res.write(question + '\n');

  result = "";
  getCoreVocab(question);
  res.write('processed data: ');
  res.write(result + '\n');
  // Define function here
  // Javascript closures allow us to remove unneeded function arguments
  var output = function(response) {
    // The response is already an object in JSON form
    var rList = response.classes;
    res.write('\n');

    // for now, print top three
    for (var i = 0; i<4; i++) {
        res.write(rList[i].class_name + '\n');
        res.write(rList[i].confidence + '\n\n');
    }

  res.end();

  };
  nlc.ask2Prev(question, output);
  nlc.ask(question, output);
}

getCoreVocab = function(input)
{
  var checkTokens = " to want wanted like liked catch caught feel felt";
  checkTokens += " there's there a an i me my mine you your yours he his him she her hers they them their thiers";
  checkTokens += " be am is are was were not and also";
  checkTokens += " may might will  would can could must have had didn't did don't dont can't cant won't wont";
  input = input.toLowerCase();
  var tokenized = input.split(/[ ,]+/);

  for (var i=0; i< tokenized.length; i++)
  {
    if (checkTokens.indexOf(tokenized[i]) == -1) result += tokenized[i] + " ";
    if (tokenized[i]=="can't" || tokenized[i]=="don't") result += "not"+ " ";
  }
}

module.exports = Drcode;
