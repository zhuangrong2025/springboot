define("#/xyz-util/0.1.54/xyz-util-debug", [ "#/lodash/lodash-debug", "#/jquery/jquery-debug", "#/stringformat/stringformat-debug", "./thousand_operate-debug", "./path-debug", "./url-debug", "./page-debug" ], function(require, exports, module, installOption) {
    var _ = require("#/lodash/lodash-debug");
    var $ = require("#/jquery/jquery-debug");
    var format = require("#/stringformat/stringformat-debug");
    var thousandOper = require("./thousand_operate-debug");
    var pathJoin = require("./path-debug");
    var urlUtil = require("./url-debug");
    var pageUtil = require("./page-debug");
    null;
    var countTextWidthTpl = '<div class="count_text_width" style="font-size:{0}px;">{1}</div>';
    var XyzUtil = {
        supportCss3Animation: function() {
            var e = document.createElement("div");
            return "animation" in e.style || "webkitAnimation" in e.style ? !0 : !1;
        },
        animationend: function(e, t) {
            t && t();
            // return;
            if (this.supportCss3Animation()) {
                var n = $(e), r = function() {
                    var t = n.data("cb");
                    e.removeEventListener("animationend", t);
                    e.removeEventListener("webkitAnimationEnd", t);
                }, o = function() {
                    t && t();
                    r();
                };
                r();
                e.addEventListener("webkitAnimationEnd", o);
                e.addEventListener("animationend", o);
                n.data("cb", o);
            } else {
                t && t();
            }
        },
        escapeJavascript: function(str) {
            var s = "";
            for (var i = 0; i < str.length; i++) {
                switch (str[i]) {
                  case "'":
                    s = s + "\\'";
                    break;

                  case "/":
                    s = s + "\\/";
                    break;

                  case "\\":
                    s = s + "\\\\";
                    break;

                  case '"':
                    s = s + '\\"';
                    break;

                  default:
                    s = s + str[i];
                }
            }
            return s;
        },
        escapeHtml: function(str) {
            var s = "";
            for (var i = 0; i < str.length; i++) {
                switch (str[i]) {
                  case "&":
                    s = s + "&amp;";
                    break;

                  case "<":
                    s = s + "&lt;";
                    break;

                  case ">":
                    s = s + "&gt;";
                    break;

                  case '"':
                    s = s + "&quot;";
                    break;

                  case "'":
                    s = s + "&#39;";
                    break;

                  default:
                    s = s + str[i];
                }
            }
            return s;
        },
        escapeUrl: function(str) {
            var s = "";
            for (var i = 0; i < str.length; i++) {
                switch (str[i]) {
                  case "<":
                    s = s + "%3C";
                    break;

                  case ">":
                    s = s + "%3E";
                    break;

                  case '"':
                    s = s + "%22";
                    break;

                  case "'":
                    s = s + "%27";
                    break;

                  default:
                    s = s + str[i];
                }
            }
            return s;
        },
        isEmpty: function(val) {
            switch (typeof val) {
              case "string":
                return val.trim().length == 0 ? true : false;
                break;

              case "number":
                return val == 0;
                break;

              case "object":
                return val == null;
                break;

              case "array":
                return val.length == 0;
                break;

              default:
                return true;
            }
        },
        toThousands: function(num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
        },
        formatMoney: function(s, n) {
            var flag = "0";
            if (!s || s == "") {
                return "0";
            }
            s = s.toString();
            //记录负号标志
            if (s.substring(0, 1) == "-") {
                s = s.substring(1, s.length);
                flag = "1";
            }
            n = n >= 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
            t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
            }
            var result = t.split("").reverse().join("");
            if (n > 0) {
                result += "." + r;
            }
            if (flag == 1) result = "-" + result;
            var re = /^(\-)?0.0+$/;
            if (re.test(result)) {
                result = "0";
            }
            return result;
        },
        pad: function(num, n) {
            var len = (num || 0).toString().length;
            while (len++ < n) num = "0" + num;
            return num;
        },
        removeProperty: function(obj) {
            if (arguments.length > 1) {
                for (var i = 1, l = arguments.length; i < l; i++) {
                    if (obj[arguments[i]]) {
                        delete obj[arguments[i]];
                    }
                }
            }
        },
        // 判断是否是IP地址
        isIpStr: function(obj) {
            var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            var reg = obj.match(exp);
            if (reg == null) {
                return false;
            } else {
                return true;
            }
        },
        // IP地址转整数
        ipToInt: function(ipStr) {
            var ipS = ipStr.split(".");
            var retInt = 0;
            for (var i = 0; i < 4; i++) {
                retInt = retInt << 8;
                retInt += parseInt(ipS[i]);
            }
            return retInt;
        },
        // 格式化时间 yyyymmdd -> yyyy-MM-dd
        fnConvertDate: function(dateStr) {
            var str = "";
            str += dateStr.substring(0, 4) + "-";
            str += dateStr.substring(4, 6) + "-";
            str += dateStr.substring(6, 8);
            return str;
        },
        // 格式化时间yyyy-MM-dd -> yyyymmdd
        fnParseDate: function(dateStr) {
            return !dateStr ? "" : dateStr.replace(/-/g, "");
        },
        fnString: function(str) {
            return !str ? "" : str;
        },
        isClass: function(o) {
            if (o === null) return "Null";
            if (o === undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8, -1);
        },
        clone: function(obj) {
            return _.cloneDeep(obj);
        },
        getUrlParams: function(urlStr) {
            urlStr = urlStr || window.location.href;
            var colIndex = urlStr.indexOf("?");
            if (colIndex === -1) {
                return {};
            }
            var paramsStr = urlStr.substring(colIndex + 1);
            if (paramsStr.indexOf("=") === -1) {
                //不合法的请求参数字符串
                return {};
            }
            var paramsArr = paramsStr.split("&");
            var backParams = {};
            for (var i = 0, len = paramsArr.length; i < len; i++) {
                var curParams = paramsArr[i];
                var equalIndex = curParams.indexOf("=");
                if (equalIndex !== -1) {
                    backParams[curParams.substring(0, equalIndex)] = decodeURIComponent(curParams.substring(equalIndex + 1));
                }
            }
            return backParams;
        },
        getFuncCode: function() {
            var theRequest = this.getUrlParams();
            var code = theRequest["_func_code"] || "";
            code = code.replace(/[^0-9]/gi, "");
            return code;
        },
        generateId: function() {
            var d = new Date().getTime();
            var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === "x" ? r : r & 3 | 8).toString(16);
            });
            return uuid;
        },
        getObjStr: function() {
            if (obj !== "0" && !obj) {
                return "";
            } else {
                return obj;
            }
        },
        numberConfirm: function(val1, val2) {
            if (!_.isEmpty(val1) && !_.isEmpty(val2)) {
                val1 = val1.toString();
                val2 = val2.toString();
                return val1 === val2;
            }
            return false;
        },
        countTextWidth: function(text, size) {
            size = size || 13;
            $("body").append('<div class="count_text_width" style="font-size: ' + size + 'px;">' + text + "</div>");
            var width = $(".count_text_width").width();
            $(".count_text_width").remove();
            return width;
        }
    };
    _.extend(XyzUtil, thousandOper);
    _.extend(XyzUtil, urlUtil);
    _.extend(XyzUtil, pageUtil);
    XyzUtil.pathJoin = pathJoin;
    module.exports = XyzUtil;
}, {});

