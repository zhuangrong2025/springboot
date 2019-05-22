define(function (require, exports, module) {
  var $ = require('jquery'),
      _ = require('lodash'),
      Observer = require('observer'),
      Step = require('/component/step/Step');

    //模板引入
    var mainTpl = require('./template/DepRoleAdd.html');

    var DepRoleAdd = function (options) {
        this.initialize(options);
    };
    DepRoleAdd.prototype = {
        initialize: function (options) {
            this.el = options.el;
            //this.dep_id = options.dep_id;
        },
        render: function () {
            $(this.el).html(mainTpl);
            this._renderStep();
        },
        dispose: function () {
        },
        refresh: function () {
        }
    };
    //创建步骤面板
    DepRoleAdd.prototype._renderStep = function() {
        this.step = new Step({
            el: '#dep_role_step',
            url: '/EPSERVICERUN/json/USAccess/json.do?service=epframe.epbos_deptRoleService.saveDepRoleUnited',//post保存地址,
            buttons: ['cancel', 'prev', {type: 'presave', title: '保存并退出', scope: [0, 1]}, 'next', 'save'],
            items: [{
                name : 'role',
                title: '基础信息',
                url: '/esystem/deprole/deprolemanage/child/RoleInfoStep'
            }],
            events: {
                exit: function(action) {
                    var cov = window.XyzCoverlap && window.XyzCoverlap['dep_role_add_cover'];
                    if(cov) {
                        if(action === 'save') {
                            Observer.trigger('DepRole:refresh');//通知父级页面信息更新成功
                        }
                        cov.dispose();
                    }
                }
            }
        });
        this.step.render();

    };


    module.exports = DepRoleAdd;
});
