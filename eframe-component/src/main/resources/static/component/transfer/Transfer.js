/**
 * 部门用户穿梭选择框.
 */
define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('lodash'),
        format = require('objectformat');
    require("../../sea-modules/bootstrap/bootstrap.css")
    var tpl = '',
        itemTpl = '';
    tpl += '<div class="container esys-transfer-wrap">'
    tpl += '<div class="row">'
    tpl +=  '<div class="col-xs-5">'
    tpl +=    '<div class="esys-transfer">';
tpl +=          '<div class="esys-transfer-hd">';
tpl +=            '<span class="esys-transfer-label">';
tpl +=              '{left_title}<em>(0)</em>';
tpl +=            '</span>';
tpl +=            '<span class="pull-right">';
tpl +=              '<input type="text" class="form-control search-input-btn" placeholder="输入关键字搜索">';
tpl +=            '</span>';
tpl +=          '</div>';
tpl +=          '<div class="esys-transfer-bd">';
tpl +=          '</div>';
tpl +=       '</div>';
    tpl +=  '</div>'
    tpl +=  '<div class="col-xs-2">'
    tpl +=    '<button class="btn-transfer esys-transfer-move-right"> to right</button>'
    tpl +=    '<button class="btn-transfer esys-transfer-move-left"> to left</button>'
    tpl +=  '</div>'
    tpl +=  '<div class="col-xs-5">'
    tpl +=    '<div class="esys-transfer">';
