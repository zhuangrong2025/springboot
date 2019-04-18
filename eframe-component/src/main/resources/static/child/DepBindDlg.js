define(function(require, exports, module) {
	var _ = require('lodash'),
        $ = require('jquery')

    var tpl = require('./template/DepBindDlg.html');


	var DepBindDlg = function(options) {
        this.initialize(options);
	};

	DepBindDlg.prototype = {
		initialize: function(options) {
      this.el = $(options.el);
		},
		render: function() {
      this.el.html(tpl);
		},
    dispose: function(){

    },
    refresh: function(){
    }
  }

  // 保存, dialog组件会调用该方法
  DepBindDlg.prototype.save = function(cb){
    cb && cb()
    console.log("子模块中save方法");
  }

	module.exports = DepBindDlg;
});
