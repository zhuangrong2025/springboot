define("#/stringformat/0.1.0/stringformat-debug", [], function(require, exports, module, installOption) {
    //格式化字符串，format('string format {0}','ok');
    module.exports = function() {
        if (arguments.length === 0) {
            return null;
        }
        var str = arguments[0];
        for (var i = 1, length = arguments.length; i < length; i++) {
            var re = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            str = str.replace(re, arguments[i]);
        }
        return str;
    };
}, {});