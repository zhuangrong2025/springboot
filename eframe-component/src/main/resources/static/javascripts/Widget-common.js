/*
 * 统一的对外接口，保持多人编写时保持相同的风格renderUI, bindUI, syncUI
 * 定义widget的生命周期  render,  destroy
 */

define(function(require,exports,module){
  var $ = require("jquery"),
      _ = require("lodash"),
      format = require("objectformat")

  // 公共组件，封装自定义事件
  var Widget = function () {
      this.boundingBox = null   // 属性: 最外层容器
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
    },
    // 接口：添加dom
    renderUI: function(){},

    // 接口：绑定ui事件
    bindUI: function(){},

    // 接口：渲染效果样式
    syncUI: function(){},

    // 方法：创建
    render: function(){
      this.renderUI()
      // 在bind事件前清空handlers，如果放在类中则事件在内存未清除
      this.handlers = {}
      this.bindUI()
      this.syncUI()
    },

    // 接口：销毁前的处理函数
    destuctor: function(){},

    // 方法：销毁
    destroy: function(){
      this.destuctor()
      this.boundingBox.off()
      this.boundingBox.remove()
    }
  }

  module.exports = Widget;
})
