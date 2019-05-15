define(function(require, exports, module) {
    var _ = require('lodash'),
        $ = require('jquery'),
        FormHelper = require('shine-form'),
        Observer = require('observer');

    var tpl = require('./template/RoleInfoTab.html')
    var RoleInfo = function(options) {
        this.initialize(options);
    };

    RoleInfo.prototype = {
        initialize: function(options) {
            this.el = $(options.el)
            this.role = options.role;
        },
        render: function() {
            this.el.html(tpl);
            this._bindEvents()
        }
    };

    // 保存信息
    RoleInfo.prototype._saveRoleInfo = function(){
      var data = FormHelper.getValue('#roleInfoForm')
      data.roleId = this.role.roleId // 对象的key添加roleId
      Observer.trigger("DepRole:updateItem", data)
    }
    // 绑定事件
    RoleInfo.prototype._bindEvents = function(){
      var _this = this
      // 监听datalist数据项的点击事件，触发在datalist实例的events{click}中
      Observer.on("deprole:click", function(data, change){
        if(change){
          _this.role = data
          FormHelper.setValue('#roleInfoForm', data, true);
        }
      })

      // 保存角色信息
      this.el.find(".btn-save").bind("click", function(){
        _this._saveRoleInfo()
      })
    }

    module.exports = RoleInfo;
});
