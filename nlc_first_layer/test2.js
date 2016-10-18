printArr = function(x)
{
  for (var i = 0; i< x.length; i++)
  {
    console.log(x[i]);
  }
}

var vocab=["", "", "", "", "", "", "", "", "", "", "", ""];
var vi = 0;
var vocabNumber = 0;

var fs = require('fs');
var lines = fs.readFileSync(__dirname + '/vocab_d2n.csv').toString().split('\n');

//printArr(lines);

vi=0;
for (var i = 0; i< lines.length; i++) //lines.length
{
  if (lines[i].indexOf("suicide") > -1)
  {
    vocab[vi] = lines[i];
    vi++;
  }
}

printArr(vocab);
