define(function (require, exports, module) {
    var $ = require('jquery');

    var mainTpl = require('./coverlap.html'),
    	bottombtnTpl = require('./coverlapbtn.html');

    var coverlap = function(options){
        this.initialize(options);
    };

    coverlap.prototype = {
        initialize: function (options) {
            this.el = options.el;
        },
        render: function(options){
            $(this.el).html(mainTpl);
            $(this.el).find('.coverlap_bottom_btn').html(bottombtnTpl);
        },
        dispose: function(){
            $(this.el).empty();
        },
        refresh: function(){
        }
    };
    module.exports = coverlap;
});
