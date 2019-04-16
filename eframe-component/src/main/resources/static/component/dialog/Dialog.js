define(function(require, exports, module){
  var $ = require("../../javascripts/jquery"),
      _ = require("../../javascripts/lodash/lodash"),
      format = require('../../javascripts/objectformat'),
      Base = require('../Base');

  var mainTpl = '',
      buttonTpl = '<button class="btn {cls}" data-type="{type}">{title}</button>'
  mainTpl +='<div id="{id}" role="dialog" aria-hidden="true" class="dialog">'
  mainTpl +='<div class="dialog-header">{title} <span>&times;</span></div>'
  mainTpl +='<div class="dialog-body">内容</div>'
  mainTpl +='<div class="dialog-footer {buttonAlign}" >按钮</div>'
  mainTpl +='</div>'

  // dialog
  var Dialog = Base.extend({
    // defaults,constructor,initialize all for constuctor function
    defaults: {
      title: '',
      content: '',
      width: 'auto',
      height: 'auto',
      buttons: true,
      buttonAlign: 'center'
    },
    constructor: function(options){
      Dialog.superclass.constructor.call(this, options)
      this.initialize(options)
    },
    initialize: function(options){
      this.id = _.uniqueId("esys_dialog_")
      this.options = _.assign({}, this.defaults, options.data)
    },
    render: function(){
      /*
       * 判断页面中是否有dialog实例 如果有则删除这个实例
       * toFix：id是变化，找不到对应的this.el的data-inst
       */
      this.el = $("#" + this.id)
      if(this.el.length !== 0){
          var inst = this.el.data('inst');
          if(inst){
              inst.dispose();
          }
      }
      var mainHtml = format(mainTpl, {
          id: this.id,
          title: this.options.title,
          buttonAlign: this.options.buttonAlign
      });
      $('body').append(mainHtml)
      /* ★ 将dialog实例赋值在data-inst中，如果有重复dialog时，先删除旧dialog*/
      this.el = $("#" + this.id)
      this.el.data('inst', this)
      if(this.options.width && _.isNumber(this.options.width)){
        this.el.css("width", this.options.width)
      }
      if(this.options.height && _.isNumber(this.options.height)){
        this.el.css("height", this.options.height)
      }
      this._renderButtons()
      this._initEvents();
    },
    dispose: function(){
      console.log("remove");
      this.el.remove();
    },
    close: function() {
      this.dispose();
    }
  })
  // prototype合并到上面的Base.extend,不独立加
  // Dialog.prototype = {}

  var buttonsDef = {
    cancel: {type: "cancel", title:"取消", cls:"btn-cancel", handler: function(){
      console.log("cancel-handler");
      this.close()
    }},
    save: {type:"save", title:"保存", cls:"btn-save", handler: function(){
      console.log("save-handler");
      this.close()
      // var inst = this.getInstance()
      // if(inst){
      //    var _this = this
      //    var cb = function(){
      //      _this.close()
      //    }
      //    inst.save && inst.save(cb)
      // }
    }}
  }
  // 渲染按钮
  Dialog.prototype._renderButtons = function(){
    // 初始化按钮数组
    var buttons = [],
        initBtns = this.options.buttons
    if(initBtns === true){
      initBtns = ['cancel', 'save']
    }
    if(_.isArray(initBtns)){
      _.each(initBtns, function(btn){
        if(_.isString(btn)){
          buttons.push(_.assign({}, buttonsDef[btn]))
        }else{
          buttons.push(_.assign({}, buttonsDef[btn.type], btn))
        }
      })
    }
    // 赋值为html
    if(buttons.length){
      var btnArr = []
      _.each(buttons, function(btn){
        var btnHtml = format(buttonTpl,btn)
        btnArr.push(btnHtml)
      })
      this.el.find(".dialog-footer").html(btnArr.join(''))
    }
    // 将数组转为对象 ，数组中的type作为key
    this.buttons = _.indexBy(buttons, 'type');
  }

  // 初始化事件，自定义事件绑定
  Dialog.prototype._initEvents = function(){
    var _this = this
    this.el.find(".dialog-footer .btn").on("click", function(){
      var type = $(this).attr("data-type")
      if(_this.buttons[type] && _this.buttons[type].handler){
        _this.buttons[type].handler.call(_this, _this)
        _this.emit(_this._getEventName(type), _this)
      }
    })
    _.each(this.events, function(fn,key){
      this.on(key, fn, this)
    },this)
  }
  // 获取事件名
  Dialog.prototype._getEventName = function(type){
    var eventKeys = {save: "save", cancel: "cancel"}
    return eventKeys[type]
  }

  module.exports = Dialog;
})