define("#/xyz-util/0.1.54/thousand_operate-debug", [ "#/lodash/lodash-debug" ], function(require, exports, module, installOption) {
    var _ = require("#/lodash/lodash-debug");
    //判断传入数字格式是否正确， 并且删除头部无用的0
    var _format = function(str) {
        if (str === null || str === undefined || isNaN(str)) {
            return "";
        }
        var findDot = 0;
        for (var i = 0; i < str.length; i++) {
            //数字中不允许1个以上的小数点
            if (str.charAt(i) === ".") {
                findDot++;
            }
            if (findDot > 1) {
                break;
            }
        }
        if (findDot > 1) {
            return "";
        }
        str = str.toString();
        var deleZero = function(num) {
            if (num.charAt(0) === "0") {
                num = num.substring(1);
                num = deleZero(num);
            }
            return num;
        };
        str = deleZero(str);
        if (str.charAt(0) === ".") {
            str = "0" + str;
        }
        var dotIndex = str.indexOf(".");
        if (dotIndex !== -1 && dotIndex === str.length - 1) {
            str = str.substring(0, dotIndex);
        }
        return str;
    };
    //对字符串进行保留小数操作
    var _decimalCtrl = function(str, decimal) {
        var dotIndex = str.indexOf(".");
        if (dotIndex === -1) {
            str += ".";
            for (var i = 0; i < decimal; i++) {
                str += "0";
            }
            return str;
        }
        var lastIndex = decimal === 0 ? dotIndex : dotIndex + decimal + 1;
        return str.substring(0, lastIndex);
    };
    /*
*   千分位字符串 转 标准数字
*   str:   带逗号的千分位字符串
*   decimal:   可选参数，保留的小数位数,  不传默认按传str的小数位数做返回
* */
    var moneyToNumber = function(str, decimal) {
        if (str === null || str === undefined || str === "") {
            return "";
        }
        if (_.isEmpty(decimal) || decimal < 0) {
            decimal = 2;
        }
        var zStr = zeroConfirm(str, decimal);
        if (zStr !== false) {
            return zStr;
        }
        str = str.toString();
        var formatStr = str.replace(/,/g, "");
        formatStr = _format(formatStr);
        if (formatStr === "NaN") {
            return str;
        }
        if (decimal !== undefined) {
            try {
                formatStr = _decimalCtrl(formatStr, decimal);
            } catch (e) {
                return "";
                throw e;
            }
        }
        return formatStr;
    };
    /*
*   标准数字 转 千分位字符串
*   str:   带逗号的千分位字符串
*   decimal:   可选参数，保留的小数位数,  不传默认按传str的小数位数做返回
* */
    var numberToMoney = function(str, decimal) {
        if (str === null || str === undefined) {
            return "";
        }
        if (_.isEmpty(decimal) || decimal < 0) {
            decimal = 2;
        }
        var zStr = zeroConfirm(str, decimal);
        if (zStr !== false) {
            return zStr;
        }
        str = _format(str);
        if (str === "NaN") {
            return str;
        }
        var dotIndex = str.indexOf(".");
        var len = str.length;
        if (decimal !== undefined) {
            var dataDeci = decimal;
        } else {
            if (dotIndex !== -1) {
                dataDeci = len - dotIndex - 1;
            } else {
                dataDeci = 0;
            }
        }
        try {
            if (dotIndex === -1) {
                //最多保留20位小数
                str += ".00000000000000000000";
            } else {
                str += "00000000000000000000";
            }
            var formatStr = str.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
                return $1 + ",";
            });
            var fIndex = formatStr.indexOf(".");
            if (dataDeci === 0) {
                formatStr = formatStr.substring(0, fIndex);
            } else {
                formatStr = formatStr.substring(0, fIndex + dataDeci + 1);
            }
            return formatStr;
        } catch (e) {
            return "";
            throw e;
        }
    };
    /*
*   绑定输入框事件， 动态给输入框加入逗号切割
*   dom:   输入框的jquery对象
*   decimal:   可选参数，保留的小数位数,  不传默认按传str的小数位数做返回
* */
    var bindBlur = function(dom, decimal) {
        dom.blur(function() {
            var val = dom.val();
            var formatVal = numberToMoney(val, decimal);
            if (formatVal === "NaN") {
                dom.val("");
            } else {
                dom.val(formatVal);
            }
        });
        dom.focus(function() {
            var val = dom.val();
            var formatVal = moneyToNumber(val, decimal);
            if (formatVal === "NaN") {
                dom.val("");
            } else {
                dom.val(formatVal);
            }
        });
    };
    var zeroConfirm = function(str, decimal) {
        if (str === "" || parseFloat(str) === 0) {
            if (decimal === undefined) {
                var _dotIndex = str.toString().indexOf(".");
                if (_dotIndex === -1) {
                    decimal = 0;
                } else {
                    decimal = str.length - _dotIndex;
                }
            }
            str = 0;
            return str.toFixed(decimal);
        }
        return false;
    };
    var numToChinese = function(amt) {
        amt = "" + amt;
        var chineseStr = "";
        if (amt != "") {
            var symbol = "";
            var CN_ZERO = "零";
            var CN_ONE = "壹";
            var CN_TWO = "贰";
            var CN_THREE = "叁";
            var CN_FOUR = "肆";
            var CN_FIVE = "伍";
            var CN_SIX = "陆";
            var CN_SEVEN = "柒";
            var CN_EIGHT = "捌";
            var CN_NINE = "玖";
            var CN_TEN = "拾";
            var CN_HUNDRED = "佰";
            var CN_THOUSAND = "仟";
            var CN_TEN_THOUSAND = "万";
            var CN_HUNDRED_MILLION = "亿";
            var CN_TEN_THOUSAND_HUNDRED_MILLION = "万";
            //万亿
            var CN_SYMBOL = "";
            var CN_DOLLAR = "圆";
            var CN_TEN_CENT = "角";
            var CN_CENT = "分";
            var CN_INTEGER = "整";
            var integral;
            var decimal;
            var outputCharacters;
            var parts;
            var digits, radices, bigRadices, decimals;
            var zeroCount;
            var i, p, d;
            var quotient, modulus;
            if (amt.indexOf("-") != -1) {
                amt = amt.substring(1, amt.length);
                symbol = "负";
            }
            var currencyDigits = amt.replace(",", "");
            currencyDigits = currencyDigits.replace(/,/g, "");
            currencyDigits = currencyDigits.replace(/^0+/, "");
            parts = currencyDigits.split(".");
            if (parts.length > 1) {
                integral = parts[0];
                decimal = parts[1];
                decimal = decimal.substr(0, 2);
            } else {
                integral = parts[0];
                decimal = "";
            }
            digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
            radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
            bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION, CN_TEN_THOUSAND_HUNDRED_MILLION);
            decimals = new Array(CN_TEN_CENT, CN_CENT);
            outputCharacters = "";
            if (Number(integral) > 0) {
                zeroCount = 0;
                for (i = 0; i < integral.length; i++) {
                    p = integral.length - i - 1;
                    d = integral.substr(i, 1);
                    quotient = p / 4;
                    modulus = p % 4;
                    if (d == "0") {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            outputCharacters += digits[0];
                        }
                        zeroCount = 0;
                        outputCharacters += digits[Number(d)] + radices[modulus];
                    }
                    if (modulus == 0 && zeroCount < 4) {
                        outputCharacters += bigRadices[quotient];
                    }
                }
                outputCharacters += CN_DOLLAR;
            }
            if (decimal != "") {
                for (i = 0; i < decimal.length; i++) {
                    d = decimal.substr(i, 1);
                    if (d != "0") {
                        outputCharacters += digits[Number(d)] + decimals[i];
                    }
                }
            }
            if (outputCharacters == "") {
                outputCharacters = CN_ZERO + CN_DOLLAR;
            }
            if (decimal == "") {
                outputCharacters += CN_INTEGER;
            }
            outputCharacters = CN_SYMBOL + outputCharacters;
            chineseStr = symbol + outputCharacters;
        }
        return chineseStr;
    };
    module.exports = {
        moneyToNumber: moneyToNumber,
        numberToMoney: numberToMoney,
        numToChinese: numToChinese,
        bindBlur: bindBlur
    };
}, {});

