define(function(require, exports, module) {
	var _ = require('lodash'),
        $ = require('jquery')

    var tpl = require('./template/Tab1.html');


	var Tab1 = function(options) {
        this.initialize(options);
	};

	Tab1.prototype = {
		initialize: function(options) {
      this.el = $(options.el);
      this.options = options
		},
		render: function() {
      this.el.html(tpl);
      console.log(this.options);
		},
    dispose: function(){
    },
    refresh: function(){
      this.render()
      console.log("refresh为true, tab1子模块刷新");
    }
  }

	module.exports = Tab1;
});
