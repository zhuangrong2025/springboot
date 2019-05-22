define(function(require, exports, module){
    var $ = require('jquery')
    var CoverlapTest = function (options) {
        this.initialize(options);
    };

    CoverlapTest.prototype = {
        initialize: function (options) {
            this.el = options.el;
            this.name = options.name;
        },
        render: function(){
            $(this.el).html(this.name);
            // setTimeout(function(){
            //     window.XyzCoverlap.singleTest.dispose();
            // }, 3000);
        },
        dispose: function(){
            $(this.el).empty();
        }
    }

    module.exports = CoverlapTest;
});
