define(function(require,exports,module){
  var $ = require("jquery"),
      _ = require("lodash")

  // 创建类 模态窗口
  var Modal = function () {
    // 默认参数
    this.cfg = {
      width: 500,
      height: 300,
      title: "title",
      content: "",
      ok4handler: null,
      close4handler: null,
    }
    this.id = 'mid'
    // 自定义事件
    this.handlers = {}
  }

  Modal.prototype = {
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
        // CFG.ok4handler && CFG.ok4handler()  执行回调
        // $("#modal").remove()
        _this.fire("ok")
      })
      $("#close").on("click",function(){
        // CFG.close4handler && CFG.close4handler()
        // $("#modal").remove()
        _this.fire("close")
      })
    },
    // 将事件添加到自定义事件类型数组中
    on: function(type, handler){
      if(typeof this.handlers[type] == "undefined"){
        this.handlers[type] = []
      }
      this.handlers[type].push(handler)
    },
    // 遍历并触发这个类型中的模块个
    fire: function(type, data){
      if(this.handlers[type] instanceof Array){
        var handlers = this.handlers[type]
        for (var i = 0; i < handlers.length; i++) {
                handlers[i](data)
                // console.log(handlers[i]);
            }
      }
    }
  }

  module.exports = Modal;
})
