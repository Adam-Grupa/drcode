var fs = require("fs")
var lines = fs.readFileSync(__dirname + '/vocab_d2n.csv').toString().split('\n');

  //console.log(lines.length);
var data;
var numberList = [];
var index=0;
for (i =0; i<lines.length; i++)
{
  if (lines[i].indexOf('headache') != -1)
  {
     //console.log(lines[i]);
     data= lines[i].split(',')
     //console.log(data[0] + " and " + data[1]);
     numberList[index] = data[1];
     index++;
  }
}


var allSyn = [];
index = 0;

for(j=0; j<numberList.length; j++)
{
  for (i=0; i<lines.length; i++)
  {
    if (lines[i].indexOf(numberList[j]) != -1)
    {
       //console.log(lines[i]);
       data= lines[i].split(',')
       //console.log(data[0] + " and " + data[1]);
       allSyn[index] = data[0];
       index++;
    }
  }
}

for (i=0; i< allSyn.length; i++)
{
  console.log(allSyn[i]);
}
