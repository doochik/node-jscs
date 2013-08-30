var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(types) {
        assert(Array.isArray(types), 'disallowAccessToPrivateProps option requires array value');
        this._typeIndex = {};
        for (var i = 0, l = types.length; i < l; i++) {
            this._typeIndex[types[i]] = true;
        }
    },

    getOptionName: function () {
        return 'disallowAccessToPrivateProps';
    },

    check: function(file, errors) {
        var typeIndex = this._typeIndex;

        file.iterateNodesByType('MemberExpression', function(node) {
            // property starts with "_"
            var property = node.property;
            var propName = node.property.name || node.property.value;
            if (!propName) {
                return;
            }
            if (propName.toString().charAt(0) === '_') {
                var obj = node.object;

                // always allow "this"
                if (obj.type !== 'ThisExpression') {
                    if (!typeIndex[obj.name]) {
                        errors.add('Private property usage', node.loc.start);
                    }
                }
            }
        });
    }

};
