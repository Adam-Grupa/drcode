var NLCService = require('../nlc/NLCService.js');

var RNRService = require('../rnr/RNRService.js');
var watson = require('watson-developer-cloud');
var result="";

var method = Drcode.prototype;
var nlc;
var rnr;
var password;
var username;
var clusterId;
var collectionName;


var result="";
var method = Drcode.prototype;
var nlc;
function Drcode()
{
  password = 'VMEopT2nEBGT';
  username = '80124b70-f44f-4279-9656-7b6a11563891';
  clusterId = 'sc6a9d6c6f_27e6_4350_8e41_dd35d6650959';
  collectionName = 'icdrnr';
  nlc = new NLCService();
  rnr = new RNRService.RNRService(watson,username,password);

}

method.process = function(question, req, res)
{
  //console.log(questio n);
  res.writeHead(200, {
    'content-type': 'text/html'
  });
  res.write('<!DOCTYPE html>' + '\n');
  res.write('<html>'+'\n');
  res.write('<head>');
  res.write('<title>ICD Code Search</title>'+'\n');
  res.write('<link rel="stylesheet" type="text/css" href="style.css">');
  res.write('</head>');
  res.write('<body>'+'\n');
  res.write('<h1>Searching Result</h1>');
  res.write('<p>received the data: ');
  res.write(question + '\n');

  result = "";
  getCoreVocab(question);
  res.write('processed data: ');
  res.write(result +'</p>'+'\n');
  // Define function here
  // Javascript closures allow us to remove unneeded function arguments
  var output = function(response) {
    // The response is already an object in JSON form
    var rList = response.classes;
    res.write('\n');

    //check the confience of the top class
    if(rList[0].confience>0.5){
      // for now, print top three
      for (var i = 0; i<4; i++) {
        res.write(rList[i].class_name + '\n');
        res.write(rList[i].confidence + '\n\n');
      }
      res.write('</body>'+'\n');
      res.write('</html>'+'\n');
      res.end();
    }else{
      /*rnr.searchAndRank(function(clusterId, collectionName, rankerId, question, function(err, response)) {
      if (err){
      console.log('error:', err);
      //output the nlc result instead
      for (var i = 0; i<4; i++) {
      res.write(rList[i].class_name + '\n');
      res.write(rList[i].confidence + '\n\n');
    }
  }
  else
  console.log(JSON.stringify(response, null, 2));
});*/
rnr.searchSolrCluster(question,clusterId,collectionName,function(err,response){
  res.write('<p>'+'\n');
  res.write('NLC RESULT:\n\n');
  res.write('<ul>'+'\n');

  for (var i = 0; i<4; i++) {
    res.write('<li>'+'\n');
    res.write(rList[i].class_name + '\n');
    res.write(rList[i].confidence + '\n\n');
    res.write('</li>'+'\n');
  }
  res.write('</ul>'+'\n');
  if (err){
    console.log('RNR error:', err);
  }
  else{
    res.write('RNR RESULT:\n\n');
    res.write('<ul>'+'\n');
    for (var i = 0; i<4; i++) {
      res.write('<li>'+'\n');
      res.write(JSON.stringify(response.response.docs[i].title, null, 2)+'\n\n');
      res.write('</li>'+'\n');
    }
  }
  res.write('</ul>'+'\n');
  res.write('</p>'+'\n');
  res.write('</body>'+'\n');
  res.write('</html>'+'\n');
  res.end();
});
}

};

nlc.ask2Prev(question, output);
nlc.ask(result, output);
}

getCoreVocab = function(input)
{
  var checkTokens = " to want wanted like liked catch caught feel felt gonna going to im";
  checkTokens += " what there's there a an i me my mine you your yours he his him she her hers they them their thiers";
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
