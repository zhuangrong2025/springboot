/**
 * richbase
 * demo：输入框字数统计
 * 从简单的函数写法到组件面向对象，在到事件监听的，事件代理、模板渲染，单向绑定
 */
define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('lodash'),
        Base = require('../Base'),
        format = require('objectformat');

    var tpl = ''
    // 基于基类--调用基类的监听
    var TextNumber = Base.extend({
      // 必须重写constructor，修改this指向，指向TextNumber,要不然后面的this都没有定义
      constructor: function(options){
        TextNumber.superclass.constructor.call(this, options)
        this.initialize(options)
      },
      // 初始化
      initialize: function(options){
        this.el = $(options.el)
      },
      // render
      render: function(){
        this._bindEvents()
        this._inputkeyup()
      },
      // getNumber
      getNumber: function(){
        return this.el.val().length
      },
      // count
      count: function(number){
        if( number > 5){
          console.log('超过5个字');
        }
        console.log(number);
        var afterSpan = this.el.next('span.tnum')
        if(afterSpan.length == 0){
          this.el.after('<span class="tnum">'+ number +'</span>个字')
        }
        afterSpan.html(number)
      }
    })

    // _bindEvent
    TextNumber.prototype._inputkeyup = function(){
      var _this = this
      this.el.on("keyup", function(){
        var number = _this.getNumber()
        // 触发input.keyup事件
        _this.emit("input.keyup", number, _this)
      })
    }
    TextNumber.prototype._bindEvents =  function(){
      // 绑定input.keyup事件名
      this.on("input.keyup", this.count, this)
    }

    module.exports = TextNumber;
});
