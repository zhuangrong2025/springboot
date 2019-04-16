define(function(require,exports,module){
  var $ = require("jquery"),
      _ = require("lodash/lodash"),
      Widget = require("Widget")

  // 创建类 模态窗口
  var Window = function (){
    // 默认参数
    this.cfg = {
      width: 500,
      height: 300,
      title: "title",
      content: "content",
      events: {
  			ok:function(){
  				console.log("ok")
  			},
  			close:function(){
  				console.log("close")
  			}
      },
      methods: {

      }
    }
  }

  // 继承公用组件Widget，继承公共事件on,emit
  Window.prototype = $.extend({}, new Widget(), {
    alert: function(cfg){
      var _this = this
      var CFG = $.extend(this.cfg, cfg)
      var modalBox = '<div id="modal" class="modal-wrap">' + CFG.content
                      +'<p>-</p><p>-</p><p>-</p>'
                      +'<button class="btn" id="btnok">ok</button>'
                      +'<button class="btn" id="close">close</button>'
                    +'</div>'
      $("body").append(modalBox)
      $("#btnok").on("click",function(){
        _this.emit("ok")
      })
      $("#close").on("click",function(){
        _this.emit("close")
      })

      // on绑定实例 将事件push到event，可以扩展其他事件
      _.each(CFG.events, function(fn,key){
          _this.on(key, fn)
      })
    }
  })

  module.exports = Window;
})
