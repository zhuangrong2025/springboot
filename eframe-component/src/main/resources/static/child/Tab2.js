define(function(require, exports, module) {
	var _ = require('lodash'),
        $ = require('jquery')

    var tpl = require('./template/Tab2.html');


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
    }
  }

	module.exports = Tab1;
});
