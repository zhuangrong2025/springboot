define("#/xyz-jsonRPC/0.1.39/xyz-jsonRPC-debug", [ "#/lodash/lodash-debug", "#/stringformat/stringformat-debug", "#/xyz-alert/xyz-alert-debug", "#/xyz-util/xyz-util-debug", "#/xyz-cryptojs/xyz-cryptojs-debug" ], function(require, exports, module, installOption) {
    var _ = require("#/lodash/lodash-debug"), format = require("#/stringformat/stringformat-debug"), xyzAlert = require("#/xyz-alert/xyz-alert-debug"), xyzUtil = require("#/xyz-util/xyz-util-debug"), xyzCry = require("#/xyz-cryptojs/xyz-cryptojs-debug");
    var XyzJsonRPC = {}, $;
    var cacheKey = "xyz-jsonRPC";
    var cacheConfigKey = "xyz-jsonRPC-config";
    window.xyzJsonRPCHost = "";
    //全局的url host，外部可通过调用setHost方法， 指定全局的host，方便开发调试
    window.xyzJsonRPCDebug = false;
    //全局debug模式，url统一将   USAccess  ==> TestUSAccess
    window.xyzJsonRPCMock = false;
    var configBase = "/";
    //全局配置文件的根路径
    //设置全局host
    XyzJsonRPC.setHost = function(url) {
        window.xyzJsonRPCHost = url;
    };
    //设置全局debug
    XyzJsonRPC.setDebug = function(bool) {
        window.xyzJsonRPCDebug = bool;
    };
    //设置全局mock
    XyzJsonRPC.setMock = function(bool) {
        window.xyzJsonRPCMock = bool;
    };
    //设置配置文件根路径
    XyzJsonRPC.setConfigBase = function(url) {
        configBase = url;
    };
    /*
url: 接口地址
params: 接口参数
success: 请求成功回调函数
error: 请求失败回调函数
 */
    XyzJsonRPC.request = function(options, args) {
        var methodUrl = options.url;
        if (_.isString(options)) {
            //兼容第一个参数传url的写法
            methodUrl = options;
            options = args || {};
            options.url = methodUrl;
        } else {
            methodUrl = options.url;
        }
        var params = options.params || {
            params: {}
        };
        //设置默认的params
        options.params = params;
        this._validateRequestUrl(methodUrl);
        this._validateRequestCallbacks(options.success, options.error);
        this._doRequest(methodUrl, params, options, options);
    };
    /*
key： 值名称
options:  {params: {}, ext: ''}
callback: 回调函数
 */
    //值的名称
    XyzJsonRPC.fetch = function(key, options, callback) {
        var dotIndex = key.indexOf(".");
        if (dotIndex === -1) {
            throw "缺少.号";
        }
        var fileBase = key.substring(0, dotIndex);
        var configId = key.substring(dotIndex + 1);
        var outParams = {};
        if (_.isFunction(options)) {
            //第二个参数可以直接传callback
            callback = options;
            options = {};
        } else {
            if (!options) {
                options = {};
            }
            if (options.params) {
                outParams = options.params;
            }
        }
        var that = this;
        this._getConfigObj(fileBase, options, function(err, json) {
            if (err) {
                throw format("获取配置文件出错: {0}", err.responseText);
            }
            var _ajax = json.ajax;
            var _aObj = _.find(_ajax, function(_a) {
                return _a.id === configId;
            });
            if (_aObj === undefined) {
                throw format("未找到id: {0}", configId);
            }
            var _url = _aObj.url;
            if (_url === undefined) {
                throw format("id为{0}的配置,缺少url属性", configId);
            }
            var fullParams = $.extend(true, _aObj.params, outParams);
            that._doRequest(_url, fullParams, {
                url: _url,
                params: fullParams,
                cache: _aObj.cache,
                cacheTime: _aObj.cacheTime,
                success: function(json, url) {
                    callback(null, json, url);
                },
                error: function(json, url) {
                    callback(json);
                }
            }, options);
        });
    };
    XyzJsonRPC.getPermissionAuth = function(options) {
        var menuMes = this._getMenuMessage(options);
        var stringAppend = menuMes.menuCode + "," + menuMes.funcCode + "," + menuMes.controlCode;
        return xyzCry.encryptByDESModeCBC(stringAppend);
    };
    XyzJsonRPC._getMenuMessage = function(options) {
        options = options || {};
        var menuCode = "999999999";
        var funcCode = "999999999";
        var controlCode = options.controlCode || "";
        var baseCom = window.ModulesGlobal && window.ModulesGlobal.BaseCommonModule;
        if (baseCom) {
            var actMenu = baseCom.getActiveMenu();
            if (actMenu) {
                menuCode = actMenu.menu_code;
                funcCode = actMenu.func_code;
            }
        }
        return {
            menuCode: menuCode,
            funcCode: funcCode,
            controlCode: controlCode
        };
    };
    XyzJsonRPC.getAuthObj = function(options) {
        var menuMes = this._getMenuMessage(options);
        var auth = this.getPermissionAuth(options);
        return {
            menuCode: menuMes.menuCode,
            auth: auth
        };
    };
    XyzJsonRPC._validateRequestUrl = function(url) {
        if (typeof url !== "string") {
            throw "url格式不正确";
        }
        return true;
    };
    XyzJsonRPC._validateRequestCallbacks = function(success, error) {
        if (success !== undefined && typeof success !== "function") {
            throw "success必须是个function";
        }
        if (error !== undefined && typeof error !== "function") {
            throw "error必须是个function";
        }
        return true;
    };
    XyzJsonRPC._doRequest = function(methodUrl, data, fOpt, sourceOpt) {
        var that = this;
        var hasCacheData = this._hasCache(methodUrl, fOpt);
        if (hasCacheData) {
            //直接从缓存获取
            this._requestSuccess(hasCacheData, fOpt, methodUrl);
        } else {
            this._doAjax(methodUrl, data, sourceOpt, function(json, url) {
                that._requestSuccess(json, fOpt, url, true);
            }, function(json, url) {
                that._requestError(json, fOpt, url);
            });
        }
    };
    XyzJsonRPC._doAjax = function(methodUrl, dataParams, options, success, error) {
        var tm = xyzCry.getTm();
        var exHeader = this._getExheader(tm);
        var url = xyzUtil.joinUrlParams(methodUrl, {
            tm: tm
        });
        var serviceUri = options.serviceUri || "";
        var authObj = this.getAuthObj(options);
        if (window.xyzJsonRPCDebug === true) {
            url = url.replace("USAccess", "TestUSAccess");
        }
        url = window.xyzJsonRPCHost + url;
        var ajaxOpt = {
            async: options.async === undefined ? true : options.async,
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            url: url,
            data: JSON.stringify(dataParams),
            processData: false,
            headers: {
                "Ex-h": exHeader,
                //服务端请求协议
                "Ex-Service-Uri": serviceUri,
                //服务资源定位
                PermissionAuthen: authObj.auth,
                //服务端权限验证
                MENU_CODE: authObj.menuCode
            },
            complete: options.complete,
            error: function(json) {
                if (error) {
                    error(json, url);
                }
            },
            success: function(json) {
                if (success) {
                    success(json, url);
                }
            }
        };
        if (window.xyzJsonRPCMock === true) {
            ajaxOpt.type = "get";
            var paramsObj = xyzUtil.getUrlParams(url);
            var service = paramsObj.service;
            var serviceArr = service.split(".");
            var sLen = serviceArr.length;
            var mappingUrl = [];
            if (url.indexOf("/table/") !== -1) {
                mappingUrl.push("/table");
            } else {
                mappingUrl.push("/json");
            }
            _.each(serviceArr, function(sStr, k) {
                if (k === sLen - 1) {
                    mappingUrl.push(sStr + ".json");
                } else {
                    mappingUrl.push(sStr);
                }
            });
            var mUrl = mappingUrl.join("/");
            var basePath = location.href;
            var releaseIndex = basePath.indexOf("/release/");
            if (releaseIndex !== -1) {
                mUrl = basePath.substring(0, releaseIndex) + "/mock" + mUrl;
            }
            ajaxOpt.url = mUrl;
            ajaxOpt.data = null;
        }
        $.ajax(ajaxOpt);
    };
    XyzJsonRPC._getExheader = function(tm) {
        var result = xyzCry.encryptByCsrf(tm);
        return result;
    };
    XyzJsonRPC._requestError = function(json, options, tmUrl) {
        var error = options.error;
        if (error !== undefined && typeof error === "function") {
            if (typeof json.responseText === "string") {
                try {
                    var errormsg = json.message;
                    var errorcode = json.errorCode;
                    if (_.isEmpty(errormsg)) {
                        errormsg = json.responseText;
                    }
                    if (_.isEmpty(errorcode)) {
                        errorcode = -1;
                    }
                    if (errormsg.indexOf("<!DOCTYPE HTML") !== -1) {
                        //新资管session超时重定向
                        try {
                            window.IndexSupport.AppInfo.logout();
                        } catch (e) {
                            top.window.parent.IndexSupport.AppInfo.logout();
                        }
                    }
                    error({
                        error: {
                            message: errormsg,
                            errorCode: errorcode
                        }
                    }, tmUrl);
                } catch (e) {
                    error(this._response(), tmUrl);
                }
            } else {
                error(this._response(), tmUrl);
            }
        } else {
            if (json) {
                var tips = json.message || json.statusText;
                xyzAlert.error(tips);
            }
        }
    };
    XyzJsonRPC._requestSuccess = function(json, options, tmUrl, reqCache) {
        var success = options.success;
        var error = options.error;
        if (typeof error !== "function") {
            error = function(result) {
                var mesaage = result && result.message || "";
                xyzAlert.error(mesaage);
            };
        }
        var response = this._response(json);
        if (window.xyzJsonRPCMock) {
            if (response.result && response.status) {
                success(response.result, tmUrl);
            } else {
                success(response, tmUrl);
            }
            return;
        }
        if (response.status.code !== 0 && typeof error === "function") {
            //与服务端通信失败
            error({
                code: -1,
                message: response.status.message
            }, tmUrl);
            return;
        }
        if (response.result && response.result.retCode !== 0) {
            //无服务权限导致请求失败
            var result = response.result;
            if (result.directURL) {
                if (result.retCode === 999e3) {
                    top.window.location.href = result.directURL;
                } else {
                    location.href = result.directURL;
                }
            } else {
                error(result, tmUrl);
            }
            return;
        }
        if (typeof success === "function") {
            success(response.result, tmUrl);
            if (options.cache === true && reqCache === true) {
                this._setCache(options.url, options.params, response);
            }
        }
    };
    XyzJsonRPC._response = function(json) {
        if (json === undefined) {
            return {
                message: "Internal server error",
                error: "Internal server error",
                version: "2.1"
            };
        } else {
            try {
                if (typeof json === "string") {
                    json = JSON.parse(json);
                }
                if (!json.result) {
                    return json;
                }
                if ($.isArray(json) && json.result.length > 0 && json[0].result.jsonrpc !== "2.1" || !$.isArray(json.result) && json.result.jsonrpc !== "2.1") {
                    throw "版本错误";
                }
                return json;
            } catch (e) {
                return {
                    error: "Internal server error: " + e,
                    version: "2.1"
                };
            }
        }
    };
    //判断是否有缓存
    XyzJsonRPC._hasCache = function(url, options) {
        var cache = options.cache;
        if (cache !== false) {
            var params = options.params;
            var cacheTime = options.cacheTime || 5;
            //默认缓存时间5分钟
            var cacheSec = cacheTime * 60 * 1e3;
            var cacheObj = this._getCacheObj(cacheKey);
            var findObj = _.find(cacheObj, function(coObj) {
                return coObj.url === url && _.isEqual(coObj.params, params);
            });
            var now = this._getNow();
            if (findObj) {
                //存在缓存
                var findTime = findObj.time;
                if (now - findTime > cacheSec) {
                    //缓存过期
                    this.removeDataCache(url, params);
                    return false;
                }
                return findObj.data;
            } else {
                //不存在缓存
                return false;
            }
        }
        return false;
    };
    XyzJsonRPC._getCacheObj = function(key) {
        var cacheContent = localStorage.getItem(key);
        var isCacheData = key === cacheKey;
        var defaultObj = isCacheData ? [] : {};
        if (cacheContent) {
            try {
                var cacheObj = JSON.parse(cacheContent);
                return cacheObj;
            } catch (e) {
                //此处添加try catch，目的在于避免本模块的bug造成所有请求不可用，也可避免localStorage被外部篡改所造成的bug
                this._setItem(key, defaultObj);
                return defaultObj;
            }
        } else {
            this._setItem(key, defaultObj);
            return defaultObj;
        }
    };
    XyzJsonRPC._setCache = function(url, params, data) {
        var cacheObj = this.removeDataCache(url, params);
        cacheObj.push({
            url: url,
            params: params,
            data: data,
            time: this._getNow()
        });
        this._setItem(cacheKey, cacheObj);
    };
    XyzJsonRPC._getNow = function() {
        return new Date().getTime();
    };
    XyzJsonRPC.removeDataCache = function(url, params) {
        var cacheObj = this._getCacheObj(cacheKey);
        _.remove(cacheObj, function(coObj) {
            return coObj.url === url && _.isEqual(coObj.params, params);
        });
        this._setItem(cacheKey, cacheObj);
        return cacheObj;
    };
    //获取配置文件逻辑
    XyzJsonRPC._getConfigObj = function(fileKey, options, callback) {
        var _cache = this._getCacheObj(cacheConfigKey);
        var hasData = _cache[fileKey];
        var now = this._getNow();
        var that = this;
        var goFetch = function() {
            if (configBase === "/") {
                configBase = "";
            } else if (configBase.charAt(configBase.length - 1) === "/") {
                configBase = configBase.substring(0, configBase.length - 1);
            }
            var _url = format("{0}/{1}{2}", configBase, fileKey, options.ext || "");
            that._doAjax(_url, {}, options, function(json) {
                if (json.cache === true) {
                    json.time = now;
                    json.cacheTime = json.cacheTime || 5;
                    _cache[fileKey] = json;
                    that._setItem(cacheConfigKey, _cache);
                }
                callback(null, json);
            }, function(err) {
                callback(err);
            });
        };
        if (hasData) {
            var time = hasData.time;
            var cacheTime = hasData.cacheTime || 5;
            var cacheSec = cacheTime * 60 * 1e3;
            if (now - time > cacheSec) {
                //缓存过期，重新请求
                goFetch();
            } else {
                callback(null, hasData);
            }
        } else {
            //无缓存, 第一次请求
            goFetch();
        }
    };
    XyzJsonRPC._setItem = function(key, val) {
        var saveData = JSON.stringify(val);
        try {
            localStorage.setItem(key, saveData);
        } catch (e) {
            localStorage.clear();
            localStorage.setItem(key, saveData);
        }
    };
    module.exports = function(jQuery) {
        $ = jQuery;
        $.jsonRPC = XyzJsonRPC;
        $.getExheader = XyzJsonRPC._getExheader;
    };
}, {});