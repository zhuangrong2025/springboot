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
      },
      dispose: function(){
        this.el.remove()
      }

    })

    // _renderContent
    Coverlap.prototype._renderContent =  function(){
      var _this = this,
          url = this.options.child.path,
          bodyId = _.uniqueId("coverlap_body_")
      this.el.find(".portlet-body").attr("id", bodyId)
      require.async(url, function(ChildMod){
        var cm = new ChildMod({
          el: '#' + bodyId
        })
        cm.render()
      })
    }
    // _return
    Coverlap.prototype._return =  function(){
      this.dispose()
    }
    // _bindEvents
    Coverlap.prototype._bindEvents =  function(){
      // 返回
      console.log("a");

    }

    module.exports = Coverlap;
});