define("#/xyz-util/0.1.54/path-debug", [], function(require, exports, module, installOption) {
    var CHAR_FORWARD_SLASH = 47, CHAR_BACKWARD_SLASH = 92, CHAR_DOT = 46;
    function isPathSeparator(code) {
        return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    }
    function isPosixPathSeparator(code) {
        return code === CHAR_FORWARD_SLASH;
    }
    function normalize(path) {
        if (path.length === 0) return ".";
        var isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        var trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
        // Normalize the path
        path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
        if (path.length === 0 && !isAbsolute) path = ".";
        if (path.length > 0 && trailingSeparator) path += "/";
        if (isAbsolute) return "/" + path;
        return path;
    }
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
        var res = "";
        var lastSegmentLength = 0;
        var lastSlash = -1;
        var dots = 0;
        var code;
        for (var i = 0; i <= path.length; ++i) {
            if (i < path.length) code = path.charCodeAt(i); else if (isPathSeparator(code)) break; else code = CHAR_FORWARD_SLASH;
            if (isPathSeparator(code)) {
                if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
                        if (res.length > 2) {
                            var lastSlashIndex = res.lastIndexOf(separator);
                            if (lastSlashIndex !== res.length - 1) {
                                if (lastSlashIndex === -1) {
                                    res = "";
                                    lastSegmentLength = 0;
                                } else {
                                    res = res.slice(0, lastSlashIndex);
                                    lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                                }
                                lastSlash = i;
                                dots = 0;
                                continue;
                            }
                        } else if (res.length === 2 || res.length === 1) {
                            res = "";
                            lastSegmentLength = 0;
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0) res += "${separator}.."; else res = "..";
                        lastSegmentLength = 2;
                    }
                } else {
                    if (res.length > 0) res += separator + path.slice(lastSlash + 1, i); else res = path.slice(lastSlash + 1, i);
                    lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
            } else if (code === CHAR_DOT && dots !== -1) {
                ++dots;
            } else {
                dots = -1;
            }
        }
        return res;
    }
    var join = function() {
        if (arguments.length === 0) return ".";
        var sep = arguments[0].indexOf("/") > -1 ? "/" : "\\";
        var joined;
        var firstPart;
        for (var i = 0; i < arguments.length; ++i) {
            var arg = arguments[i];
            if (arg.length > 0) {
                if (joined === undefined) joined = firstPart = arg; else joined += sep + arg;
            }
        }
        if (joined === undefined) return ".";
        var needsReplace = true;
        var slashCount = 0;
        if (isPathSeparator(firstPart.charCodeAt(0))) {
            ++slashCount;
            var firstLen = firstPart.length;
            if (firstLen > 1) {
                if (isPathSeparator(firstPart.charCodeAt(1))) {
                    ++slashCount;
                    if (firstLen > 2) {
                        if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount; else {
                            // We matched a UNC path in the first part
                            needsReplace = false;
                        }
                    }
                }
            }
        }
        if (needsReplace) {
            // Find any more consecutive slashes we need to replace
            for (;slashCount < joined.length; ++slashCount) {
                if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
            }
            // Replace the slashes if needed
            if (slashCount >= 2) joined = sep + joined.slice(slashCount);
        }
        return normalize(joined);
    };
    module.exports = join;
}, {});

