var method = NLCService.prototype;
var nlcAccount;
var primaryClassifierId = '2d7ac0x100-nlc-553'
global.cList;
function NLCService(){
   login();
};

login = function(){
  //var fs  = require("fs");
  //var account = fs.readFileSync('./myCred.txt').toString().split('\n');

  var watson = require('watson-developer-cloud');
  nlcAccount = watson.natural_language_classifier({
     url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
     username: '185ab6a7-fe13-4340-a6c0-ebd9ac0a8b59',//account[0],
     password: 'thLctxcVRmwa',//account[1],
     version: 'v1'
  });
  console.log('NLC Service Logged-in.')
};

train = function(fileName, cName){
  var fs = require('fs');
  var trainSet = {
    language: 'en',
    name: cName,
    training_data: fs.createReadStream('./' + fileName)
  };

  console.log('NLC train data ready.')
  return trainSet;
};


getList = function(functionToDo){
   nlcAccount.list({}, function(err, response) {
   if (err){
      console.log('error while retrieving list of nlc:', err);
    }
    else{
      strJSON = JSON.stringify(response, null, 2);
      global.cList = JSON.parse(strJSON).classifiers;
      functionToDo(cList);
    }
  });

}

method.create = function(fileName, cName){
  var trainSet = train(fileName, cName);
  var nlc = nlcAccount.create(trainSet, function(err, response) {
  if (err)
    console.log('error while creating classifier: '+err);
  else
    console.log(JSON.stringify(response, null, 2));
  });
  console.log(nlc)
}

method.showList = function(){
   getList(priPrintList);
}

priPrintList = function(cList){
  console.log('total ' + cList.length + ' calssifiers. \n')
  for (i=0; i<cList.length; i++){
    var cId = cList[i].classifier_id;
    var cDate = cList[i].created;
    var cName = cList[i].name;
    console.log(i+1 + ':\n' + 'classifier_id: ' + cId);
    console.log('name: ' + cName);
    console.log('created: ' + cDate + '\n');
  }
}

method.deleteAll = function(){
  getList(priDelete)
}

priDelete = function(cList){

  for (var i =0; i< cList.length; i++)
  {
    id = cList[i].classifier_id;
    nlcAccount.remove({
      classifier_id: id },
      function(err, response) {
        if (err)
          console.log('error:', err);
    });
  }



}

method.delete = function(id){
  priDelete(id);
}

method.ask = function(question)
{
  nlcAccount.classify({
  text: question,
  classifier_id: primaryClassifierId },
  function(err, response) {
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(response, null, 2));
});
}










module.exports = NLCService;
