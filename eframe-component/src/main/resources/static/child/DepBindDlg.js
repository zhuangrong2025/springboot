define(function(require, exports, module) {
	var _ = require('lodash'),
        $ = require('jquery')

    var tpl = require('./template/DepBindDlg.html');


	var DepBindDlg = function(options) {
        this.initialize(options);
	};

	DepBindDlg.prototype = {
		initialize : function(options) {
      this.el = $(options.el);
		},
		render : function() {
      console.log(tpl);
      this.el.html("tpl");
      console.log("请求子模块");
		}
  };

	module.exports = DepBindDlg;
});
