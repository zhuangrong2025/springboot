define(function (require, exports, module) {
    var $ = require('jquery');

    var Step1 = function(options){
        this.initialize(options);
    };

    Step1.prototype = {
        initialize: function (options) {
            var el = options.el;
            el = typeof (el) === 'string' ? $(el) : el;   //支持传入字符串或jquery对象
            this.el = el;
            this.options = options;
        },
        render: function(){
            this.el.html('这是步骤1, 每次切换都重新刷新，name为:' + this.options.name);
        },
        dispose: function(){
            this.el.empty();
        },
        refresh: function(){
            this.dispose();
            this.render();
        }
    };

    module.exports = Step1;
});
