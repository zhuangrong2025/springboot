/*!
 * 自动化操控脚本编辑器核心库.
 *
 * Author: chenming
 * Date: 2019-05-29
 */
var mse = {
	/**
	 * current version of the mse library.
	 *
	 * Current version is 1.0.0.
	 */
	VERSION: '1.0.0',
	/**
	 * True if the mse library is `DEBUG` mode.
	 *
	 */
	DEBUG: false,
	/**
	 * Variable: isIE
	 *
	 * True if the current browser is Internet Explorer 10 or below.
	 * to detect IE 11.
	 */
	isIE: navigator.userAgent.indexOf('MSIE') >= 0,
	/**
	 * True if `value` is an primitive `Object`.
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     */
	isObject : function (value) {
		var type = typeof value;
		return value != null && (type == 'object' || type == 'function');
	},
	/**
	 * True if `value` is classified as an `Array` object.
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 */
	isArray : Array.isArray,
	/**
	 * True if `value` is classified as a `String` primitive or object.
	 * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
	 */
	isString : function(value){
		return typeof value === 'string';
	},
	/**
	 * True if `value` is `undefined`.
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     */
	isUndefined : function(value) {
		return value === undefined;
	},
	/**
     * True if `value` is classified as a boolean primitive or object.
	 * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
	 */
	isBoolean : function(v){
		return typeof v === 'boolean';
	},
	/**
	 * True if `value` is classified as a `Number` primitive or object.
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
	 */
	isNumber : function(v) {
		return typeof v === 'number' && !isNaN(v)
	},
	/**
	 * Checks if `value` is in `array`, returning `index` if the value is found, else `-1`.
	 *
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `index` if `value` is found, else `-1`.
	 */
	indexOf : function(array, value, fromIndex) {
		fromIndex = fromIndex || 0;
		var index = fromIndex - 1, length = array.length;
		while (++index < length) {
			if (array[index] === value) {
				return index;
			}
		}
		return -1;
	},
	/**
     * This method returns `undefined`.
     */
	noop : function() {},
	/**
	 * Copies all the properties of config to obj.
	 * @param {Object} obj The receiver of the properties
	 * @param {Object} config The source of the properties
	 * @param {Object} defaults A different object that will also be applied for default values
	 * @return {Object} returns obj
	 */
	apply : function(o, c, defaults){
        // no "this" reference for friendly out of scope calls
        if(defaults){
        	mse.apply(o, defaults);
        }
        if(o && c && typeof c == 'object'){
            for(var p in c){
                o[p] = c[p];
            }
        }
        return o;
    }
};
mse.apply(mse, {
	extend: function () {
		// inline overrides
		var io = function (o) {
			for (var m in o) {
				this[m] = o[m];
			}
		};
		var oc = Object.prototype.constructor;

		return function (sb, sp, overrides) {
			if (typeof sp === 'object') {
				overrides = sp;
				sp = sb;
				sb = overrides.constructor !== oc ? overrides.constructor : function () { sp.apply(this, arguments); };
			}
			var F = function () { },
				sbp,
				spp = sp.prototype;

			F.prototype = spp;
			sbp = sb.prototype = new F();
			sbp.constructor = sb;
			sb.superclass = spp;
			if (spp.constructor === oc) {
				spp.constructor = sp;
			}
			sbp.superclass = sbp.supr = (function () {
				return spp;
			});
			sbp.override = io;
			mse.override(sb, overrides);
			sb.extend = function (o) { return mse.extend(sb, o); };
			return sb;
		};
	}(),
	override: function (origclass, overrides) {
		if(overrides){
			var p = origclass.prototype;
			mse.apply(p, overrides);
			if(mse.isIE && overrides.hasOwnProperty('toString')){
				p.toString = overrides.toString;
			}
		}
	},
	clone : function(o) {
		if(!o || 'object' !== typeof o) {
			return o;
		}
		if('function' === typeof o.clone) {
			return o.clone();
		}
		var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
		var p, v;
		for(p in o) {
			if(o.hasOwnProperty(p)) {
				v = o[p];
				if(v && 'object' === typeof v) {
					c[p] = DOBE.clone(v);
				} else {
					c[p] = v;
				}
			}
		}
		return c;
	},
	/**
	 * 模板.
	 * 如：
	 * var html = '<span><%=data.name%></span>';
	 * var data = {data: {id: 1, name: 'test'}} ;
	 * mse.tmpl(html, data)  => <span>test</span>
	 *
	 */
	tmpl : (c = {}, l = function (e) {
		return 0 == e ? e : (e = (e || "").toString()).replace(/&(?!\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;")
	}, d = function (e, t) {
		if (t)
			for (var n in t) {
				var i = new RegExp("<%#\\s?" + n + "%>", "g");
				e = e.replace(i, t[n])
			}
		return e
	}, function e(t, n, i) {
		var a = !/\W/.test(t);
		!a && (t = d(t, i));
		var o = a ? c[t] = c[t] || e(d(document.getElementById(t).innerHTML, i)) : new Function("obj", "_escape", "var _p='';with(obj){_p+='" + t.replace(/[\r\t\n]/g, " ").split("\\'").join("\\\\'").split("'").join("\\'").split("<%").join("\t").replace(/\t-(.*?)%>/g, "'+$1+'").replace(/\t=(.*?)%>/g, "'+_escape($1)+'").split("\t").join("';").split("%>").join("_p+='") + "';} return _p;"),
		r = function (e) {
			return "object" == typeof e && (e.QCCONSOLE_HOST = window.QCCONSOLE_HOST, e.QCMAIN_HOST = window.QCMAIN_HOST, e.QCBUY_HOST = window.QCBUY_HOST),
			o(e, l)
		};
		return n ? r(n) : r
	}),
	format : (
		setPlainVal = function(data, key, str) {
			for (var _k in data) {
				var val = data[_k];
				key.push(_k);
				if (mse.isObject(val)) {
					str = setPlainVal(val, key, str);
				} else if (isShowVal(val)) {
					var reKey = key.join(".");
					str = replaceStr(str, reKey, val);
				}
			}
			return str;
		},
		isShowVal = function(val) {
			return mse.isString(val) || mse.isNumber(val) || mse.isBoolean(val);
		},
		replaceStr = function(str, key, val) {
			var re = new RegExp("{" + key + "}", "gm");
			str = str.replace(re, val);
			return str;
		},
		function(tpl, data) {
			if (arguments.length === 0) {
				return null;
			}
			var str = arguments[0];
			for (var key in data) {
				var dataVal = data[key];
				if (isShowVal(dataVal)) {
					str = replaceStr(str, key, dataVal);
				} else {
					if (mse.isObject(dataVal)) {
						//嵌套对象模板替换
						str = setPlainVal(dataVal, [ key ], str);
					}
				}
			}
			return str;
		}
	)
});
/**
 * 工具类.
 */
(function() {
	var idSeed = 0;
	var chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
		"k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0",
		"1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H",
		"I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y",
		"Z"];

	mse.apply(mse, {
		/**
	     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
	     *
	     * @param {string} [prefix=''] The value to prefix the ID with.
	     * @returns {string} Returns the unique ID.
	     */
		guid : function(prefix) {
			prefix = prefix || '';
			return prefix + (++idSeed);
		},
		/**
	     * Generates a UUID String.
	     *
	     * @returns {string} Returns the UUID.
	     */
		uuid : function() {
			var _uuidlet = function () {
		          return(((1+Math.random())*0x10000)|0).toString(16).substring(1);
			}
			return _uuidlet() + _uuidlet() + _uuidlet() + _uuidlet() + _uuidlet() + _uuidlet() + _uuidlet() + _uuidlet();
		},
		/**
	     * Generates a short UUID String.
	     *
	     * @returns {string} Returns the short UUID.
	     */
		shortUUID: function() {
			var uuid = mse.uuid();
			var sid  = [];
			for (var i = 0; i < uuid.length; i++) {
				var str = uuid.substring(i * 2, i * 2 + 2);
				var x = parseInt(str, 16);
				sid.push(chars[x%62]);
			}
			return sid.join("");
		}
	});
})();
(function() {
	mse.data = {};
    var data = {};
    function MemoryStorage() {}
    MemoryStorage.prototype = {
        //获取数据
        getItem : function(key){
            return data[key];
        },
        //保存数据
        setItem : function(key, value){
            if (typeof key !== 'string' || !key) {
                throw new Error('cannot call sui.data.MemoryStorage.set(), key is invalid');
            }
            data[key] = value;
            return this;
        },
        //删除保存的数据
        removeItem : function(key) {
            delete data[key];
            return this;
        },
        //删除所有保存的数据
        clear : function() {
            data = {};
            return this;
        },
        //复制所有保存的数据
        clone: function() {
            return mse.clone(data);
        }
    }
    mse.data.MemoryStorage = new MemoryStorage();
})();
(function() {
    mse.data.Storage = function() {
        var storage = window.sessionStorage;
        if (!storage) {//不支持sessionStorage则使用内存缓存
            storage = mse.data.MemoryStorage;
        }
        var methods = {
            getItem: function (key) {
                var value = null;
                try {
                    value = JSON.parse(storage.getItem(key));
                } catch (e) {
                }
                return value;
            },
            setItem : function (key, value) {
                if (typeof key !== 'string' || !key) {
                    throw new Error('cannot call sui.data.Storage.set(), key is invalid');
                }
                storage.setItem(key, JSON.stringify(value));
                return storage;
            },
            removeItem: function (key) {
                storage.removeItem(key);
                return this;
            },
            clear: function () {
                storage.clear();
                return this;
            }
        };
        methods.get = methods.getItem;
        methods.set = methods.setItem;
        methods.update = methods.updateItem;
        methods.remove = methods.removeItem;
        return methods;
    }();

    mse.apply(mse, {
        getStorage : function() {
            return mse.data.Storage
        }
    });
})();
/*
* 组件事件基类.
*/
mse.BaseEvent = mse.extend(mse.noop, {
    constructor: function (options) {},
    //事件绑定
    on: function (ename, handler, scope) {
        var ctx = scope || this;
        ctx._handlers = ctx._handlers || {};
        ctx._handlers[ename] = {
            handler: handler,
            context: scope,
            ctx: ctx
        }
    },
    //事件只绑定一次
    one: function (ename, handler, scope) {
        return handler && (handler.one = !0),
            this.on(ename, handler, scope)
    },
    //解除事件绑定
    off: function (ename, handler, scope) {
        var ctx = scope || this,
            r = ctx._handlers;
        if (ename && r[ename]) {
            if ('function' === typeof handler && r[ename].handler === handler) {
                r[ename] = {};
            }
        } else {
            r[ename] = {}
        }
    },
    //触发事件
    emit: function (ename) {
        var args = [].slice.call(arguments, 1), ret = true,
            i = this._handlers && this._handlers[ename];
        if (i && i.handler) {
            ret = i.handler.apply(this, args) === false ? false : true;
            if (i.handler.one) { i = {} }
        }
        return ret
    }
});
/**
 * 全局事件观测器.
 * mse.observer.on('evename', fn) --事件监听
 * mse.observer.emit('evename', arg1, arg2, ...) --事件触发
 * mse.observer.off('evename', fn) --事件解绑
 */
mse.observer = new mse.BaseEvent();
mse.BaseModule = mse.extend(mse.BaseEvent, {});
mse.BaseComponent = mse.extend(mse.BaseEvent, {});
/**
 * 用于JS调用C++的接口.
 * mse.invokeExecutor({method:'', params: []});
 */
(function() {
	var errReg = /&\$\$\$\$\$\$&(\d+)&\$\$\$\$\$\$&(.*?)&\$\$\$\$\$\$&/;
	mse.invokeExecutor = function(options) {
		options = options || {};
		var separator = '|~|'
			module = '0',
			method = options.method,
			params = options.params || [],
			success = options.success || mse.noop,
			error = options.error;
		var p = [];  // ['0', 'getflow']
		p.push(module); //模块名, 固定为0，表示公共模块
		p.push(method);	//调用方法
		var callStr = p.concat(params).join(separator); // '0|~|getflow|~|str1'
		var ret = mse.mock.isLocal(method) ? window.callMockCppFunc(callStr) : window.callCppFunc(callStr); // mse.mock.invoke(method, args);
		if(ret && errReg.test(ret)) {//返回异常
			var group = ret.match(errReg),
				errCode = group[1], //错误代码
				errMsg = group[2],	//错误消息
				errRet = {code: errCode, msg: errMsg}; //错误返回结构
			if(error) {
				error(errRet);
			} else {
				errMsg = errMsg || "操作失败"
				var text = errMsg + ", 错误代码: " + errCode;
				sui.msg.alert('提示', text);
			}
		} else {
			success(ret);
		}
	};
})();
//模拟模块
(function() {
	var fns = {}, locals = [];
	mse.mock = {
		register: function(method, fn) {
			fns[method] = fn;
		},
		invoke: function(method, args) {
			if(!fns[method]) {
				throw new Error('方法未定义, 方法名:' + method);
			}
			return fns[method].apply(this, args)
		},
		//指定方法调用本地JS接口, 不调用C++接口
		setLocal: function(methods) {
			if(mse.isString(methods)) {
				methods = [methods];
			}
			locals = locals.concat(methods)
		},
		isLocal: function(method) {
			return mse.indexOf(locals, method) !== -1 ? true : false;
		}
	}
})();
(function() {
	var separator = '|~|';
	function cppFn(str) {  // str --> 'getflow|~|str1|~|str2' --> 第一个是方法名，后面是参数
		var sections = str.split(separator),
			len = sections.length,
			method = len > 1 ? sections[1] : '',
			args = [];
		if(len > 2) {
			for(var i = 2; i < len; i++) {
				args.push(sections[i]);
			}
		}
		return mse.mock.invoke(method, args);
	}
	if (!window.callCppFunc) {//未实现c++的接口函数的情况下，允许接入模拟模块
		window.callCppFunc = cppFn;
	}
	//通过mse.mock.setLocal(method)指定的方法调用该分支
	window.callMockCppFunc = cppFn;
})();

/* mse.mock.register('newFlow', function(str1, str2){

}); */