tpl +=          '<div class="esys-transfer-hd">';
tpl +=            '<span class="pull-left esys-transfer-label">';
tpl +=              '{right_title}<em>(0)</em>';
tpl +=            '</span>';
tpl +=          '</div>';
tpl +=          '<div class="esys-transfer-bd">';
tpl +=          '</div>';
tpl +=       '</div>';
    tpl +=  '</div>'
    tpl += '</div>'
    tpl += '</div>'

    itemTpl += '<div class="form_checkbox">';
    itemTpl += '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">';
    itemTpl += '<input type="checkbox" class="checkboxes" value="{key}"/>';
    itemTpl += '{show_text}';
    itemTpl += '<span></span>';
    itemTpl += '</label>';
    itemTpl += '</div>';

    var Transfer = function(options){
      this.initialize(options)
    }
    Transfer.prototype = {
      // 初始化
      initialize: function(options){
        this.el = $(options.el)
        this.key = options.key
        this.text = options.text
        this.value = options.value  // 初始传入已选的数据[{}]
        this.title = options.title
        // title默认值 判断非数组或小于2个元素
        if(!_.isArray(this.title) || this.title.length < 2){
          this.title = ['数据','已选数据']
        }
      },
      // render
      render: function(){
        tpl = format(tpl, {
          left_title: this.title[0],
          right_title: this.title[1]
        })
        this.el.html(tpl)
        this.leftBox = new TransferBox({
          el: this.el.find('.esys-transfer:eq(0)'),
          key: this.key,
          text: this.text,
          realRemove : true
        })
        this.rightBox = new TransferBox({
          el: this.el.find('.esys-transfer:eq(1)'),
          key: this.key,
          text: this.text,
          realRemove : true //真实移除数据
        })
        this._bindEvents()
      }
    }
    // 加载所有数据，根据this.value预加载已选中的
    Transfer.prototype.load = function(data){
      var _this = this
      // 如果传入value，已选的数据
      if(this.value){
        var selections = [],
            key = this.key,
            dataMap = _.indexBy(data, key)
        _.each(this.value, function(v){
          selections.push(dataMap[v[key]])
        })
        // 将selections在映射到dataMap,
        dataMap = _.indexBy(selections, key)
        var list = _.filter(data, function(item){
          return !dataMap[item[key]]
        })
        this.leftBox.load(list)
        this.rightBox.load(selections)
      }else{
        this.leftBox.load(data)
        this.rightBox.load([])
      }
    }
    // 向右移动
    Transfer.prototype._moveToRight = function(){
      var selections = this.leftBox.getSelections()

      this.leftBox.remove(selections)
      this.rightBox.add(selections)
    }
    // 向左移动
    Transfer.prototype._moveToLeft = function(){
      var selections = this.rightBox.getSelections()

      this.rightBox.remove(selections)
      this.leftBox.add(selections)
    }
    // 搜索过滤
    Transfer.prototype._searchData = function(text){
      var _this = this
      this.leftBox.filter(text)
    }

    // 绑定事件
    Transfer.prototype._bindEvents = function(){
      var _this = this
      // 右移
      this.el.find(".esys-transfer-move-right").on("click", function(){
        _this._moveToRight()
      })
      // 左移
      this.el.find(".esys-transfer-move-left").on("click", function(){
        _this._moveToLeft()
      })

      // 搜索框输入事件
      var timeoutId = null
      function searchItem(){
        if(timeoutId){
          clearTimeout(timeoutId)
        }
        var  text = $(this).val()
        timeoutId = setTimeout(function(){
          _this._searchData(text)
        },500)
      }
      this.el.find(".search-input-btn").on("input", searchItem)  // searchItem中的this为input
    }



    /**
     * TransferBox列表框, Transfer需要用到类
     * 用于数据加载、移除等操作.
     */
    TransferBox = function(options){
      this.initialize(options)
    }
    TransferBox.prototype = {
      initialize:  function(options){
        this.el = $(options.el)
        this.key = options.key
        this.text = options.text
        // 格式化text,用正则表达式判断有无花括号
        this.useExpression = /\{[^\{\}].*\}/.test(this.text)
        this.realRemove = options.realRemove // 是否真实移除, false只做隐藏，不移除
        this.data = [] // 数据
        this.map = {} // 映射数据, key: data的格式
      },
      // load
      load: function(data){
        if(!data) return
        this.data = data
        this.map = _.indexBy(this.data, this.key)
        var itemArr = [],
            key = this.key,
            itemHtml
        _.each(data, function(item){
          itemHtml = format(itemTpl, {
            key: item[key],
            show_text: this._getRenderText(item)
          })
          itemArr.push(itemHtml)
        }, this)
        this.el.find(".esys-transfer-bd").html(itemArr.join(''))
        this._refreshCounter()
      },
      // add
      add: function(data){
        // 添加时rightBox的this.data为空
        var key = this.key,
            code
        _.each(data, function(item){
          this.data.push(item)
          code = item[key]
          if(this.map[code]){
            this.map[code].remove = false
          }else{
            this.map[code] = item
          }
          var $item = this.el.find('input[value='+ code +']').parents('.form_checkbox')
          if($item.length){//已存在dom，删除样式，不重复添加
            $item.removeClass('hide pre-remove')
          }else{ // 没有对应的dom，添加dom
            var itemHtml = format(itemTpl,{
              key: item[key],
              show_text: this._getRenderText(item)
            })
            this.el.find(".esys-transfer-bd").append(itemHtml)
          }
        }, this)
        this._refreshCounter()
        if(data && data.length){
          // this.data中排除重复项,防止重复项进来造成脏数据
          this.data = _.uniq(this.data, this.key)

        }
      },
      // remove
      remove: function(data){
        var key = this.key,
            code
        _.each(data, function(n){
          code = n[key]
          var $item = this.el.find('input[value='+ code +']').parents(".form_checkbox")
          this.map[code].remove = true
          if(this.realRemove){
            $item.remove()
          }else{
            // 添加.pre-remove标示，目的是在非真实删除时，此checkbox即使被选中，也不会添加到selections数组中
            $item.addClass("pre-remove").find('input[type=checkbox]').prop("checked",false)
          }
          // 删除this.data中已经移除的项,在refreshCounter需要动态获取data
          _.remove(this.data, function(item){
            return item[key] == code
          })
        },this)
        this._refreshCounter()
      },
      // filter 过滤选项
      filter: function(keyword){
        var hideData = [],
            key = this.key
        if(!_.isEmpty(keyword)){
          var hideData = _.filter(this.data, function(item){
                var text = this._getRenderText(item)
                return text.indexOf(keyword) == -1 // 返回与关键字不匹配的数据，然后将这些数据隐藏
              }, this)
        }
        this.el.find(".form_checkbox.hide").removeClass("hide")
        _.each(hideData, function(n){  //将与关键字不匹配的项隐藏
          this.el.find('.form_checkbox:not(.pre-remove) input[value='+ n[key] +']').parents(".form_checkbox").addClass("hide")
        }, this)
      },

      // 选中的项
      getSelections: function(){
        var selections = [],
            _this = this,
            items = this.el.find('.form_checkbox:not(.pre-remove) input[type=checkbox]:checked')  // :not(.pre-remove)过滤已添加过的
        items.each(function(){
          selections.push(_this.map[$(this).val()])
        }, this)
        return selections
      },

      // 返回this.data
      getData: function(){
        return this.data
      },

      /*
       * 获取格式化的列表文本,判断是有花花括号 this.text: "{role_name}"
       * 如果有，用format加tpl的方式取值
       * 如果没有，data[key]的方式取值
       * data = {role_name: "角色1", role_id: 96}
       * 返回 "角色1"
       */
      _getRenderText : function (data) {
          return this.useExpression ? format(this.text, data) : data[this.text];
      },

      // 统计数量
      _refreshCounter: function(){
        this.el.find("span.esys-transfer-label>em").html('(' + this.data.length + ')')
      }
    }

    module.exports = Transfer;
});
