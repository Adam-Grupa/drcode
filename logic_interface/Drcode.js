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
  var icdCode=['','','','',''];
  var icdProb = [0,0,0,0,0];
  var index = 0;

  res.writeHead(200, {
    'content-type': 'text/html'
  });

  res.write('<!DOCTYPE html>' + '\n');
  res.write('<html>'+'\n');
  res.write('<head>');
  res.write('<title>ICD Code Search</title>'+'\n');
  res.write('<style type="text/css">* {font-family:arial, sans-serif;}</style>'+'\n');
  res.write('<style type="text/css">* body {background-image: url("http://i.imgur.com/SWQcTGl.jpg");}</style>'+'\n');
  res.write('<style type="text/css">* body {background-size: cover;}</style>'+'\n');
  res.write('<style type="text/css">* body {color: black;}</style>'+'\n');
  res.write('<style type="text/css">* ul{background: #77d3ef; width:60%; margin: auto; margin-top: 10px;}</style>'+'\n');
  res.write('<style type="text/css">* li{background-color: transparent;}</style>'+'\n');
  res.write('<style type="text/css">* .container{background-color: #FFFFFF; width: 60%; margin: auto; margin-top: 0px; min-height: 60%; padding: 20px; text-align: center;}</style>'+'\n');
  res.write('<style type="text/css">* .h1{font-size: 5em; font-weight: 700; font-weight: 700; font-weight: 700;}</style>'+'\n');

  res.write('</head>');
  res.write('<body>'+'\n');
  res.write('<div class="container">'+'\n');
  res.write('<h1>Searching Result</h1>');
  //res.write('<p>received the data: ');
  //res.write(question + '\n');

  result = "";
  getCoreVocab(question);
  //res.write('</br></br>processed data: ');
  //res.write(result +'</p>'+'\n');
  // Define function here
  // Javascript closures allow us to remove unneeded function arguments
  var outputICD = function(response) {
    if (index==0) res.write('<div class="container">'+'\n');
    // The response is already an object in JSON form
    var rList = response.classes;


    icdCode[index] = rList[0].class_name;
    icdProb[index] = rList[0].confidence;
    index ++;
    console.log(index);



    if(index==5)
    {
        res.write('ICD Codes'+'\n');
        res.write('<ul>'+'\n');
        for (var ii = 0; ii<5; ii++)
        {
          res.write(icdCode[ii]);
          res.write(': ');
          var str = icdProb[ii].toString();
          res.write(str.substring(2,4) + '%<br>');
        }
        res.write('</ul>'+'\n');
        for(var i=0; 100; i++)
        {
          sleep(10);
        }
        res.end();

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
      res.write('<h2>NLC RESULT:</h2>\n\n');
      res.write('<ul>'+'\n');
      for (var i = 0; i<4; i++) {
        res.write('<li>'+'\n');
        var dName = rList[i].class_name;
        res.write(dName + '\n');
        if (i==0){
          var diseaseForICD= rList[i].class_name;
          console.log(diseaseForICD);
          nlc.askICD0(diseaseForICD, outputICD);
          nlc.askICD1(diseaseForICD, outputICD);
          nlc.askICD2(diseaseForICD, outputICD);
          nlc.askICD3(diseaseForICD, outputICD);
          nlc.askICD4(diseaseForICD, outputICD);
        }

        var str = rList[i].confidence.toString();
        res.write(' confidence: '+ str.substring(2,4) + '%\n\n');
        res.write('</li>'+'\n');
      }
      res.write('</ul>'+'\n');
    }else{
      rnr.searchSolrCluster(question,clusterId,collectionName,function(err,response){
              if (err){
                console.log('RNR error:', err);
                //!!!!!You should uncomment following after your fix the nlc!!!!!!!
                //output nlc result,even the confidence is lower than 0.5
                res.write('<h2>NLC RESULT:</h2>\n\n');
                res.write('<ul>'+'\n');
                for (var i = 0; i<4; i++) {
                  res.write('<li>'+'\n');
                  var dName = rList[i].class_name;
                  res.write(dName + '\n');
                  if (i==0){
                    var diseaseForICD= rList[i].class_name;
                    //console.log(diseaseForICD);
                    nlc.askICD0(diseaseForICD, outputICD);
                    nlc.askICD1(diseaseForICD, outputICD);
                    nlc.askICD2(diseaseForICD, outputICD);
                    nlc.askICD3(diseaseForICD, outputICD);
                    nlc.askICD4(diseaseForICD, outputICD);
                  }
                  res.write(rList[i].confidence + '\n\n');
                  res.write('</li>'+'\n');
                }
                res.write('</ul>'+'\n');
                res.write('</p>'+'\n');
                res.write('</div>'+'\n');

                res.write('</body>'+'\n');
                res.write('</html>'+'\n');
              }else{
                res.write('<h2>RNR RESULT:</h2>\n\n');
                res.write('<ul>'+'\n');
                for (var i = 0; i<4; i++) {
                  res.write('<li>'+'\n');
                  if (i==0){
                    var diseaseForICD= JSON.stringify(response.response.docs[i].title, null, 2);
                    //console.log(diseaseForICD);
                    nlc.askICD0(diseaseForICD, outputICD);
                    nlc.askICD1(diseaseForICD, outputICD);
                    nlc.askICD2(diseaseForICD, outputICD);
                    nlc.askICD3(diseaseForICD, outputICD);
                    nlc.askICD4(diseaseForICD, outputICD);
                  }
                  res.write(JSON.stringify(response.response.docs[i].title, null, 2)+'\n\n');
                  res.write('</li>'+'\n');
                }
              }
              res.write('</ul>'+'\n');
              res.write('</p>'+'\n');
              res.write('</div>'+'\n');

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
