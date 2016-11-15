var NLCService = require('../nlc/NLCService.js');
//var NLCService_icd = require('../icdMapping/NLCService.js');
var RNRService = require('../rnr/RNRService.js');
var watson = require('watson-developer-cloud');
var result="";

var method = Drcode.prototype;
var nlc;
//var nlcIcd;
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
  //n0lcIcd = new NLCService_icd();
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
  //res.write('<style type="text/css">')

  res.write('</style>')
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
  var outputICD = function(response) {
    // The response is already an object in JSON form
    var rList = response.classes;

    for (var i = 0; i<4; i++) {
      res.write('<li>'+'\n');
      var dName = rList[i].class_name;
      res.write(dName + '\n');
      console.log(dName);
      res.write(rList[i].confidence + '\n\n');
      res.write('</li>'+'\n');
    }

  }



  var output = function(response) {
    // The response is already an object in JSON form
    var rList = response.classes;
    res.write('\n');

    //check the confience of the top class
    //!!!!!You should uncomment following after your fix the nlc!!!!!!!
    if(rList[0].confidence>0.5){
      // for now, print top three
      res.write('NLC RESULT:\n\n');
      res.write('<ul>'+'\n');
      for (var i = 0; i<4; i++) {
        res.write('<li>'+'\n');
        var dName = rList[i].class_name;
        res.write(dName + '\n');
        if (i==0){
          var diseaseForICD= rList[i].class_name;
          console.log(diseaseForICD);
          nlc.askICD0(diseaseForICD, outputICD);
        }
        res.write(rList[i].confidence + '\n\n');
        res.write('</li>'+'\n');
      }
      res.write('</ul>'+'\n');
    }else{
      rnr.searchSolrCluster(question,clusterId,collectionName,function(err,response){
              if (err){
                console.log('RNR error:', err);
                //!!!!!You should uncomment following after your fix the nlc!!!!!!!
                //output nlc result,even the confidence is lower than 0.5
                res.write('NLC RESULT:\n\n');
                res.write('<ul>'+'\n');
                for (var i = 0; i<4; i++) {
                  res.write('<li>'+'\n');
                  var dName = rList[i].class_name;
                  res.write(dName + '\n');
                  if (i==0){
                    var diseaseForICD= rList[i].class_name;
                    console.log(diseaseForICD);
                    nlc.askICD0(diseaseForICD, outputICD);
                  }
                  res.write(rList[i].confidence + '\n\n');
                  res.write('</li>'+'\n');
                }
                res.write('</ul>'+'\n');
              }else{
                res.write('RNR RESULT:\n\n');
                res.write('<ul>'+'\n');
                for (var i = 0; i<4; i++) {
                  res.write('<li>'+'\n');
                  if (i==0){
                    var diseaseForICD= JSON.stringify(response.response.docs[i].title, null, 2);
                    console.log(diseaseForICD);
                    nlc.askICD0(diseaseForICD, outputICD);
                  }
                  res.write(JSON.stringify(response.response.docs[i].title, null, 2)+'\n\n');
                  res.write('</li>'+'\n');
                }
              }
              res.write('</ul>'+'\n');
              res.write('</p>'+'\n');

              res.write('</body>'+'\n');
              res.write('</html>'+'\n');
              });
    }
};


nlc.ask(result, output);
}

function sleep(milliseconds) {
  var start = new Date().getTime();

  for (var i = 0; i < 1e7; i++) {
    //console.log('');
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
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
