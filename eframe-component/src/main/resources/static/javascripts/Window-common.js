define(function(require,exports,module){
  var $ = require("jquery"),
      _ = require("lodash"),
      format = require("objectformat"),
      Widget = require("./Widget-common")
  var boxTpl = '<div id="{bid}" class="modal-wrap">'
                +'{content}'
                +'<p>-</p><p>-</p><p>-</p><p>-</p><p>-</p>'
                +'<button class="btn" id="btnok">ok</button>'
                +'<button class="btn" id="close">close</button>'
              +'</div>'

  // 创建类 模态窗口
  var Window = function (){
    // 默认参数
    this.cfg = {
      bid: "",
      width: 500,
      height: 300,
      title: "title",
      content: "content",
      events: {
        ok: function(){ // 覆盖默认的ok事件
          console.log("ok0");
        },
        close:function(){
          console.log("close0")
        }
      }
    }
  }

  // 继承公用组件Widget，继承公共事件on,emit
  Window.prototype = $.extend({}, new Widget(), {
    // renderUI
    renderUI:function(){
      this.cfg.bid = _.uniqueId("boundingBox_")
      this.boundingBox = $(format(boxTpl, {
        bid: this.cfg.bid,
        content: this.cfg.content
      }))

      $("#" + this.cfg.el).append(this.boundingBox)
    },
    bindUI: function(){
      var _this = this
      $("#btnok").on("click",function(){
        _this.destroy()
        _this.emit("ok")
      })
      $("#close").on("click",function(){
        _this.emit("close")
      })
    },
    // alert
    alert: function(cfg){
      var _this = this
      // 事件events合并
      cfg.events = _.assign(this.cfg.events, cfg.events)
      $.extend(this.cfg, cfg)

      this.render()
      // on绑定实例 将事件push到event，可以扩展其他事件
      _.each(_this.cfg.events, function(fn,key){
          _this.on(key, fn)
      })
    }
  })

  module.exports = Window;
})
