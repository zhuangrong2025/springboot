define(function(require, exports, module) {
	var _ = require('lodash'),
        $ = require('jquery')

    var tpl = require('./template/CoverlapChild.html');


	var CoverlapChild = function(options) {
        this.initialize(options);
	};

	CoverlapChild.prototype = {
		initialize: function(options) {
      this.el = $(options.el);
      this.id = options.id
		},
		render: function() {
      this.el.html(tpl);
      var id = this.id
      $("#get").on("click", function(){
        setTimeout(function(){
          // 获取Coverlap实例 window.Coverlap[id]
          var childId = window.Coverlap[id].getId()
          console.log(childId);
          // 删除实例
          var cov = window.Coverlap[id]
          cov.dispose()

        }, 100);
      })
		},
    dispose: function(){
      console.log("父模块调用了子模块的disppose！")
    },
    refresh: function(){
    }
  }

	module.exports = CoverlapChild;
});
