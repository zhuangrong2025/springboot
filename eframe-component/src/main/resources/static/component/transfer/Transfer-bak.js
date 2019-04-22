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
    tpl +=  '<div class="col-md-5">'
    tpl +=    '<div class="esys-transfer">';
tpl +=          '<div class="esys-transfer-bd">';
tpl +=          '</div>';
tpl +=       '</div>';
    tpl +=  '</div>'
    tpl +=  '<div class="col-md-2">'
    tpl +=    '<button class="btn-transfer esys-transfer-move-right"> to left</button>'
    tpl +=    '<button class="btn-transfer esys-transfer-move-left"> to right</button>'
    tpl +=  '</div>'
    tpl +=  '<div class="col-md-5">'
    tpl +=    '<div class="esys-transfer">';
tpl +=          '<div class="esys-transfer-bd">right';
tpl +=          '</div>';
tpl +=       '</div>';
    tpl +=  '</div>'
    tpl += '</div>'
    tpl += '</div>'

    itemTpl += '<div class="form_checkbox">';
    itemTpl += '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">';
    itemTpl += '<input type="checkbox" class="checkboxes" value="{key}"/>';
    itemTpl += 'show_text';
    itemTpl += '<span></span>';
    itemTpl += '</label>';
    itemTpl += '</div>';

    var Transfer = function(options){
      this.initialize(options)
    }
    Transfer.prototype = {
      initialize: function(options){
        this.el = $(options.el)
        this.key = options.key
        this.text = options.text
      },
      render: function(){
        this.el.html(tpl)
        this.leftBox = new TransferBox({
          el: this.el.find('.esys-transfer:eq(0)'),
          key: this.key,
          text: this.text,
          realRemove : false
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
    Transfer.prototype.load = function(data){
      var _this = this


      this.leftBox.load(data)
    }
    Transfer.prototype._moveToRight = function(){
      var selections = this.leftBox.getSelections()

      this.leftBox.remove(selections)
      this.rightBox.add(selections)
    }

    // 绑定事件
    Transfer.prototype._bindEvents = function(){
      var _this = this
      this.el.find(".esys-transfer-move-right").on("click", function(){
        _this._moveToRight()
      })
    }

    /* 穿梭框 data数据 */
    TransferBox = function(options){
      this.initialize(options)
    }
    TransferBox.prototype = {
      initialize:  function(options){
        this.el = $(options.el)
        this.key = options.key
        this.text = options.text
        this.data = []
        this.map = {}
        this.realRemove = options.realRemove
      },
      load: function(data){
        if(!data) return
        this.data = data
        this.map = _.indexBy(this.data, this.key)
        var itemArr = [],
            key = this.key,
            itemHtml
        _.each(data, function(item){
          itemHtml = format(itemTpl, {
            key: item[key]
          })
          itemArr.push(itemHtml)
        })
        this.el.find(".esys-transfer-bd").html(itemArr.join(''))
        console.log(this.data);
      },
      add: function(data){
        // tofix: 这里的this.data变成空了？
        var key = this.key,
            code
        _.each(data, function(item){
          this.data.push(item)
          code = item[key]
          if(this.map[code]){
            this.map[code].remove = false
            console.log("yes map");
          }else{
            console.log("no map");
            this.map[code] = item
          }
          var $item = this.el.find('input[value='+ code +']').parents('.form_checkbox')
          if($item.length){
            $item.removeClass('hide pre-remove')
          }else{
            var itemHtml = format(itemTpl,{
              key: item[key]
            })
            this.el.find(".esys-transfer-bd").append(itemHtml)
          }
        }, this)
        if(data && data.length){
          // this.data = _.uniq(this.data, this.key)
        }
      },
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
            $item.add("pre-remove").find('input[type=checkbox]').prop("checked",false)
          }
        },this)
      },

      // 选中的项
      getSelections: function(){
        var selections = [],
            _this = this,
            items = this.el.find('.form_checkbox:not(.pre-remove) input[type=checkbox]:checked')
        items.each(function(){
          selections.push(_this.map[$(this).val()])
        }, this)
        return selections
      }
    }

    module.exports = Transfer;
});
