/*
 * datalist
 */

define(function(require, exports, module){
  var $ = require("jquery"),
      _ = require("lodash"),
      format = require('objectformat'),
      Base = require('../Base');

  var mainTpl = '',
      itemTpl = ''
  itemTpl +='<li data-id="{key}">'
  itemTpl +=  '<span>{show_text}</span>'
  itemTpl +=  '<i class="xy-icon xy-shanchu {delBtnCls}">&times;</i>'
  itemTpl +='</li>'
  mainTpl +='<div id="" class="esys-datalist">'
  mainTpl +=  '<div class="esys-datalist-head {searchCls}">'
  mainTpl +=    '<div class="esys-search">'
  mainTpl +=      '<dl>'
  mainTpl +=        '<dt>'
  mainTpl +=          '<input type="text" class="form-control xyz_validate_input" placeholder="暂无过滤">'
  mainTpl +=          '<i class="fa fa-search"></i>'
  mainTpl +=        '</dt>'
  mainTpl +=        '<dd>'
  mainTpl +=          '<button type="button" class="btn btn-action-lv1 {btnCls}">{btnText}</button>'
  mainTpl +=        '</dd>'
  mainTpl +=      '</dl>'
  mainTpl +=    '</div>'
  mainTpl +=  '</div>'
  mainTpl +=  '<div class="esys-datalist-body">'
  mainTpl +=    '<h1 class="esys-datalist-title {titleCls}">'
  mainTpl +=     '{title}'
  mainTpl +=    '</h1>'
  mainTpl +=    '<ul>'
  mainTpl +=    '</ul>'
  mainTpl +=  '</div>'
  mainTpl +='</div>'

  // DataList
  var DataList = Base.extend({
    // defaults,constructor,initialize all for constuctor function
    defaults: {
      title: '',
      url: '',
      params: {},
      key: '',
      text: '',
      search: true,
      button: false,  // 即判断true,false也判断文字显示,只要传一个参数，button: 'add'或buuton: true
      deletable: true,  // 是否允许删除
    },
    constructor: function(options){
      // DataList.superclass.constructor就是父类Base,options可以传递参数到父类
      DataList.superclass.constructor.call(this, options)
      this.initialize(options)
    },
    initialize: function(options){
      this.el = $(options.el)
      this.options = _.assign({}, this.defaults, options.data)
      this.lastParams = this.options.params || {}; // 上次请求参数
      this.data = [] // 存储每次加载的最新数据
      this.key = options.data.key
      this.text = options.data.text
      this.events = options.events
      this.useExpression = /\{[^\{\}].*\}/.test(this.text)

    },
    render: function(){
      var opt = _.assign(this.options, {}), // 定义判断文字，显示等参数
          btnCls = 'hide',
          searchCls = this.options.search ? '' : 'hide',
          btnText = "新增"
      if(this.options.button !== false){
        btnCls = ''
        btnText = _.isString(this.options.button) ? this.options.button : '新增'
        this.options.button = true;
      }
      _.assign(opt,{
        btnCls: btnCls,
        btnText: btnText,
        searchCls: searchCls,
        titleCls: opt.title ? '' : 'hide'  // title为空即是false
      })
      mainTpl = format(mainTpl, opt)
      this.el.html(mainTpl)
      this.$body = this.el.find(".esys-datalist-body")
      this.load()
      this.initEvents()
    },

    // 加载所有内容list，翻页，搜索
    load: function(data){
      console.log("a");
      var _this = this
      // 请求数据
      $.ajax({
        type: 'get',
        url: _this.options.url,
        dataType: 'json',
        success: function(res){
          _this.data = res // 当前加载数据
          _this.renderList(res)
        }
      })

    },

    // 渲染列表
    renderList: function(list){
      var $itemWrap = this.$body.children('ul')
      _.each(list, function(item){
        $itemWrap.append(format(itemTpl, {
          key: item[this.key],
          show_text: this._getRenderText(item)
        }))
      },this)
      this.bindItemEvents()
    },

    // 初始化事件，绑定自定义事件
    initEvents: function(){
      var _this = this
      // 绑定events自定义事件--事件监听
      _.each(this.events, function(fn,key){
        this.on(key, fn, this)
      }, this)

      // 过滤事件
      var timeoutId = null
      function searchData(){
        if(timeoutId){
          clearTimeout(timeoutId)
        }
        var text = $(this).val()
        timeoutId = setTimeout(function(){
          _this.filter(text)
        },500)
      }
      var $searchInput = this.el.find(".esys-search :text")
      this.options.search && $searchInput.bind("propertychange", searchData).bind("input", searchData)



    },
    // 数据绑定事件
    bindItemEvents: function(){
      var _this = this,
          list = this.data,
          key = this.options.key
      // 点击列表项
      this.options.clickable && this.$body.find(">ul>li").bind("click", function() {
        var id = $(this).attr("data-id")
        $(this).addClass("selected").siblings().removeClass("selected")
        var data = _.find(list, function(item) {
          return item[key] == id
        })
        // ★自定义事件，由应用层对事件进行处理，在this.events中的定义
        _this.emit("click", data, _this)
      })

      // 删除 传的还是数据，不是dom
      this.$body.find(">ul>li>i").bind("click", function(event){
        event.stopPropagation()
        var id = $(this).parent().attr("data-id")
        var data = _.find(list, function(item){
          return item[key] == id
        })
        _this.emit("delete", data, _this)
      })
    },
    // 获取格式化的数据
    _getRenderText: function(data){
      return this.useExpression ? format(this.text, data) : data[this.text]
    },

    // 搜索filter
    filter: function(keyword){
      var key = this.options.key,
          hideData = []
      hideData = _.filter(this.data, function(item){
        var text = this._getRenderText(item)
        return text.indexOf(keyword) == -1  // 过滤不匹配的
      }, this)
      this.$body.find(">ul>li.hide").removeClass("hide")
      _.each(hideData, function(item){
        this.$body.find('ul>li[data-id='+ item[key] +']').addClass("hide")
      }, this)
    }
  })




  module.exports = DataList;
})