define("#/xyz-util/0.1.54/url-debug", [ "./path-debug" ], function(require, exports, module, installOption) {
    var pathJoin = require("./path-debug");
    var getBaseUrlPath = function(url) {
        var index = url.indexOf("?");
        if (index === -1) {
            return url;
        }
        return url.substring(0, index);
    };
    var joinUrlParams = function(url, params) {
        var dotIndex = url.lastIndexOf("?");
        var paramsArr = [];
        for (var key in params) {
            paramsArr.push(key + "=" + params[key]);
        }
        var paramsStr = paramsArr.join("&");
        if (dotIndex === -1) {
            url += "?" + paramsStr;
        } else {
            if (dotIndex === url.length - 1) {
                url += paramsStr;
            } else {
                url += "&" + paramsStr;
            }
        }
        return url;
    };
    var urlParse = function(url, pathname) {
        pathname = pathname || location.pathname;
        var index = pathname.indexOf("/release/");
        if (index === -1) {
            return url;
        } else {
            var afterPath = pathname.substring(0, index + 9);
            return pathJoin(afterPath, url);
        }
    };
    module.exports = {
        getBaseUrlPath: getBaseUrlPath,
        joinUrlParams: joinUrlParams,
        urlParse: urlParse
    };
}, {});

define("#/xyz-util/0.1.54/page-debug", [ "#/jquery/jquery-debug", "#/lodash/lodash-debug", "#/observer/observer-debug" ], function(require, exports, module, installOption) {
    var $ = require("#/jquery/jquery-debug"), _ = require("#/lodash/lodash-debug"), observer = require("#/observer/observer-debug");
    //全屏方法
    var fullScreen = function(el) {
        if (el) {
            if (_.isFunction(el.get)) {
                el = el.get(0);
            } else if (_.isString(el)) {
                el = $(el).get(0);
            }
        } else {
            el = document.documentElement;
        }
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs !== "undefined" && rfs) {
            rfs.call(el);
        }
        observer.trigger("xyz-util:fullScreen", el);
        $(window).on("resize:fullScreenExit", function() {
            var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
            if (isFull) {
                observer.trigger("xyz-util:fullScreenExit", el);
            }
            $(window).off("resize:fullScreenExit");
        });
    };
    //监听容器大小变化事件
    var resizeTimer = null;
    var resizeCache = {};
    //    {height, width}
    var resizeDom = function(opt) {
        var callback = opt.callback;
        var delay = _.isNumber(opt.delay) ? opt.delay : 200;
        var eventName = opt.eventName;
        var el = opt.el;
        el = typeof el === "string" ? $(el) : el;
        //支持传入字符串或jquery对象
        var resizeEventName = "resize." + eventName;
        if (resizeCache[eventName]) {
            $(window).off(resizeEventName);
        }
        var height = el.height();
        var width = el.width();
        resizeCache[eventName] = {
            height: height,
            width: width
        };
        $(window).on(resizeEventName, function(e) {
            var curHeight = el.height();
            var curWidth = el.width();
            if (height !== curHeight || width !== curWidth) {
                if (resizeTimer !== null) {
                    clearTimeout(resizeTimer);
                    resizeTimer = null;
                }
                resizeTimer = setTimeout(function() {
                    callback(e);
                }, delay);
            }
        });
    };
    var getScreenHeight = function() {
        return document.documentElement.clientHeight;
    };
    var getScreenWidth = function() {
        return document.documentElement.clientWidth;
    };
    var getDomObj = function(el) {
        var domObj;
        if (_.isString(el)) {
            domObj = $(el).get(0);
        } else if (el.get) {
            domObj = el.get(0);
        } else {
            domObj = el;
        }
        return domObj;
    };
    var destroyIframe = function(el, removeEl) {
        var iframe = getDomObj(el);
        if (!iframe) {
            return;
        }
        iframe.src = "about:blank";
        try {
            iframe.contentWindow.document.write("");
            iframe.contentWindow.document.clear();
            //把iframe从页面移除
            if (removeEl) {
                iframe.parentNode.removeChild(iframe);
            }
        } catch (e) {}
    };
    var isIE = function() {
        var ie = isOnlyIE();
        var edge = isEdge();
        if (ie || edge) {
            return true;
        }
        return false;
    };
    var isEdge = function() {
        var userAgent = navigator.userAgent || "";
        var ua = userAgent.toLocaleLowerCase();
        return ua.indexOf("edge") > -1;
    };
    var isOnlyIE = function() {
        var userAgent = navigator.userAgent || "";
        var ua = userAgent.toLocaleLowerCase();
        var hasIeUa = ua.indexOf("msie") !== -1;
        var ie = window.ActiveXObject || "ActiveXObject" in window || hasIeUa;
        return ie;
    };
    module.exports = {
        fullScreen: fullScreen,
        resizeDom: resizeDom,
        getScreenWidth: getScreenWidth,
        getScreenHeight: getScreenHeight,
        getDomObj: getDomObj,
        destroyIframe: destroyIframe,
        isIE: isIE,
        isEdge: isEdge,
        isOnlyIE: isOnlyIE
    };
}, {});