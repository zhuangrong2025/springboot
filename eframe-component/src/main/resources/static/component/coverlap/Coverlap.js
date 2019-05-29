/**
 * Coverlap
 * 弹出层，覆盖层
 */
define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('lodash'),
        Base = require('../Base'),
        format = require('objectformat');

    var mainTpl = ''
    mainTpl += '<div class="coverlap" id="coverlap_{id}">'
    mainTpl +=   '<div class="portlet">'
    mainTpl +=     '<div class="portlet-title">'
    mainTpl +=       '<a class="return-btn true" data-dismiss="coverlap">'
    mainTpl +=          '<span>返回</span>'
    mainTpl +=       '</a>'
    mainTpl +=     '</div>'
    mainTpl +=     '<div class="portlet-body">'
    mainTpl +=       'body'
    mainTpl +=     '</div>'
    mainTpl +=   '</div>'
    mainTpl += '</div>'
    // 基于基类--调用基类的监听
    var Coverlap = Base.extend({
      defaults: {
        id: '',
        title: ''
      },
      // 必须重写constructor，修改this指向，指向Coverlap,要不然后面的this都没有定义
      constructor: function(options){
        Coverlap.superclass.constructor.call(this, options)
        this.initialize(options)
      },
      // 初始化
      initialize: function(options){
        this.el = $(options.el)
        this.options = _.assign({}, this.defaults, options.data)
        this.onShow = options.onShow // 也可用on，emit事件监听实现
      },
      // render
      render: function(){
        var mainHtml = format(mainTpl, {
          id: this.options.id,
          title: this.options.title,
        })
        this.el.html(mainHtml)
        this._renderContent()
        this._bindEvents()
        this.show()

        // 设置window.Coverlap,用于子模块的调用 cov = window.Coverlap
        if(!window.Coverlap){
          window.Coverlap = {}
        }
        // 存储Coverlap实例, 对象的key: value
        window.Coverlap[this.options.id] = this

      },
      // getId
      getId: function(){
        return this.options.id
      },
      // show
      show: function(){
        if(this.onShow){
          this.onShow();
        }
      },
      // dispose
      dispose: function(){
        this.el.find("#coverlap_" + this.options.id).remove()
        // 销毁实例
        if(window.Coverlap){
            console.log("销毁实例!!!!!")
            delete window.Coverlap[this.options.id];
        }
      }

    })

    // _renderContent
    Coverlap.prototype._renderContent =  function(){
      var _this = this,
          url = this.options.child.path,
          bodyId = "coverlap_body_" + this.id
      this.el.find(".portlet-body").attr("id", bodyId)
      // 加载子模块内容,并调用子模块的方法
      require.async(url, function(ChildMod){
        var cm = new ChildMod({
          el: '#' + bodyId,
          id: _this.options.id  // 通过id获取父模块的实例，然后在子模块调用实例cov.hide()
        })
        cm.render()

        // 并调用子模块的方法
        _this.childObj = cm

      })
    }
    // _return
    Coverlap.prototype._return =  function(){
      // 销毁子模块
      if(this.childObj && this.childObj.dispose){
        this.childObj.dispose()
      }
      // 销毁父模块
      this.dispose()
    }
    // _bindEvents
    Coverlap.prototype._bindEvents =  function(){
      var _this = this
      // 点击了返回
      this.el.on("click", '[data-dismiss="coverlap"]',function(){
        _this._return()
      })

    }

    module.exports = Coverlap;
});
