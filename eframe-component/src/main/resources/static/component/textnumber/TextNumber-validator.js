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
        this.data = []
      },
      // render
      render: function(){
        this.getData()
        this._bindEvents()
        this._inputkeyup()
      },
      // getData 获取所有的input的name, value,组成参数对象
      getData: function(){
        var keys = [],
            values = [],
            items = this.el.find("input")
        items.each(function(){
          //创建所有表单数据 {username: 'admin', password: '123'}
          var key = $(this).attr("name"),
              val = $(this).val()
          keys.push(key)
          values.push(val)
        })
        this.data = _.zipObject(keys, values)
      },
      // setValue dom是当前点击的input
      setValue: function(value, dom){
        var afterSpan = dom.next('.tnum'),
            len = value.length

        this.el.find('.tips').html("")
        if(afterSpan.length == 0){
          dom.after('<span class="tnum">'+ len +'</span>')
        }
        afterSpan.html(len)
        if(value.length >= 8){
          this.el.find('.tips').html("最多只能输入8个字")
        }
      },
      // 提交
      submit: function(){
        var arguments = this.el.find('.arguments')
        // getdata
        this.getData()
        arguments.html("参数：" + JSON.stringify(this.data));
      }
    })

    // input键盘输入时触发
    TextNumber.prototype._inputkeyup = function(){
      var _this = this
      this.el.find("input").on("keyup", function(){
        var value = $(this).val()
        // emit触发事件
        _this.emit("input.keyup", value, $(this))
      })
    }
    // _bindEvent
    TextNumber.prototype._bindEvents =  function(){
      var _this = this
      // 绑定input.keyup事件名
      this.on("input.keyup", this.setValue)
      this.el.find('.btn-sub').on("click", function(){
        _this.submit()
      })
    }

    module.exports = TextNumber;
});
