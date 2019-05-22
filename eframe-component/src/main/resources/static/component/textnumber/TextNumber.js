/**
 * richbase
 * demo：输入框字数统计
 * 从简单的函数写法到组件面向对象，在到事件监听的，事件代理、模板渲染，单向绑定
 */
define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('lodash'),
        format = require('objectformat');
    var tpl = ''

    var TextNumber = function(options){
      this.initialize(options)
    }
    TextNumber.prototype = {
      // 初始化
      initialize: function(options){
        this.el = $(options.el)
      },
      // render
      render: function(){
        this._bindEvents()
      },
      // getNumber
      getNumber: function(){
        return this.el.val().length
      }
    }
    // _bindEvent
    TextNumber.prototype._bindEvents = function(){
      var _this = this
      this.el.on("keyup", function(){
        var number = _this.getNumber()
        var afterSpan = $(this).next('span.tnum')
        // 判断input后面是否有span.tnum的dom
        if(afterSpan.length == 0){
          $(this).after('<span class="tnum"></span>')
        }
        afterSpan.html(number)
      })
    }

    module.exports = TextNumber;
});
