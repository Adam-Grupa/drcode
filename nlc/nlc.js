


exports.nlcLogin = function(){
  var fs  = require("fs");
  var account = fs.readFileSync('./myCred.txt').toString().split('\n');

  var watson = require('watson-developer-cloud');
  var nlc = watson.natural_language_classifier({
     url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
     username: account[0],
     password: account[1],
     version: 'v1'
  });
  console.log('NLC Service Logged-in.')
  return nlc;
}


exports.nlcTrain = function(fileName, cName)
{
  var fs = require('fs');
  var trainSet = {
    language: 'en',
    name: cName,
    training_data: fs.createReadStream('./' + fileName)
  };
  console.log('NLC train data ready.')
  return trainSet;
}

exports.nlcCreate = function(nlc, trainSet)
{
  var nlc = nlc.create(trainSet, function(err, response) {
    if (err)
      console.log(err);
    else
      console.log(JSON.stringify(response, null, 2));
});
  console.log('NLC obj created.')
}


exports.nlcShowList = function(nlc)
{
  nlc.list({},
    function(err, response) {
      if (err){
        console.log('error while retrieving list of nlc:', err);
      }
      else{
          var strJSON = JSON.stringify(response, null, 2);
          var nlcList = JSON.parse(strJSON).classifiers;
          console.log('total ' + nlcList.length + ' calssifiers.')
          console.log(nlcList)
          for (i=0; i<nlcList.length; i++){
              var id = nlcList[i].classifier_id;
              var cDate = nlcList[i].created;
              console.log('classifier_id = ' + id);
              console.log('created: ' + cDate);
          }
      }
    }
  );
}


exports.nlcDelete = function(id)
{
  nlc.remove({
    classifier_id: id },
    function(err, response) {
      if (err)
        console.log('error:', err);
      else
        nlcShowList();
  });
}
