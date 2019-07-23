define("#/base-common-module/0.1.30/base-common-module-debug", [ "./ie8-debug", "#/observer/observer-debug", "#/jquery/jquery-debug", "#/xyz-component-base/xyz-component-base-debug", "#/xyz-storage/xyz-storage-debug", "#/base-style-manage/base-style-manage-debug", "#/json2/json2-debug", "#/xyz-iconfont/xyz-iconfont-debug", "./renderCss-debug", "./app-context-debug" ], function(require, exports, module, installOption) {
    require("./ie8-debug");
    var observer = require("#/observer/observer-debug"), $ = require("#/jquery/jquery-debug"), ComponentBase = require("#/xyz-component-base/xyz-component-base-debug"), storage = require("#/xyz-storage/xyz-storage-debug"), baseStyleManage = require("#/base-style-manage/base-style-manage-debug");
    require("#/json2/json2-debug");
    require("#/xyz-iconfont/xyz-iconfont-debug");
    var moduleGlobal = window.ModulesGlobal;
    if (moduleGlobal !== undefined) {
        return;
    }
    require("./renderCss-debug");
    var THEME_KEY = "global_theme", curTheme = storage.getSessItem(THEME_KEY);
    if (!curTheme) {
        curTheme = "darkblue";
    }
    null;
    var metaTpl = '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">';
    var main = function() {
        $("head").prepend(metaTpl);
        //拼接通用meta
        baseStyleManage.changeStyle(curTheme);
        var styleVersion = seajs && seajs.pluginSDK && seajs.pluginSDK.config && seajs.pluginSDK.config.style_version;
        if (styleVersion) {
            $("body").addClass("base_style_manage_style_v" + styleVersion);
        }
    };
    //皮肤切换
    exports.changeStyle = function(style) {
        baseStyleManage.changeStyle(style);
    };
    var per = require("./app-context-debug");
    $.extend(exports, per, ComponentBase);
    main();
    window.ModulesGlobal = {
        Observer: observer,
        BaseCommonModule: exports
    };
}, {});

define("#/base-common-module/0.1.30/ie8-debug", [], function(require, exports, module, installOption) {
    var origDefineProperty = Object.defineProperty;
    var arePropertyDescriptorsSupported = function() {
        var obj = {};
        try {
            origDefineProperty(obj, "x", {
                enumerable: false,
                value: obj
            });
            for (var _ in obj) {
                return false;
            }
            return obj.x === obj;
        } catch (e) {
            /* this is IE 8. */
            return false;
        }
    };
    var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();
    if (!supportsDescriptors) {
        Object.defineProperty = function(a, b, c) {
            //IE8支持修改元素节点的属性
            if (origDefineProperty && a.nodeType === 1) {
                return origDefineProperty(a, b, c);
            } else {
                a[b] = c.value || c.get && c.get();
            }
        };
    }
}, {});

define("#/base-common-module/0.1.30/renderCss-debug", [ "#/lodash/lodash-debug" ], function(require, exports, module, installOption) {
    var _ = require("#/lodash/lodash-debug");
    var createCss = function(path) {
        var doc = document;
        var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
        var style = doc.createElement("link");
        var headerAfter = doc.getElementsByTagName("title")[0];
        if (!headerAfter) {
            throw "当前页面缺少title标签!";
        }
        style.href = path;
        style.rel = "stylesheet";
        style.type = "text/css";
        head.insertBefore(style, headerAfter);
    };
    var basecssList = seajs && seajs.pluginSDK && seajs.pluginSDK.config && seajs.pluginSDK.config.basecss_list;
    if (_.isArray(basecssList)) {
        var basePath = location.href;
        var releaseIndex = basePath.indexOf("/release/");
        if (releaseIndex !== -1) {
            var cssRealPath = basePath.substring(0, releaseIndex) + "/css/";
            _.each(basecssList, function(cssFile) {
                var _path = cssRealPath + cssFile;
                createCss(_path);
            });
        }
    }
}, {});

