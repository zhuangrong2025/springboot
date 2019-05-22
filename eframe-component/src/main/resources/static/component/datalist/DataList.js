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
      pagination: true,   // 是否分页
      pageSize: 3   // 每页记录数
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
      this.pagination = null
      this.pageInfo = { // 分页数据传递到分页实例pagination
        start: 0,
        page: 1,
        length: this.options.pageSize
      }

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
      var _this = this

      // 请求数据
      $.ajax({
        type: 'get',
        url: _this.options.url,
        dataType: 'json',
        success: function(res){
          _this.data = res // 当前加载数据
          var totalNum = res.length || 0
          // load创建分页
          if(_this.options.pagination == true  && !_this.pagination ){ // 判断是否要分页，和是否已经有分页条
            _this.createPagination(totalNum)
          }

          // 渲染数据
          _this.renderList(res)
        }
      })

    },

    // 渲染列表
    renderList: function(list){
      var $itemWrap = this.$body.children('ul')
      $itemWrap.empty() // 每次load之前都要清空数据
      _.each(list, function(item){
        $itemWrap.append(format(itemTpl, {
          key: item[this.key],
          show_text: this._getRenderText(item)
        }))
      },this)
      this.bindItemEvents()
    },
    // 更新item，
    updateItem: function(data){
      var key = this.options.key,
          keyVal = data[key]
      if(data && !_.isUndefined(keyVal)){
        var $item = this.$body.find('ul>li[data-id=' + keyVal + ']')
        $item.children('span:first').html(this._getRenderText(data))
      }
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

      // 绑定新增按钮事件
      if(this.options.button == true){
        this.el.find(".esys-search button").bind("click", function(){
          _this.emit("add", this)
        })
      }

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
      if(!_.isEmpty(keyword)){
        hideData = _.filter(this.data, function(item){
          var text = this._getRenderText(item)
          return text.indexOf(keyword) == -1  // 过滤不匹配的
        }, this)
      }
      this.$body.find(">ul>li.hide").removeClass("hide")
      _.each(hideData, function(item){
        this.$body.find('ul>li[data-id='+ item[key] +']').addClass("hide")
      }, this)
    },

    // 创建分页条
    createPagination: function(totalNum){
      var _this =  this
      this.pagination = new Pagination({
        el: "#pagination-wrap",
        data: {
          pageSize: _this.options.pageSize,
          totalNum: totalNum
        },
        events: {
          pageselect: function(page){
            _.assign(_this.pageInfo, {
              start: (page - 1) * _this.options.pageSize,
              page: page
            })
            console.log(_this.pageInfo);
            _this.load()
          }
        }
      })
      this.pagination.render()
    }

  })


  var paginationtpl = ''
  paginationtpl += '<div class="pagination-panel">'
  paginationtpl += '<span>第<em class="cur-page">{page}</em></span>'
  paginationtpl += '<span>共{totalPage}</span>'
  paginationtpl += '<a class="prev" data-page="{prevPage}" >[prev]</a> '
  paginationtpl += '<a class="next" data-page="{nextPage}" >[next]</a> '
  paginationtpl += '</div>'

  /*
   * 分页组件 Pagination
   */

  var Pagination = Base.extend({
    defaults: {
      page: 1,         // 当前页
      pageSize: 10,    // 每页记录数
      totalNum: 0,     // 总记录页数
      totalPage: 1     // 总页数
    },
    constructor: function(options){
      Pagination.superclass.constructor.call(this, options)
      this.initialize(options)
    },
    initialize: function(options){
      this.el = $(options.el)
      this.options = _.assign({}, this.defaults, options.data)
      this.events = options.events
      this.page = this.options.page
      _.assign(this.options, { // 动态重新记录总页数
        totalPage : Math.max(Math.ceil(this.options.totalNum/this.options.pageSize), 1),
      })

    },
    render: function(){
      var opt = _.assign(this.options, {})

      _.assign(opt,{
        prevPage: this.options.page - 1,
        nextPage: this.options.page + 1
      })
      this.el.html(format(paginationtpl, opt))
      this.$prevLink = this.el.find('a.prev')
      this.$nextLink = this.el.find('a.next')

      this.bindEvents()
    },
    toPage: function(page){ // 根据当前页计算data-page变化
      var $prevLink = this.el.find('a.prev'),
          $nextLink = this.el.find('a.next'),
          isFirstPage = page == 1 ? true : false,
          isLastPage = page == this.options.totalPage ? true : false,
          prevPage = isFirstPage ? 0 : page - 1, // 上一页
          nextPage = isLastPage ? this.options.totalPage : page + 1 // 下一页
      this.el.find(".cur-page").text(page)
      $prevLink.attr('data-page', prevPage)
      $nextLink.attr('data-page', nextPage)
      isFirstPage ? $prevLink.addClass("disabled") : $prevLink.removeClass('disabled')
      isLastPage ? $nextLink.addClass("disabled") : $nextLink.removeClass('disabled')

    },
    bindEvents: function(){
      _.each(this.events, function(fn, key){
        this.on(key, fn , this)
      }, this)
      var _this = this
      // 获取当前page，page数据有自定义事件处理
      this.el.find('a[data-page]').bind("click", function(){
        if(!$(this).hasClass('disabled')){
          var page = 1 * $(this).attr('data-page') || _this.page
          console.log("bindevent" + page);
          _this.toPage(page) // 只让data-page做相应的变化,实际处理由自定义事件
          _this.emit("pageselect", page, _this)
        }
      })
    }
  })



  module.exports = DataList;
})
