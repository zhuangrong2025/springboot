define("#/shine-step/0.1.2/shine-step-debug", [ "#/jquery/jquery-debug", "#/lodash/lodash-debug", "#/xyz-component-base/xyz-component-base-debug", "#/stringformat/stringformat-debug", "#/base-style-manage/base-style-manage-debug" ], function(require, exports, module, installOption) {
    var $ = require("#/jquery/jquery-debug"), _ = require("#/lodash/lodash-debug"), ComponentBase = require("#/xyz-component-base/xyz-component-base-debug"), format = require("#/stringformat/stringformat-debug");
    require("#/base-style-manage/base-style-manage-debug");
    null;
    //模块内如需引入scss时，打开注释
    var mainTpl = '<ul class="shine-steps"></ul>\n<div class="shine-steps-content"></div>\n<div class="shine-steps-button"></div>', liTpl = '<li class="shine-step {0} {1} {2}" li_id="{3}">\n    <a href="javascript:void(0)">\n        <div class="shine-step-num">{4}</div>\n        <div class="shine-step-title">{5}</div>\n    </a>\n</li>', buttonTpl = '<button class="btn {0} {1}">{2}</button>', divTpl = '<div class="shine-step-content {0}" id="{1}"></div>';
    var ShineStep = ComponentBase.extend({
        constructor: function(options) {
            ShineStep.superclass.constructor.call(this, options);
            this.initialize(options);
        },
        initialize: function(options) {
            var el = options.el;
            el = typeof el === "string" ? $(el) : el;
            //支持传入字符串或jquery对象
            this.el = el;
            var sourceConfig = options.config || [];
            var config = _.uniq(sourceConfig, "id");
            this.config = config;
            this.active = options.active;
            this.index = options.index === undefined ? true : options.index;
            this.events = options.events || {};
            this.buttons = options.buttons;
            this.modCache = {};
        },
        render: function() {
            this.el.html(mainTpl);
            this._renderContent();
        },
        dispose: function() {
            var modCache = this.modCache || {};
            for (var id in modCache) {
                if (modCache[id] && modCache[id].modObj) {
                    modCache[id].modObj.dispose();
                }
            }
            this.el.empty();
            this.modCache = {};
        },
        refresh: function() {
            this.dispose();
            this.render();
        }
    });
    ShineStep.prototype._renderContent = function() {
        var config = this.config;
        var liArr = [];
        var contentArr = [];
        var activeIndex;
        var outActive = this.active;
        if (outActive && _.isNumber(outActive) && outActive >= 0) {
            //外部设置了active， 优先级最高
            var formatConfig = [];
            _.each(config, function(cObj, k) {
                if (k === outActive) {
                    cObj.active = true;
                } else {
                    cObj.active = false;
                }
                formatConfig.push(cObj);
            });
            activeIndex = outActive;
            config = formatConfig;
            this.config = config;
        } else {
            activeIndex = _.findIndex(config, function(_c) {
                return _c.active === true;
            });
            activeIndex = activeIndex < 0 ? 0 : activeIndex;
        }
        var activeChild = null;
        var isIndex = this.index;
        //是否需要数字
        var that = this;
        _.each(config, function(_cObj, k) {
            var _id = _cObj.id;
            var _title = _cObj.title;
            var _icon = _cObj.icon || [];
            var _path = "";
            var _isAct = k === activeIndex;
            var _process = k < activeIndex ? "process" : "";
            var _activeStr = _isAct ? "active" : "";
            var _finish = _cObj.finish === true ? "finish" : "";
            var _child = _cObj.child;
            that.modCache[_id] = {
                loaded: _isAct
            };
            if (_isAct) {
                activeChild = {
                    id: _id,
                    child: _child
                };
            }
            if (_child) {
                _path = _child.path;
                that.modCache[_id].options = _child.options || {};
                that.modCache[_id].refresh = _child.refresh || false;
                that.modCache[_id].path = _path;
            }
            var liHtml = format(liTpl, _activeStr, _process, _finish, _id, k + 1, _title);
            var divHtml = format(divTpl, _activeStr, _id);
            liArr.push(liHtml);
            contentArr.push(divHtml);
        });
        this.el.find(".shine-steps").html(liArr.join(""));
        if (config.length !== 4) {
            //设置步骤条宽度，默认每项25%
            this.el.find(".shine-steps>.shine-step").css("width", parseInt(100 / config.length, 10) + "%");
        }
        this.el.find(".shine-steps-content").html(contentArr.join(""));
        if (activeChild) {
            this._renderChild(activeChild.id, activeChild.child);
        }
        this._renderButtons();
        this._bindEvents();
    };
    var buttonsDef = {
        cancel: {
            type: "cancel",
            title: "取消",
            cls: "btn-cancel-lv1"
        },
        prev: {
            type: "prev",
            title: "上一步",
            cls: "btn-action-lv2 hide"
        },
        presave: {
            type: "presave",
            title: "保存, 后续完善",
            cls: "btn-view-lv1 hide"
        },
        save: {
            type: "save",
            title: "保存",
            cls: "btn-action-lv1 hide"
        },
        next: {
            type: "next",
            title: "下一步",
            cls: "btn-action-lv1"
        }
    };
    ShineStep.prototype._renderButtons = function() {
        var buttons = [];
        if (this.buttons === true) {
            this.buttons = [ "cancel", "prev", "save", "next" ];
        }
        if (_.isArray(this.buttons)) {
            _.each(this.buttons, function(btn) {
                if (_.isString(btn)) {
                    buttons.push(_.assign({}, buttonsDef[btn]));
                } else {
                    buttons.push(_.assign(buttonsDef[btn.type], btn));
                }
            });
        }
        var presaveIndex = _.findIndex(buttons, function(btn) {
            return btn.type === "presave";
        });
        if (presaveIndex !== -1) {
            this.presaveButton = buttons[presaveIndex];
        }
        if (buttons.length) {
            var btnArr = [];
            _.each(buttons, function(btn) {
                var btnHtml = format(buttonTpl, btn.cls, btn.type, btn.title);
                btnArr.push(btnHtml);
            });
            this.el.find(".shine-steps-button").html(btnArr.join(""));
            this._refreshButtons();
        }
    };
    ShineStep.prototype._bindEvents = function() {
        var that = this;
        //事件绑定
        if (this.events) {
            _.forEach(this.events, function(fn, key) {
                that.on(key, fn, that);
            });
        }
        this.el.find(".shine-step").click(function(e) {
            var selfDom = $(this);
            if (selfDom.hasClass("active")) {
                return false;
            }
            var _id = selfDom.attr("li_id");
            return that.activeById(_id, true);
        });
        if (this.buttons) {
            var buttonContent = this.el.find(".shine-steps-button");
            buttonContent.find(".btn.next").click(function() {
                var index = that.getCurrentCheckIndex();
                that.activeByIndex(index + 1);
            });
            buttonContent.find(".btn.prev").click(function() {
                var index = that.getCurrentCheckIndex();
                that.activeByIndex(index - 1);
            });
            buttonContent.find(".btn.save").click(function() {
                that.emit("save", that);
            });
            buttonContent.find(".btn.presave").click(function() {
                that.emit("presave", that.getCurrentCheckIndex(), that.getCurrentCheckId(), that);
            });
            buttonContent.find(".btn.cancel").click(function() {
                that.emit("cancel", that);
            });
        }
    };
    ShineStep.prototype._renderChild = function(id, childObj) {
        if (childObj) {
            if (this.modCache[id] && this.modCache[id].modObj) {
                //如果当前页已初始化过
                if (this.modCache[id].refresh === true) {
                    //刷新模块
                    var modObj = this.modCache[id].modObj;
                    if (modObj.refresh) {
                        modObj.refresh();
                    } else {
                        if (modObj.dispose) {
                            modObj.dispose();
                        }
                        modObj.render();
                    }
                }
            } else {
                var childPath = childObj.path;
                var that = this;
                require.async(childPath, function(ChildMod) {
                    if (!ChildMod) {
                        throw "无法获取子模块! path: " + childPath;
                    }
                    var opt = {
                        el: "#" + id
                    };
                    var options = childObj.options;
                    if (_.isFunction(options)) {
                        options = options();
                    }
                    _.extend(opt, options || {});
                    var cm = new ChildMod(opt);
                    cm.render();
                    that.modCache[id].modObj = cm;
                });
            }
        }
        this.modCache[id].loaded = true;
    };
    ShineStep.prototype._isSameActive = function(id) {
        var activeContentDom = this.el.find(".shine-step-content.active");
        var curId = activeContentDom.attr("id");
        if (id === curId) {
            return true;
        }
        return false;
    };
    ShineStep.prototype._active = function(id) {
        if (this._isSameActive(id)) {
            return;
        }
        this.el.find(".shine-step.active").removeClass("active");
        this.el.find(".shine-step-content.active").removeClass("active");
        var className = format(".shine-step[li_id={0}]", id);
        var activeStep = this.el.find(className);
        activeStep.addClass("active");
        activeStep.prevAll().addClass("process");
        activeStep.nextAll().removeClass("process");
        $(".shine-step-content#" + id).addClass("active");
        if (this.buttons) {
            this._refreshButtons();
        }
    };
    ShineStep.prototype._refreshButtons = function(id) {
        var activeIndex = this.getCurrentCheckIndex(), len = this.config.length, buttonsShow = {};
        buttonsShow.prev = activeIndex > 0 ? true : false;
        //上一步是否显示
        buttonsShow.next = activeIndex < len - 1 ? true : false;
        //下一步是否显示
        buttonsShow.save = activeIndex === len - 1 ? true : false;
        //保存是否显示
        if (this.presaveButton && _.isArray(this.presaveButton.scope)) {
            //保存后续完善的按扭,根据设置的适用步骤来显示
            //保存后续完善是否显示, 保存按扭显示的时候不显示该按扭
            buttonsShow.presave = buttonsShow.save === true ? false : _.indexOf(this.presaveButton.scope, activeIndex) !== -1 ? true : false;
        }
        var buttonContent = this.el.find(".shine-steps-button");
        _.each(buttonsShow, function(show, type) {
            var $btn = buttonContent.find(".btn." + type);
            if (show === true) {
                $btn.removeClass("hide");
            } else {
                $btn.addClass("hide");
            }
        });
    };
    ShineStep.prototype.getInstanceById = function(id) {
        return this.modCache[id] && this.modCache[id].modObj;
    };
    ShineStep.prototype.activeById = function(_id, self) {
        if (this._isSameActive(_id)) {
            return;
        }
        var events = this.events;
        var beforeChange = events.beforeChange;
        var change = events.change;
        var that = this;
        var finishStatus = that.isFinishStatus(_id);
        self = self === undefined ? false : self;
        var changeCallback = function() {
            that._active(_id);
            var cacheObj = that.modCache[_id];
            that._renderChild(_id, cacheObj);
            if (change) {
                change(_id, self, finishStatus, that);
            }
        };
        if (beforeChange) {
            beforeChange(_id, self, finishStatus, that, function() {
                changeCallback();
            });
        } else {
            changeCallback();
        }
    };
    ShineStep.prototype.activeByIndex = function(index) {
        var config = this.config;
        var id = config[index].id;
        this.activeById(id, false);
    };
    ShineStep.prototype.getCurrentCheckId = function() {
        return this.el.find(".shine-step.active").attr("li_id");
    };
    ShineStep.prototype.getCurrentCheckIndex = function() {
        var id = this.getCurrentCheckId();
        var config = this.config;
        return _.findIndex(config, function(_c) {
            return _c.id === id;
        });
    };
    ShineStep.prototype.setFinishStatus = function(idList) {
        if (_.isString(idList)) {
            idList = idList.split(",");
        }
        var that = this;
        _.each(idList, function(id) {
            var className = format(".shine-step[li_id={0}]", id);
            that.el.find(className).addClass("finish");
        });
    };
    ShineStep.prototype.removeFinishStatus = function(idList) {
        if (_.isString(idList)) {
            idList = idList.split(",");
        }
        var that = this;
        _.each(idList, function(id) {
            var className = format(".shine-step[li_id={0}]", id);
            that.el.find(className).removeClass("finish");
        });
    };
    ShineStep.prototype.getFinishStatus = function() {
        var finishResult = [];
        $.each(this.el.find(".shine-step.finish"), function(k, dom) {
            var _id = $(dom).attr("li_id");
            finishResult.push(_id);
        });
        return finishResult;
    };
    ShineStep.prototype.isFinishStatus = function(id) {
        var className = format(".shine-step[li_id={0}]", id);
        return this.el.find(className).hasClass("finish");
    };
    module.exports = ShineStep;
}, {});