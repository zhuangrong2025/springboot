define(function(require,exports,module){

  var m = require("Mod1")
  // 要用1.8.3, 2.1.1版本不兼容
  var $ = require("jquery")
  // var mainTpl = require('main.html')
  var mainTpl = "内容"

  // 创建类
  var DepRoleManage = function (options) {
      this.initialize(options)
  }
  DepRoleManage.prototype = {
      initialize: function (options) {
          this.el = options.el;
      },
      render: function () {
          $(this.el).html(mainTpl);
      }
  };
  module.exports = DepRoleManage;
})
