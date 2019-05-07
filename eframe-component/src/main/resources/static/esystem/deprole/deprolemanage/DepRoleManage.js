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
            button: 'add1',
            search: true,
            clickable: true, // 是否可点击
            deletable: true, // 是否可删除
          },
          events: {
            click: function(data){
              // 判断前后两个点击是否一致，返回change标志
              var change = _this.role && _.isEqual(_this.role, data) ? false : true
              _this.role = data
              Observer.trigger("deprole:click", data, change)
            },
            delete: function(data){
              console.log("delete");
            }
          }
        })
        this.roleList.render()
    }

    // 角色信息
    DepRoleManage.prototype._createRoleInfo = function() {
      this.roleInfo = new RoleInfo({
        el: "#roleright_content"
      })
      this.roleInfo.render()
    }


    module.exports = DepRoleManage;
});
