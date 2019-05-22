define("#/xyz-component-base/0.1.13/xyz-component-base-debug", [ "#/jquery/jquery-debug", "#/lodash/lodash-debug", "#/xyz-jsonRPC/xyz-jsonRPC-debug" ], function(require, exports, module, installOption) {
    var $ = require("#/jquery/jquery-debug"), _ = require("#/lodash/lodash-debug");
    require("#/xyz-jsonRPC/xyz-jsonRPC-debug")($);
    /** 
 *  组件继承机制.
 */
    var utils = {
        extend: function() {
            // inline overrides
            var io = function(o) {
                for (var m in o) {
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;
            return function(sb, sp, overrides) {
                if (typeof sp === "object") {
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor !== oc ? overrides.constructor : function() {
                        sp.apply(this, arguments);
                    };
                }
                var F = function() {}, sbp, spp = sp.prototype;
                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor = sb;
                sb.superclass = spp;
                if (spp.constructor === oc) {
                    spp.constructor = sp;
                }
                sbp.superclass = sbp.supr = function() {
                    return spp;
                };
                sbp.override = io;
                utils.override(sb, overrides);
                sb.extend = function(o) {
                    return utils.extend(sb, o);
                };
                return sb;
            };
        }(),
        override: function(origclass, overrides) {
            if (overrides) {
                var p = origclass.prototype;
                $.extend(p, overrides);
            }
        }
    };
    //bind方法兼容
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, Fnop = function() {}, fBound = function() {
                return fToBind.apply(this instanceof Fnop && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
            Fnop.prototype = this.prototype;
            fBound.prototype = new Fnop();
            return fBound;
        };
    }
    var noop = function() {};
    /*
 * 组件基类.
 */
    var Base = utils.extend(noop, {
        constructor: function(options) {
            component.saveComponent(this, options);
            component.bingEvents(this, options);
            component.initStyle(this, options);
        },
        //事件绑定
        on: function(ename, handler, scope) {
            var ctx = scope || this;
            ctx._handlers = ctx._handlers || {};
            ctx._handlers[ename] = {
                handler: handler,
                context: scope,
                ctx: ctx
            };
        },
        //事件只绑定一次
        one: function(ename, handler, scope) {
            return handler && (handler.one = !0), this.on(ename, handler, scope);
        },
        //解除事件绑定
        off: function(ename, handler, scope) {
            var ctx = scope || this, r = ctx._handlers;
            if (ename && r[ename]) {
                if ("function" === typeof handler && r[ename].handler === handler) {
                    r[ename] = {};
                }
            } else {
                r[ename] = {};
            }
        },
        //触发事件
        emit: function(ename) {
            var args = [].slice.call(arguments, 1), ret = true, i = this._handlers && this._handlers[ename];
            if (i && i.handler) {
                ret = i.handler.apply(this, args) === false ? false : true;
                if (i.handler.one) {
                    i = {};
                }
            }
            return ret;
        },
        //默认为true的参数设置方法
        defaultTrue: function(options, key) {
            this[key] = options[key] === undefined ? true : options[key];
        },
        //读取ajax配置中的数据
        readAjaxData: function(ajaxObj, eventName, callback) {
            if (!ajaxObj) {
                throw eventName + ": 请配置ajax参数!";
            }
            var url = ajaxObj.url;
            var localData = ajaxObj.list;
            if (!localData && !url) {
                throw eventName + ": ajax对象中url和list属性至少需要配置其中一个!";
            }
            if (url) {
                $.jsonRPC.request({
                    url: url,
                    params: ajaxObj.params,
                    success: function(response) {
                        var data = response.data;
                        callback(data);
                    }
                });
            } else {
                callback(localData);
            }
        },
        //判断是否为新规范的样式
        getStyleVersion: function() {
            var el = this.el;
            if (el && el.attr("class")) {
                var classArr = el.attr("class").split(" ");
                var styleStr = _.find(classArr, function(ss) {
                    return ss.substring(0, 7) === "style_v" && ss.length > 7;
                });
                if (styleStr) {
                    return styleStr.substring(7);
                }
            }
            return seajs && seajs.pluginSDK && seajs.pluginSDK.config && seajs.pluginSDK.config.style_version;
        }
    });
    /**
 * 组件辅助类.
 */
    var component = {
        create: function(type, $wrap) {
            if (!type) {
                throw new Error('cannot create component, property "type" is undefined');
            }
            if (!component.types[type]) {
                throw new Error('create component failed, component "' + type + '" cannot found!');
            }
            var tagModName = "", tagCls = "", ctx = typeof $wrap === "string" ? $($wrap) : $wrap;
            ctx = ctx || $("body");
            switch (type) {
              case "datepicker":
                tagModName = "xyz-datepicker-tag";
                tagCls = ".xyz_datepicker_trans";
                break;

              case "select":
                tagModName = "xyz-select-tag";
                tagCls = ".xyz_select_trans";
                break;
            }
            if (tagModName && ctx.find(tagCls).length) {
                //有定义标签的模块引用模块标签组件
                require.async(tagModName, function(Tag) {
                    //异步渲染
                    if (Tag) {
                        new Tag({
                            ctx: $wrap
                        }).render();
                    }
                });
            }
        },
        createAll: function(wrap) {
            var type = "", $wrap = wrap ? $(wrap) : null;
            for (var key in component.types) {
                type = component.types[key];
                component.create(type, $wrap);
            }
        }
    };
    /**
 * 组件管理器，所有基于Base基类的组件都在此注册管理.
 */
    (function() {
        var instances = {};
        //所有组件
        $.extend(component, {
            saveComponent: function(instance, options) {
                var el = options.el;
                if (el) {
                    //保存组件到组件管理器中
                    instances[el] = instance;
                }
            },
            //从组件管理器中取组件实例对象
            getComponent: function() {
                if (!arguments.length) {
                    throw new Error("argument is empty,  it must not be null");
                }
                return instances[arguments[0]];
            },
            bingEvents: function(instance, options) {
                var events = options.events;
                if (options.events) {
                    for (var key in events) {
                        var fn = events[key];
                        instance.on(key, fn, instance);
                    }
                }
            },
            initStyle: function(instance, options) {
                var styleVersion = Base.prototype.getStyleVersion();
                if (styleVersion) {
                    var className = "style_v" + styleVersion;
                    $(options.el).addClass(className);
                }
            }
        });
    })();
    //支持的组件类型.
    $.extend(component, {
        types: {
            datepicker: "datepicker",
            //日期组件(单选)
            select: "select"
        }
    });
    module.exports = {
        extend: Base.extend,
        getComponent: component.getComponent,
        create: component.create,
        createAll: component.createAll
    };
}, {});