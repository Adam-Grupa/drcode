var fs = require('fs');
var lines = fs.readFileSync(__dirname + '/phrases_d2n.csv').toString().split('\n');
var result="";//""

printArr = function(x)
{
  for (var i = 0; i< x.length; i++)
  {
    console.log(x[i]);
  }
}

getCoreVocab = function(input)
{
  var checkTokens = " to want wanted like liked catch caught";
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

getCoreVocab("I want to kill myself");
console.log(result);
