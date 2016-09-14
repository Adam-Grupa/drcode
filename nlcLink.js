var watson = require('watson-developer-cloud');
var natural_language_classifier = watson.natural_language_classifier({
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username: '185ab6a7-fe13-4340-a6c0-ebd9ac0a8b59',
  password: 'thLctxcVRmwa',
  version: 'v1'
});

console.log('NLC Service Logged-in.')

var fs = require('fs');
var params = {
  language: 'en',
  name: 'My Classifier',
  training_data: fs.createReadStream(__dirname + '/train.csv')
};

console.log('NLC train data inserted.')

var nlc = natural_language_classifier.create(params, function(err, response) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(response, null, 2));
});

console.log('NLC obj created.')
