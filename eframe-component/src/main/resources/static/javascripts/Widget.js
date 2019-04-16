define(function(require,exports,module){
  var $ = require("jquery")

  // 公共组件，封装自定义事件
  var Widget = function () {
    this.handlers = {}
    // this.handlers = { ok: [fn, fn, ...], close: [fn, fn, ...]}
  }

  Widget.prototype = {
    // 事件绑定 push到数组
    on: function(type, handler){
      if(typeof this.handlers[type] == "undefined"){
        this.handlers[type] = []
      }
      this.handlers[type].push(handler)
    },
    // 遍历并触发某个事件
    emit: function(type, data){
      if(this.handlers[type] instanceof Array){
        var handlers = this.handlers[type]
        for (var i = 0; i < handlers.length; i++) {
                handlers[i](data)
            }
      }
      // console.log(this.handlers);
    }
  }

  module.exports = Widget;
})
