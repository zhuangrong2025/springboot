define(function(require, exports, module){
  // html中需引入seajs-helper.js才能不用写jquery的路径
  var $ = require("jquery"),
      _ = require("lodash"),
      format = require('objectformat'),
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
      // Dialog.superclass.constructor就是父类,options可以传递参数到父类
      Dialog.superclass.constructor.call(this, options)
      this.initialize(options)
    },
    initialize: function(options){
      this.id = _.uniqueId("esys_dialog_")
      this.options = _.assign({}, this.defaults, options.data)
      this.events = options.events
      this.modCache = null
    },
    render: function(){
      /*
       * 判断页面中是否有dialog实例 如果有则删除这个实例
       * toFix：id是变化，找不到对应的this.el的data-inst，会重复弹出窗口
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
      })
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
      this._renderContent()
      this._renderButtons()
      this._initEvents();
    },
    dispose: function(){
      this.el.remove();
    },
    close: function() {
      this.dispose();
    }
  })
  // 渲染内容
  Dialog.prototype._renderContent = function(){
    // url是子模块路径
    if(this.options.url) {
      if(this.modCache && this.modCache.modObj){  // 已经初始化，有子模块实例
        if(this.modCache.refresh == true){
          var modObj = this.modCache.modObj
          if(modObj.refresh){
            modObj.refresh()
          }else{
            if(modObj.dispose){
              modObj.dispose()
            }
            modObj.render()
          }
        }
      }else{ // 创建子模块实例
        var _this = this,
            bodyId = _.uniqueId("dialog_body_"),
            url = this.options.url,
            options = this.options.options

        this.el.find(".dialog-body").attr("id", bodyId)
        // require 子模块.js, url是子模块路径, ChildMod对这个模块名即类
        require.async(url, function(ChildMod){
          var opt = {
              el: '#' + bodyId
          }
          _.extend(opt, options || {})
          var cm = new ChildMod(opt)
          cm.render()
          _this.modCache = {}
          _this.modCache.modObj = cm
        })
      }

    }
  }
  // prototype合并到上面的Base.extend,不独立加
  // Dialog.prototype = {}

  var buttonsDef = {
    cancel: {type: "cancel", title:"取消", cls:"btn-cancel", handler: function(){
      this.close()
    }},
    // 关联执行到子模块
    save: {type:"save", title:"保存", cls:"btn-save", handler: function(){
      var inst = this.getInstance()
      if(inst){
        var _this = this
        var cb = function(){  // 在子模块中调用这个回调
          _this.close()
        }
        inst.save && inst.save(cb)
      }


    }}
  }
  // 渲染按钮
  Dialog.prototype._renderButtons = function(){
    // 初始化按钮数组，buttons[]的值是通过buttonsDef[key]或{}生成的
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
    // 将数组映射为对象 ，数组中的type作为key
    this.buttons = _.indexBy(buttons, 'type');
  }

  // 初始化事件，自定义事件绑定
  Dialog.prototype._initEvents = function(){
    var _this = this
    this.el.find(".dialog-footer .btn").on("click", function(){
      var type = $(this).attr("data-type")
      if(_this.buttons[type] && _this.buttons[type].handler){
        // 新增按钮的事件需要写在buttons的handler中，写在events中不触发
        _this.buttons[type].handler.call(_this, _this)
        // emit触发默认的事件，on是再绑定同名的其他事件
        _this.emit(type, _this)
        // _getEventName中是事件名数据写死save和cancel，新增的ok事件不能被触发
        // _this.emit(_this._getEventName(type), _this)
      }
    })

    // 当type一致的时候，可以触发多个绑定的save事件
    // 绑定自定义的事件
    _.each(_this.events, function(fn, key) {
        _this.on(key, fn, _this);
    }, _this);

  }
  // 获取事件名
  Dialog.prototype._getEventName = function(type){
    var eventKeys = {save: "save", cancel: "cancel", ok: "ok"}
    return eventKeys[type]

  }
  // 获取子模块
  Dialog.prototype.getInstance = function(){
    return this.modCache && this.modCache.modObj
  }

  module.exports = Dialog;
})
