var NLCService = require('../nlc/NLCService.js');

var nlc;

exports.nlc = {
    setUp: function (callback) {
        // Set up environment for testing
        // For example, logging into the NLC service
        nlc = new NLCService();
        callback();
    },
    tearDown: function (callback) {
        // Teardown code would go here, but don't need it right now
        // For example, an open connection would be closed here
        callback();
    },
    simpleTest: function (test) {
        test.expect(1);
        
        var symptoms = 'wheezing cough productive cough';
        
        var callbackTest = function (response) {
            var topClass = response.top_class;
            test.equal(topClass, 'asthma', 'Expected asthma as top class for ' + symptoms);
            test.done();
        };
        
        nlc.ask(symptoms, callbackTest);
    }
}
