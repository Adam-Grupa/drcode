var NLCService = require('./NLCService.js')

var nlc = new NLCService();

nlc.create('data.csv','testClassifier')
//nlc.deleteAll();
nlc.showList();



//var question = 'Is this a dog?';
//nlc.ask(question);
