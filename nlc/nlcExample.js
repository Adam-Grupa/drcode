var NLCService = require('./NLCService.js')

var nlc = new NLCService();

//nlc.create('train.csv','bird')
//nlc.deleteAll();
//nlc.showList();



var question = 'Is this a dog?';
nlc.ask(question);
