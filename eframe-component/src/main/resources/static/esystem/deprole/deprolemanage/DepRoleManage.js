define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('lodash'),
        Observer = require('observer'),
        RoleInfo = require('/esystem/deprole/deprolemanage/child/RoleInfoTab'),
        DataList = require('/component/datalist/DataList');



    //模板引入
    var mainTpl = require('./template/main.html');


    var DepRoleManage = function (options) {
        this.initialize(options);
    };
    DepRoleManage.prototype = {
        initialize: function (options) {
            this.el = options.el;
        },
        render: function () {
          $(this.el).html(mainTpl);
          this._createRoleList()
          this._createRoleInfo()
          this.bindEvents()
        },
        dispose: function () {
        },
        refresh: function () {
        }
    };
    // 角色列表
    DepRoleManage.prototype._createRoleList = function() {
        var _this = this
        this.roleList = new DataList({
          el: "#role_side_list",
          data: {
            title: '部门角色',
            url: '/role',
            key: 'roleId',
            text: 'roleName',
            button: 'add',
            search: true,
            clickable: true, // 是否可点击
            deletable: true, // 是否可删除
          },
          events: {
            click: function(data){
              // 判断前后两个点击是否一致，返回change标志
              var change = _this.role && _.isEqual(_this.role, data) ? false : true
              _this.role = data // this.role用来设置RoleInfo中的role
              Observer.trigger("deprole:click", data, change)
            },
            delete: function(data){
              console.log("delete");
            }
          }
        })
        this.roleList.render()
    }

    // 事件监听
    DepRoleManage.prototype.bindEvents = function() {
      var _this = this
      // 由RoleInfoTab.js触发Observer.trigger
      Observer.on("DepRole:updateItem", function(data){
        _this.roleList.updateItem(data)
      })
    }

    // 角色信息
    DepRoleManage.prototype._createRoleInfo = function() {
      var _this = this
      this.roleInfo = new RoleInfo({
        el: "#roleright_content",
        role: _this.role
      })
      this.roleInfo.render()
    }


    module.exports = DepRoleManage;
});
