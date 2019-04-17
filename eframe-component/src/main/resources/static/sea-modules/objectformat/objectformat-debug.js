define("#/objectformat/0.1.3/objectformat-debug", [ "#/lodash/lodash-debug" ], function(require, exports, module, installOption) {
    var _ = require("#/lodash/lodash-debug");
    module.exports = function(tpl, data) {
        if (arguments.length === 0) {
            return null;
        }
        var str = arguments[0];
        for (var key in data) {
            var dataVal = data[key];
            if (isShowVal(dataVal)) {
                str = replaceStr(str, key, dataVal);
            } else {
                if (_.isPlainObject(dataVal)) {
                    //嵌套对象模板替换
                    str = setPlainVal(dataVal, [ key ], str);
                }
            }
        }
        return str;
    };
    var setPlainVal = function(data, key, str) {
        for (var _k in data) {
            var val = data[_k];
            key.push(_k);
            if (_.isPlainObject(val)) {
                str = setPlainVal(val, key, str);
            } else if (isShowVal(val)) {
                var reKey = key.join(".");
                str = replaceStr(str, reKey, val);
            }
        }
        return str;
    };
    var isShowVal = function(val) {
        return _.isString(val) || _.isNumber(val) || _.isBoolean(val);
    };
    var replaceStr = function(str, key, val) {
        var re = new RegExp("{" + key + "}", "gm");
        str = str.replace(re, val);
        return str;
    };
}, {});