define("#/base-common-module/0.1.30/app-context-debug", [ "#/jquery/jquery-debug", "#/lodash/lodash-debug", "#/xyz-alert/xyz-alert-debug", "#/xyz-util/xyz-util-debug", "#/xyz-storage/xyz-storage-debug", "#/xyz-jsonRPC/xyz-jsonRPC-debug" ], function(require, exports, module, installOption) {
    var $ = require("#/jquery/jquery-debug"), _ = require("#/lodash/lodash-debug"), xyzAlert = require("#/xyz-alert/xyz-alert-debug"), xyzUtil = require("#/xyz-util/xyz-util-debug"), storage = require("#/xyz-storage/xyz-storage-debug");
    require("#/xyz-jsonRPC/xyz-jsonRPC-debug")($);
    var permisAttr = "sth-as", //权限元素约定属性名
    loginKey = "login", //登录信息，与权限的配置信息， 缓存到sessionStorage中的login属性
    menuKey = "active_menu", //当前选中菜单信息， 缓存到sessionStorage中的active_menu属性
    urlPathKey = "url_path";
    //各页面url的路径， 缓存到sessionStorage中的url_path属性
    //权限监听事件
    var eventName = "DOMNodeInserted.base_common_module";
    $(window).unbind(eventName).bind(eventName, function(e) {
        var tar = e.target;
        if (tar) {
            var targetDom = $(tar);
            if (targetDom.length > 0) {
                if (targetDom.attr(permisAttr)) {
                    confirmPermission(targetDom);
                }
                var childPerDom = targetDom.find("[" + permisAttr + "]");
                $.each(childPerDom, function(k, dom) {
                    confirmPermission($(dom));
                });
            }
        }
    });
    //判断容器是否有权限
    var confirmPermission = function(dom) {
        var domId = dom.attr(permisAttr);
        var controlPer = getAppContext("control_permission") || [];
        var activeObj = getActiveMenu();
        if (!activeObj) {
            return;
        }
        //未选中菜单，不进行权限判断
        var menu_code = activeObj.menu_code;
        var func_code = activeObj.func_code;
        var findObj = _.find(controlPer, function(cpObj) {
            return cpObj.menu_code === menu_code && cpObj.func_code === func_code;
        });
        if (findObj) {
            var exclude = findObj.exclude || [];
            if (_.find(exclude, function(ename) {
                return ename === domId;
            })) {
                //无权限访问
                dom.addClass("base_no_permission");
            }
        }
    };
    //session异常，重定向到登录页
    var redirectToLogin = function() {
        var redirect_url = getUrlPath("login_url");
        if (!window.xyzJsonRPCDebug) {
            window.location.href = redirect_url;
        }
    };
    //绑定全局异常
    var catchGlobalError = function(cb) {
        try {
            return cb();
        } catch (e) {
            redirectToLogin();
        }
    };
    var getAppContext = exports.getAppContext = function(key, debug) {
        var loginObj = storage.getSessItem(loginKey);
        if (!loginObj) {
            //如果被用户手动清楚缓存， 重定向到根路径
            if (!window.xyzJsonRPCDebug && !debug) {
                xyzAlert.warn("本次会话已超时,请重新登录!", {
                    confirm: function() {
                        xyzUtil.redirectToLogin();
                    }
                });
            }
            return;
        }
        if (key) {
            var keyArr = key.split(".");
            var backObj;
            for (var i = 0, len = keyArr.length; i < len; i++) {
                var _k = keyArr[i];
                if (backObj) {
                    if (!backObj[_k]) {
                        return null;
                    } else {
                        backObj = backObj[_k];
                    }
                } else {
                    backObj = loginObj[_k];
                }
            }
            return backObj || null;
        }
        return loginObj;
    };
    //获取登录用户信息
    var getUser = exports.getUser = function() {
        return getAppContext("user");
    }, //获取上下文信息
    getContext = exports.getContext = function() {
        return getAppContext("context");
    }, //当前应用ID
    getCurrentAppId = exports.getCurrentAppId = function() {
        var activeMenu = getActiveMenu();
        if (activeMenu) {
            if (activeMenu.orig_app_id !== null) {
                return activeMenu.orig_app_id;
            }
            if (activeMenu.app_id !== null) {
                return activeMenu.app_id;
            }
        } else {
            var context = getContext();
            return context && !_.isUndefined(context.app_id) ? context.app_id : null;
        }
    };
    var getActiveMenu = exports.getActiveMenu = function() {
        return catchGlobalError(function() {
            var actMenuObj = storage.getSessItem(menuKey);
            return actMenuObj;
        });
    };
    exports.setActiveMenu = function(menu) {
        storage.setSessItem(menuKey, {
            menu_code: menu.menu_code,
            func_code: menu.func_code,
            app_id: _.isUndefined(menu.app_id) ? null : menu.app_id,
            orig_app_id: _.isUndefined(menu.orig_app_id) ? null : menu.orig_app_id
        });
    };
    // 数据结构: [{  "url_name":"login_url", "url_value":"/cas"}]
    var getUrlPath = exports.getUrlPath = function(key) {
        var urlParhCache = storage.getSessItem(urlPathKey);
        var appId = getContext().app_id;
        if (!urlParhCache) {
            $.jsonRPC.request({
                async: false,
                url: "/EPSERVICERUN/json/USAccess/json.do?service=esystem.epbos_sessionService.getAppUrlInfo",
                params: {
                    params: {
                        app_id: appId
                    }
                },
                success: function(response) {
                    urlParhCache = response.data;
                    storage.setSessItem(urlPathKey, urlParhCache);
                }
            });
        }
        if (key) {
            var keyObj = _.find(urlParhCache, function(upcObj) {
                return upcObj.url_name === key;
            });
            if (keyObj) {
                return keyObj.url_value;
            }
            return null;
        }
        return urlParhCache;
    };
}, {});