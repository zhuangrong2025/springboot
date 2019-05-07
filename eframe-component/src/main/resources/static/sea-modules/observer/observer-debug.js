define("#/observer/0.1.4/observer-debug", [], function(require, exports, module, installOption) {
    var events = {};
    var lastArgs = {};
    var console;
    if (!window.console) {
        var nop = function() {};
        console = {
            log: nop,
            warn: nop,
            error: nop
        };
    } else {
        console = window.console;
    }
    var allowDebug = seajs.debug && !window.ActiveXObject;
    function isString(val) {
        return Object.prototype.toString.call(val) === "[object String]";
    }
    function isFunction(val) {
        return Object.prototype.toString.call(val) === "[object Function]";
    }
    function isArray(val) {
        return Object.prototype.toString.call(val) === "[object Array]";
    }
    function isRegExp(val) {
        return Object.prototype.toString.call(val) === "[object RegExp]";
    }
    var arrIndexOf = Array.prototype.indexOf ? function(arr, item) {
        return arr.indexOf(item);
    } : function(arr, item) {
        for (var i = 0, length = arr.length; i < length; i++) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    };
    function clearItem(event, oldArgs, isOther) {
        if (isOther) {
            lastArgs[event] = oldArgs[event];
        } else {
            delete lastArgs[event];
        }
    }
    function clearLastArgs(arr, isOther, oldArgs) {
        if (!(arr || isString(arr) || isRegExp(arr) || isArray(arr))) {
            throw "输入的参数必须是字符串或字符串数组";
        }
        if (!isArray(arr)) {
            arr = [ arr ];
        }
        var eventKeys = [];
        for (var key in oldArgs) {
            eventKeys.push(key);
        }
        for (var i = 0, length = arr.length; i < length; i++) {
            var event = arr[i];
            if (!isString(event) && !isRegExp(event)) {
                throw "输入的参数的数组元素必须是字符串或正则表达式";
            }
            if (isRegExp(event)) {
                for (var j = 0, len = eventKeys.length; j < len; j++) {
                    var testEvent = eventKeys[j];
                    if (event.test(testEvent)) {
                        clearItem(testEvent, oldArgs, isOther);
                    }
                }
            } else if (event in oldArgs) {
                clearItem(event, oldArgs, isOther);
            }
        }
    }
    function triggerEvents(list, that, args, debugOut) {
        var _list = list.slice(0);
        for (var i = 0, length = _list.length; i < length; i++) {
            var event = _list[i];
            event.callback.apply(event.context || that, args);
            if (debugOut) {
                console.log(event.stack);
            }
        }
    }
    function debug() {
        var error = new Error();
        if (!error.stack) {
            return;
        }
        var index = 3;
        var list = error.stack.split("\n");
        if (list[1] === "    at Error (<anonymous>)") {
            index++;
        }
        var caller = arguments.callee.caller.caller;
        if (caller === module.exports.once || caller === module.exports.past) {
            index++;
        }
        var stack = list[index];
        return stack;
    }
    module.exports = {
        on: function(name, callback, context) {
            if (!isString(name) || !isFunction(callback)) {
                throw "必须传入正确的name和callback参数";
            }
            var list = events[name] || (events[name] = []);
            var event = {
                callback: callback,
                context: context || this
            };
            if (allowDebug) {
                event.stack = debug();
                for (var i = 0, length = list.length; i < length; i++) {
                    var _event = list[i];
                }
            }
            list.push(event);
            return this;
        },
        once: function(name, callback, context) {
            if (!isString(name) || !isFunction(callback)) {
                throw "必须传入正确的name和callback参数";
            }
            var self = this;
            var once = function() {
                self.off(name, once);
                callback.apply(context || self, arguments);
            };
            once.callback = callback;
            this.on(name, once);
            return this;
        },
        off: function(name, callback, context) {
            if (!(name || callback || context)) {
                throw "必须传入name, callback, context等参数";
            }
            if (!name || !isString(name)) {
                throw "必须传入正确的name参数";
            }
            if (callback && !isFunction(callback)) {
                throw "必须传入正确的callback参数";
            }
            var list = events[name];
            if (!list) {
                return this;
            }
            if (!(callback || context)) {
                delete events[name];
                return this;
            }
            for (var i = list.length - 1; i >= 0; i--) {
                var event = list[i];
                if (event.callback === callback || event.callback.callback === callback) {
                    if (!context || event.context === context) {
                        list.splice(i, 1);
                    }
                }
            }
            return this;
        },
        offAll: function() {
            events = {};
            return this;
        },
        past: function(name, callback, context) {
            if (!isString(name) || !isFunction(callback)) {
                throw "必须传入正确的name和callback参数";
            }
            if (lastArgs[name]) {
                callback.apply(context || this, lastArgs[name]);
            }
            this.on(name, callback, context);
            return this;
        },
        trigger: function(name) {
            if (!isString(name)) {
                throw "必须传入正确的name参数";
            }
            var args = [];
            for (var i = 1, len = arguments.length; i < len; i++) {
                args.push(arguments[i]);
            }
            lastArgs[name] = args;
            var ObserverDebugOut = window.ObserverDebugOut;
            var debugOut;
            if (allowDebug && ObserverDebugOut) {
                debugOut = ObserverDebugOut === "*";
                debugOut = debugOut || ObserverDebugOut === name;
                debugOut = debugOut || arrIndexOf(ObserverDebugOut, name) >= 0;
            }
            if (debugOut) {
                var stack = debug();
                console.log("--------------- trigger: [" + name + "] begin ---------------");
                console.log(stack);
                console.log("on event");
            }
            var list = events[name];
            if (list) {
                triggerEvents(list, this, args, debugOut);
            }
            var all = events.all;
            if (debugOut && all) {
                console.log("on all");
            }
            if (all) {
                triggerEvents(all, this, args, debugOut);
            }
            if (debugOut) {
                console.log("--------------- trigger: [" + name + "] end -----------------");
                console.log("");
                console.log("");
            }
            return this;
        },
        clearAll: function() {
            lastArgs = {};
        },
        clear: function(arr) {
            var oldArgs = lastArgs;
            clearLastArgs(arr, false, oldArgs);
        },
        clearOther: function(arr) {
            var oldArgs = lastArgs;
            lastArgs = {};
            clearLastArgs(arr, true, oldArgs);
        },
        _getLastArgs: function() {
            return lastArgs;
        },
        _getSubscribers: function() {
            return events;
        }
    };
    if (allowDebug) {
        window.printObserver = function() {
            var result = "";
            for (var name in events) {
                result += "on [" + name + "]\n";
                var event = events[name];
                for (var i = 0, length = event.length; i < length; i++) {
                    result += "    " + event[i].stack + "\n";
                }
                result += "\n";
            }
            console.log(result);
        };
    }
}, {});