define("#/xyz-coverlap/0.1.31/xyz-coverlap-debug", [ "#/jquery/jquery-debug", "#/xyz-util/xyz-util-debug", "#/observer/observer-debug", "#/stringformat/stringformat-debug", "#/xyz-iconfont/xyz-iconfont-debug" ], function(require, exports, module, installOption) {
    var $ = require("#/jquery/jquery-debug"), xyzUtil = require("#/xyz-util/xyz-util-debug"), observer = require("#/observer/observer-debug"), format = require("#/stringformat/stringformat-debug");
    var mainTpl = '<div class="coverlap coverlap_iframe coverlap_div xyz_coverlap {2}" tabindex="_1" id="{0}" style="z-index:{1};">\n    <div class="portlet" id="coverlap_{0}">\n        <div class="portlet-title">\n            <div class="coverlap-header">\n                <div class="top-return">\n                    <a class="return-btn {4}" data-dismiss="coverlap">\n                        <i class="xy-icon xy-topreturn coverlap_return_img"></i>\n                        <span>返回</span>\n                    </a>\n                    <div class="self_title">{3}</div>\n                </div>\n            </div>\n        </div>\n        <div class="portlet-body">\n            <iframe id="coverlap_iframe_{0}" class="coverlap_iframe" frameborder="0"></iframe>\n        </div>\n    </div>\n</div>', mainModuleTpl = '<div class="coverlap coverlap_iframe coverlap_div xyz_coverlap {2}" tabindex="_1" id="{0}" style="z-index:{1};">\n    <div class="portlet" id="coverlap_{0}">\n        <div class="portlet-title">\n            <div class="coverlap-header">\n                <div class="top-return">\n                    <a class="return-btn {4}" data-dismiss="coverlap">\n                        <i class="xy-icon xy-topreturn coverlap_return_img"></i>\n                        <span>返回</span>\n                    </a>\n					<div class="self_title">{3}</div>\n                </div>\n            </div>\n        </div>\n        <div class="portlet-body" id="body_{0}">\n        </div>\n    </div>\n</div>';
    null;
    //模块内如需引入scss时，打开注释
    require("#/xyz-iconfont/xyz-iconfont-debug");
    var zIndex = 10;
    //初始化为10， 每初始化一个coverlap，做递增。保证最新的优先级最高
    var Coverlap = function(options) {
        this.initialize(options);
    };
    Coverlap.prototype = {
        initialize: function(options) {
            this.id = options.id || xyzUtil.generateId();
            this.title = options.title || "";
            this.returnbtn = options.returnbtn === false ? false : true;
            this.domId = "xyz_coverlap_" + this.id;
            this.destroy = options.destroy === undefined ? true : options.destroy;
            //点击返回按钮是否执行销毁，默认true
            this.onLoad = options.onLoad;
            this.onShow = options.onShow;
            this.onHide = options.onHide;
            this.onDispose = options.onDispose;
            if (options.child !== undefined) {
                this.child = options.child;
            } else {
                this.remote = this._writeDirect(options.remote);
            }
        },
        render: function() {
            var domId = this.domId;
            var domTitle = this.title;
            var show = this.returnbtn;
            if (!show) {
                show = "hide";
            }
            var html;
            var styleVersion = seajs && seajs.pluginSDK && seajs.pluginSDK.config && seajs.pluginSDK.config.style_version;
            var styleClass = "";
            if (styleVersion) {
                styleClass = "style_v" + styleVersion;
            }
            if (this.child !== undefined) {
                html = format(mainModuleTpl, domId, zIndex, styleClass, domTitle, show);
            } else {
                html = format(mainTpl, domId, zIndex, styleClass, domTitle, show);
            }
            zIndex++;
            $("body").append(html);
            this.$element = $("#" + domId);
            this._load();
            this._isShow = true;
            if (!window.XyzCoverlap) {
                window.XyzCoverlap = {};
            }
            window.XyzCoverlap[this.id] = this;
        },
        dispose: function(isBackClick) {
            isBackClick = isBackClick || false;
            this._destory(isBackClick);
            if (window.XyzCoverlap) {
                delete window.XyzCoverlap[this.id];
            }
        }
    };
    Coverlap.prototype._writeDirect = function(remote) {
        if (!remote || typeof remote !== "string") {
            throw "xyz-coverlap: 请设置url地址到remote参数中";
        }
        if (remote && remote.indexOf("_func_code") === -1) {
            if (remote.indexOf("?") === -1) {
                remote = remote + "?_func_code=" + xyzUtil.getFuncCode();
            } else {
                remote = remote + "&_func_code=" + xyzUtil.getFuncCode();
            }
        }
        return remote;
    };
    Coverlap.prototype._load = function() {
        var $ele = this.$element;
        var that = this;
        $ele.on("click.dismiss.bs.coverlap", '[data-dismiss="coverlap"]', function() {
            if (that.destroy === true) {
                that.dispose(true);
            } else {
                that.hide(true);
            }
        });
        this._bodyDom = $("body");
        var sourceCss = this._bodyDom.css("overflow");
        this._bodyOverflowSource = sourceCss === "hidden" ? "hidden" : "auto";
        if (this.child !== undefined) {
            var childOpt = this.child;
            //{path: '', option: {}}
            require.async(this.child.path, function(ChildObj) {
                var opt = {
                    el: "#body_xyz_coverlap_" + that.id
                };
                $.extend(opt, childOpt.options || {});
                var co = new ChildObj(opt);
                co.render();
                that.childObj = co;
                that._operateBodyScroll(true);
            });
        } else {
            var iframeDom = $("#coverlap_iframe_xyz_coverlap_" + this.id);
            iframeDom.on("load", function() {
                if (that.onLoad) {
                    that.onLoad();
                }
            });
            iframeDom.attr("src", this.remote);
            this._operateBodyScroll(true);
        }
        this.show();
    };
    Coverlap.prototype._operateBodyScroll = function(show) {
        if (show) {
            //coverlap显示出来， 将body的overflow设为hidden
            this._bodyDom.css("overflow", "hidden");
        } else {
            this._bodyDom.css("overflow", this._bodyOverflowSource);
        }
        observer.trigger("xyz-datatables:adjust");
    };
    Coverlap.prototype._destory = function(isBackClick) {
        // 解决IE页面卡的问题
        var iframe = $("#coverlap_iframe_" + this.domId);
        if (iframe.length) {
            //仅对iframe模式做销毁
            xyzUtil.destroyIframe(iframe, true);
        }
        if (this.childObj && this.childObj.dispose) {
            this.childObj.dispose();
        }
        this.$element.remove();
        if (this.onDispose) {
            this.onDispose(isBackClick);
        }
        this._operateBodyScroll();
    };
    Coverlap.prototype.toggle = function() {
        if (this._isShow === true) {
            this.hide();
        } else {
            this.show();
        }
    };
    Coverlap.prototype.show = function() {
        this.$element.show().scrollTop(0);
        this._isShow = true;
        if (this.onShow) {
            this.onShow();
        }
        this._operateBodyScroll(true);
    };
    Coverlap.prototype.hide = function(isBackClick) {
        this.$element.hide();
        this._isShow = false;
        if (this.onHide) {
            this.onHide(isBackClick);
        }
        this._operateBodyScroll();
    };
    Coverlap.prototype.getId = function() {
        return this.id;
    };
    Coverlap.prototype.setEvent = function(eventName, callback) {
        if (eventName === "onLoad" || eventName === "onHide" || eventName === "onShow" || eventName === "onDispose") {
            this[eventName] = callback;
        }
    };
    module.exports = Coverlap;
}, {});