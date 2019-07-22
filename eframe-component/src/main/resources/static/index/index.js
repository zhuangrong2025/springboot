define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('lodash'),
        IndexMenu = require('./IndexMenu');


    require('xyz-iconfont');
    require('font-Awesome');

    var  menuData = [{"parent_menu_code":"00000000","order_code":"010000","show_num":10,"menu_name":"系统管理","deploy_name":"EPWEBRUN","menu_level":1,"menu_code":"50021002","func_code":"00010000","app_id":0},{"parent_menu_code":"00000000","order_code":"020000","show_num":10,"menu_name":"系统管理2","deploy_name":"EPWEBRUN","menu_level":1,"menu_code":"50021003","func_code":"00020000","app_id":0},{"parent_menu_code":"50022003","order_code":"010100","show_num":10,"menu_name":"部门管理","deploy_name":"EPWEBRUN","menu_level":3,"menu_code":"50023005","func_code":"00010100","app_id":0},{"parent_menu_code":"50023005","order_code":"010101","show_num":10,"menu_name":"部门信息维护","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024001","func_path":"epframe/release/esystem/department/depmanage/DepManage.html","func_code":"00010101","app_id":0},{"parent_menu_code":"50023005","order_code":"010200","show_num":10,"menu_name":"部门权限管理","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024002","func_code":"00010200","app_id":0},{"parent_menu_code":"50023005","order_code":"010201","show_num":10,"menu_name":"部门角色维护","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024003","func_path":"epframe/release/esystem/deprole/deprolemanage/DepRoleManage.html","func_code":"00010201","app_id":0},{"parent_menu_code":"50022003","order_code":"010300","show_num":10,"menu_name":"用户管理","deploy_name":"EPWEBRUN","menu_level":3,"menu_code":"50023006","func_code":"00010300","app_id":0},{"parent_menu_code":"50023006","order_code":"010301","show_num":10,"menu_name":"用户信息维护","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024004","func_path":"epframe/release/esystem/user/usermanage/UserManage.html","func_code":"00010301","app_id":0},{"parent_menu_code":"50023006","order_code":"010400","show_num":10,"menu_name":"用户权限管理","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024005","func_code":"00010400","app_id":0},{"parent_menu_code":"50023006","order_code":"010401","show_num":10,"menu_name":"用户角色维护","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024006","func_path":"epframe/release/esystem/userrole/userrolemanage/UserRoleManage.html","func_code":"00010401","app_id":0},{"parent_menu_code":"50022003","order_code":"010800","show_num":10,"menu_name":"审计","deploy_name":"EPWEBRUN","menu_level":3,"menu_code":"50023007","func_code":"00010800","app_id":0},{"parent_menu_code":"50023007","order_code":"010801","show_num":10,"menu_name":"登录退出日志查询","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024007","func_path":"epframe/release/esystem/log/uservisitlog/UserVisitLog.html","func_code":"00010801","app_id":0},{"parent_menu_code":"50023007","order_code":"010802","show_num":10,"menu_name":"操作日志查询","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024008","func_path":"epframe/release/esystem/log/oploginfo/OpLogInfo.html","func_code":"00010802","app_id":0},{"parent_menu_code":"50021002","order_code":"200010","show_num":10,"menu_name":"用户信息管理","deploy_name":"EPWEBRUN","menu_level":2,"menu_code":"50022003","func_code":"50022003","app_id":0},{"parent_menu_code": "50021002","order_code": "200020","show_num": 10,"menu_name": "用户信息管理2","deploy_name": "EPWEBRUN","menu_level": 2,"menu_code": "50022001","func_code": "50022001","app_id": 0}];


    //模板引入
    var mainTpl = require('./template/IndexMain.html');


    function Index(options) {
        this.initialize(options);
    };

    Index.prototype = {
        initialize: function(options) {
            this.el = $(options.el);
            this.jdom = {};
            this._CACHE = {};
            this.appId;
        },
        render: function() {
            var _this = this;
            this.el.html(mainTpl);
            this._beforeInit();

        }
    };


    //_beforeInit
    Index.prototype._beforeInit = function() {
        var _this = this;
        _this._init();
    };

    //初始化
    Index.prototype._init = function() {
        var _this = this,
            jdom = this.jdom;


        //create indexMenu
        this.indexMenu = new IndexMenu({
            el_header: '#headerMenu',
            el_broadside: '#broadsideMenu',
            events: {
                changeMenu: function(menuCode) {
                    var menuInfo = _this._CACHE.MENU.hashMap[menuCode];
                    if (menuInfo && menuInfo.func_path && maxReg.test(menuInfo.func_path)) {
                        _this._collapseSideMenu(); //最大化页面
                    }
                    _this.indexScene.openMenuTab(menuCode, { fromMenu: true });
                },
                clickTopMenu: function(menuCode) {
                    var favIcon = jdom.header_tool.find('.favorite a i')
                    favIcon.trigger('click');
                    if (_this.jdom.index.hasClass('index_collapse')) {
                        _this.jdom.header_logo.find('div.submenu_toggler').trigger('click');
                    }
                }
            }
        });


        // 渲染menu --> 原文件-在_loadAppMenus
        _this._processMenuData(menuData)
        _this.indexMenu.setMenuData(_this._CACHE.MENU, true);





        //global jquery element reference
        jdom.index = $('#index_wrapper');
        //header zone
        jdom.header = jdom.index.find('>div.index_header');
        jdom.header_logo = jdom.header.find('>div.index_header_logo');
        jdom.header_menu = jdom.header.find('>div.index_header_menu');
        jdom.header_tool = jdom.header.find('>div.index_header_tool');
        //container zone
        jdom.container = jdom.index.find('>div.index_container');
        //broadside zone
        jdom.broadside_wrapper = jdom.container.find('>div.index_broadside_wrapper');
        //content zone
        jdom.content_wrapper = jdom.container.find('>div.index_content_wrapper');
        jdom.content_tabs = jdom.content_wrapper.find('>div.content_tabs');

        this._bindEvent();
    };


    //-----------------------

    //菜单数据预处理
    Index.prototype._processMenuData = function(menuData) {
        var _this = this,
            hashMap = {},
            menuArr = [];
        if ($.isArray(menuData) && menuData.length > 0) {
            var i, l, code, parentCode,
                key = 'menu_code',
                parentKey = 'parent_menu_code';
            if (!key || key == "" || !menuData)
                return [];
            for (i = 0, l = menuData.length; i < l; i++) {
                hashMap[menuData[i][key]] = menuData[i];
            }
            for (i = 0, l = menuData.length; i < l; i++) {
                code = menuData[i][key];
                parentCode = menuData[i][parentKey];
                if (hashMap[parentCode] && code != parentCode) { //有父节点的情况
                    if (!hashMap[parentCode].childArr) {
                        hashMap[parentCode].childArr = [];
                    }
                    menuData[i].parentNd = hashMap[parentCode]; //父节点
                    hashMap[parentCode].childArr.push(menuData[i]);
                } else {
                    menuArr.push(menuData[i]);
                }
            }
            //表菜单按菜单排序码排序
            menuArr.sort(sortMenuData);
            //递归设置一级菜单的层级数
            function getChildLevel(pNode) {
                var totallevel = 0;
                var children = pNode.childArr;
                if (children && children.length) {
                    totallevel++;
                    var levarr = [];
                    for (var i = 0, len = children.length; i < len; i++) {
                        levarr[i] = getChildLevel(children[i]);
                    }
                    totallevel += _.max(levarr);
                    children.sort(sortMenuData);
                }
                return totallevel;
            }
            //菜单排序方法
            function sortMenuData(a, b) {
                if (a.order_code < b.order_code) {
                    return -1;
                } else if (a.order_code == b.order_code) {
                    return 0;
                } else {
                    return 1;
                }
            }
            //计算菜单层级, 以下子菜单按菜单排序码排序
            for (var i = 0, l = menuArr.length; i < l; i++) {
                menuArr[i].$totallevel = getChildLevel(menuArr[i]) + 1;
            }
        }

        _this._CACHE.MENU = {
            hashMap: hashMap,
            menuArr: menuArr
        };
    };








    //-----------------------

    //绑定页面事件
    Index.prototype._bindEvent = function() {
        var _this = this;

    };

    module.exports = Index;
});
