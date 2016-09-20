var NLCService = require('./NLCService.js')

var nlc = new NLCService();

//nlc.create('train.csv','name')
//nlc.deleteAll();
//nlc.showList();



var question = 'Is this a dog?';
nlc.ask(question);
