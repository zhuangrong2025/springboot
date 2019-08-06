define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('lodash'),
        baseCommon = require('base-common-module'),
        observer = require('observer'),
        storage = require('xyz-storage'),
        IndexScene = require('./IndexScene'),
        IndexToolBar = require('./IndexToolBar'),
        IndexFavorite = require('./IndexFavorite'),
        IndexMenu = require('./IndexMenu');


    require('xyz-iconfont');
    require('font-Awesome');

    //扩展方法：防止原有data方法自动类型转换
    $.fn.dataString || ($.fn.dataString = function(dataKey) {
        return '' + $(this).data(dataKey);
    });

    var maxReg = /.*?(?:\?|&)maximize=1(&)*/g; //菜单最大化参数正则表达式
    // 模拟菜单数据
var  menuData = [{"parent_menu_code":"00000000","order_code":"010000","show_num":10,"menu_name":"系统管理","deploy_name":"EPWEBRUN","menu_level":1,"menu_code":"50021002","func_code":"00010000","app_id":0},{"parent_menu_code":"00000000","order_code":"020000","show_num":10,"menu_name":"系统管理2","deploy_name":"EPWEBRUN","menu_level":1,"menu_code":"50021003","func_code":"00020000","app_id":0},{"parent_menu_code":"50022003","order_code":"010100","show_num":10,"menu_name":"部门管理","deploy_name":"EPWEBRUN","menu_level":3,"menu_code":"50023005","func_code":"00010100","app_id":0},{"parent_menu_code":"50021003","order_code":"010210","show_num":10,"menu_name":"系统2","deploy_name":"EPWEBRUN","menu_level":3,"menu_code":"50022005","func_code":"00010500","app_id":0},{"parent_menu_code":"50023005","order_code":"010101","show_num":10,"menu_name":"部门信息维护","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024001","func_path":"index/pages/DepManage.html","func_code":"00010101","app_id":0},{"parent_menu_code":"50023005","order_code":"010200","show_num":10,"menu_name":"部门权限管理","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024002","func_code":"00010200","app_id":0},{"parent_menu_code":"50023005","order_code":"010201","show_num":10,"menu_name":"部门角色维护","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024003","func_path":"epframe/release/esystem/deprole/deprolemanage/DepRoleManage.html","func_code":"00010201","app_id":0},{"parent_menu_code":"50022003","order_code":"010300","show_num":10,"menu_name":"用户管理","deploy_name":"EPWEBRUN","menu_level":3,"menu_code":"50023006","func_code":"00010300","app_id":0},{"parent_menu_code":"50023006","order_code":"010301","show_num":10,"menu_name":"用户信息维护","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024004","func_path":"epframe/release/esystem/user/usermanage/UserManage.html","func_code":"00010301","app_id":0},{"parent_menu_code":"50023006","order_code":"010400","show_num":10,"menu_name":"用户权限管理","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024005","func_code":"00010400","app_id":0},{"parent_menu_code":"50023006","order_code":"010401","show_num":10,"menu_name":"用户角色维护","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024006","func_path":"epframe/release/esystem/userrole/userrolemanage/UserRoleManage.html","func_code":"00010401","app_id":0},{"parent_menu_code":"50022003","order_code":"010800","show_num":10,"menu_name":"审计","deploy_name":"EPWEBRUN","menu_level":3,"menu_code":"50023007","func_code":"00010800","app_id":0},{"parent_menu_code":"50023007","order_code":"010801","show_num":10,"menu_name":"登录退出日志查询","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024007","func_path":"epframe/release/esystem/log/uservisitlog/UserVisitLog.html","func_code":"00010801","app_id":0},{"parent_menu_code":"50023007","order_code":"010802","show_num":10,"menu_name":"操作日志查询","deploy_name":"EPWEBRUN","menu_level":4,"menu_code":"50024008","func_path":"epframe/release/esystem/log/oploginfo/OpLogInfo.html","func_code":"00010802","app_id":0},{"parent_menu_code":"50021002","order_code":"200010","show_num":10,"menu_name":"用户信息管理","deploy_name":"EPWEBRUN","menu_level":2,"menu_code":"50022003","func_code":"50022003","app_id":0},{"parent_menu_code":"50021002","order_code":"200020","show_num":10,"menu_name":"用户信息管理2","deploy_name":"EPWEBRUN","menu_level":2,"menu_code":"50022001","func_code":"50022001","app_id":0}];

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
        var isDefaultApp = true; //是否为默认的系统

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
                clickTopMenu: function(menuCode) { //通过顶部点击trigger，收藏夹，会触发两次
                    var favIcon = jdom.header_tool.find('.favorite a i.fa-star')
                    favIcon.trigger('click');
                    if (_this.jdom.index.hasClass('index_collapse')) {
                        _this.jdom.header_logo.find('div.submenu_toggler').trigger('click');
                    }
                }
            }
        });

        //create indexScene
        this.indexScene = new IndexScene({
            el: '#scene',
            main: this,
            events: {
                changeScene: function(code, menu, options) {
                    var custMap = _this.indexScene.getCustData();
                    if(custMap[code]) {//自定义菜单
                        if(maxReg.test(custMap[code].url)) {//最大化
                            _this._collapseSideMenu(); //最大化页面
                        }
                    }
                    _this._configActiveMenu(menu);
                    _this.indexMenu.setActiveCode(code, (null === options || true !== options.fromMenu) ? true : false);
                }
            }
        }).render();

        //create indexToolBar
        this.indexToolBar = new IndexToolBar({
            el: '#headerToolbar',
            main: this, //首页主模块
            isContainer: isDefaultApp,
            events: {
                openCustomedTab: function(tabCode, tabName, tabUrl) {
                    _this.indexScene.openCustomedTab(tabCode, tabName, tabUrl);
                },
                openMenuTab: function(menuCode) {
                    _this.indexScene.openMenuTab(menuCode);
                },
                changeTheme: function(theme) {
                    storage.setSessItem('global_theme', theme);
                    _this.indexScene.changeTheme(theme);
                }
            }
        }).render();

        // 打开收藏夹
        this.indexFavorite = new IndexFavorite({
            main: this,
            events: {
                openMenuTab : function(menuCode) {
                    _this.indexScene.openMenuTab(menuCode);
                }
            }
        });
        this.indexFavorite.render();

        // 渲染menu --> 原文件-在_loadAppMenus
        _this._processMenuData(menuData)
        console.log(_this._CACHE.MENU);
        _this.indexMenu.setMenuData(_this._CACHE.MENU, true);
        _this.indexScene.setMenuData(_this._CACHE.MENU);
        var loginInfo = {
            context: {
              "app_id": "0"
            },
            control_permission: [{
                "menu_code": "00010000",
                "exclude": [],
                "func_code": "00010000"
              },
              {
                "menu_code": "00010100",
                "exclude": [],
                "func_code": "00010100"
              },
              {
                "menu_code": "00010101",
                "exclude": [],
                "func_code": "00010101"
              },
              {
                "menu_code": "00010200",
                "exclude": [],
                "func_code": "00010200"
              },
              {
                "menu_code": "00010201",
                "exclude": [],
                "func_code": "00010201"
              },
              {
                "menu_code": "00010300",
                "exclude": [],
                "func_code": "00010300"
              },
              {
                "menu_code": "00010301",
                "exclude": [],
                "func_code": "00010301"
              },
              {
                "menu_code": "00010400",
                "exclude": [],
                "func_code": "00010400"
              },
              {
                "menu_code": "00010401",
                "exclude": [],
                "func_code": "00010401"
              },
              {
                "menu_code": "00010500",
                "exclude": [],
                "func_code": "00010500"
              },
              {
                "menu_code": "00010501",
                "exclude": [],
                "func_code": "00010501"
              },
              {
                "menu_code": "00010600",
                "exclude": [],
                "func_code": "00010600"
              },
              {
                "menu_code": "00010601",
                "exclude": [],
                "func_code": "00010601"
              },
              {
                "menu_code": "00010800",
                "exclude": [],
                "func_code": "00010800"
              },
              {
                "menu_code": "00010801",
                "exclude": [],
                "func_code": "00010801"
              },
              {
                "menu_code": "00010802",
                "exclude": [],
                "func_code": "00010802"
              },
              {
                "menu_code": "00020000",
                "exclude": [],
                "func_code": "00020000"
              },
              {
                "menu_code": "00020100",
                "exclude": [],
                "func_code": "00020100"
              },
              {
                "menu_code": "00020101",
                "exclude": [],
                "func_code": "00020101"
              },
              {
                "menu_code": "00020102",
                "exclude": [],
                "func_code": "00020102"
              },
              {
                "menu_code": "00020103",
                "exclude": [],
                "func_code": "00020103"
              },
              {
                "menu_code": "00020104",
                "exclude": [],
                "func_code": "00020104"
              },
              {
                "menu_code": "00020105",
                "exclude": [],
                "func_code": "00020105"
              }
            ],
            user:{
              "user_group": "1",
              "dep_id": "1000",
              "user_code": "ADMIN",
              "user_name": "管理员",
              "is_update_pwd": "0",
              "dep_name": "总部",
              "dep_code": "#000000001",
              "user_theme": "blue"
            }
        };
        _this._CACHE.USER = loginInfo;
        _this.indexToolBar.setUserData(_this._CACHE.USER);
        // 触发loadMenu事件，传递this._CACHE.MENU,到收藏
        observer.trigger('loadMenu', _this._CACHE.MENU)





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


    //设置活动菜单
    Index.prototype._configActiveMenu = function(menuInfo) {
        var _this = this,
            activeMenu = null;
        if (undefined === menuInfo || null === menuInfo) {
            activeMenu = {
                menu_code: null,
                func_code: null,
                app_id: this.curAppId,
                orig_app_id: null
            };
        } else {
            activeMenu = {
                menu_code: menuInfo.menu_code,
                func_code: menuInfo.func_code,
                app_id: _.isUndefined(menuInfo.app_id) ? this.curAppId : menuInfo.app_id,
                orig_app_id: _.isUndefined(menuInfo.orig_app_id) ? null : menuInfo.orig_app_id
            };

        }
        baseCommon.setActiveMenu(activeMenu);
        this._saveLocalData('activeMenu', activeMenu); //保存当前页面打开菜单
        // menuInfo && this.indexHistory.recordLastHistoricMenu(menuInfo.menu_code); // 暂时隐藏 ^^
    };

    //折叠左侧菜单，页面最大化
    Index.prototype._collapseSideMenu = function() {
        this.jdom.index.addClass('index_collapse');
        this._adjustPanelSize();
    };

    Index.prototype._saveLocalData = function(key, data) {
        if (!this.localData) {
            this.localData = {};
        }
        this.localData[key] = data;
    };


    //获取全局数据
    Index.prototype.getGlobalData = function() {
        var user = {
            dep_code: "",
            dep_id: "",
            dep_name: "",
            is_update_pwd: "",
            user_code: "",
            user_group: "",
            user_name: "",
            user_theme: ""
        };
        if(this._CACHE.USER && this._CACHE.USER.user) {
            user = this._CACHE.USER.user;
        }
        return {
            menu: this._CACHE.MENU,
            user: user,
            appId: this.curAppId
        }
    }
    //-----------------------

    //绑定页面事件
    Index.prototype._bindEvent = function() {
        var _this = this;

    };

    module.exports = Index;
});
