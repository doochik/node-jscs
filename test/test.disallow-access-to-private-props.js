var Checker = require('../lib/checker');
var assert = require('assert');

describe('rules/disallow-acccess-to-private-props', function() {
    var checker;
    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    var tests = {
        'myObj._test': 1,
        'myObj["_test"]': 1,
        'myObj._test = 1': 1,
        'myObj["_test"] = 1': 1,
        'myObj._test()': 1,
        'myObj["_test"]()': 1,
        'self._actions[action.id] = action': 1,
        'this._data[id]._options = 1': 1,
        'myNS.func()._data': 1,

        'this._test()': 0,
        'that._test': 0,
        'this._actions[action.id] = action': 0,
        'foo.bar._prop = null': 0,
        'myNs.myClass.prototype._privateMethod = function(){}': 0,

        'this[1]': 0
    };

    for (var testCode in tests) {
        (function(testCode, errorCount) {

            var testName = 'should ' + (errorCount ? '' : 'not ') + 'report access in "' + testCode + '"';

            it(testName, function() {
                checker.configure({ disallowAccessToPrivateProps: ['that', 'foo.bar'] });
                assert(checker.checkString(testCode).getErrorCount() === errorCount);
            });

        })(testCode, tests[testCode]);
    }

});
