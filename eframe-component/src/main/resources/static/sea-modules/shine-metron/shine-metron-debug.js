define("#/shine-metron/0.1.21/shine-metron-debug", [ "#/bootstrap/bootstrap-debug", "./jquery-slimscroll-debug", "./jquery-blockui-debug", "./app-debug", "./layout-debug", "./layer-debug" ], function(require, exports, module, installOption) {
    var ShineMetron = {
        loaded: false,
        App: {},
        init: function($) {
            require("#/bootstrap/bootstrap-debug")($);
            null;
            //metronic组件样式
            null;
            //metronic插件样式
            null;
            //metronic布局样式
            null;
            //metronic主题样式
            require("./jquery-slimscroll-debug")($);
            require("./jquery-blockui-debug")($);
            var App = require("./app-debug")($);
            this.App = App;
            require("./layout-debug")($, App);
            require("./layer-debug")($);
        }
    };
    module.exports = function($) {
        if (ShineMetron.loaded === true) {
            return ShineMetron.App;
        }
        ShineMetron.init($);
        ShineMetron.loaded = true;
        return ShineMetron.App;
    };
}, {});

define("#/shine-metron/0.1.21/jquery-slimscroll-debug", [], function(require, exports, module, installOption) {
    /*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.2
 *
 */
    module.exports = function(jQuery) {
        (function($) {
            jQuery.fn.extend({
                slimScroll: function(options) {
                    var defaults = {
                        // width in pixels of the visible scroll area
                        width: "auto",
                        // height in pixels of the visible scroll area
                        height: "250px",
                        // width in pixels of the scrollbar and rail
                        size: "7px",
                        // scrollbar color, accepts any hex/color value
                        color: "#000",
                        // scrollbar position - left/right
                        position: "right",
                        // distance in pixels between the side edge and the scrollbar
                        distance: "1px",
                        // default scroll position on load - top / bottom / $('selector')
                        start: "top",
                        // sets scrollbar opacity
                        opacity: .4,
                        // enables always-on mode for the scrollbar
                        alwaysVisible: false,
                        // check if we should hide the scrollbar when user is hovering over
                        disableFadeOut: false,
                        // sets visibility of the rail
                        railVisible: false,
                        // sets rail color
                        railColor: "#333",
                        // sets rail opacity
                        railOpacity: .2,
                        // whether  we should use jQuery UI Draggable to enable bar dragging
                        railDraggable: true,
                        // defautlt CSS class of the slimscroll rail
                        railClass: "slimScrollRail",
                        // defautlt CSS class of the slimscroll bar
                        barClass: "slimScrollBar",
                        // defautlt CSS class of the slimscroll wrapper
                        wrapperClass: "slimScrollDiv",
                        // check if mousewheel should scroll the window if we reach top/bottom
                        allowPageScroll: false,
                        // scroll amount applied to each mouse wheel step
                        wheelStep: 20,
                        // scroll amount applied when user is using gestures
                        touchScrollStep: 200,
                        // sets border radius
                        borderRadius: "7px",
                        // sets border radius of the rail
                        railBorderRadius: "7px",
                        // sets animation status on a given scroll(added my keenthemes)
                        animate: true
                    };
                    var o = $.extend(defaults, options);
                    // do it for every element that matches selector
                    this.each(function() {
                        var isOverPanel, isOverBar, isDragg, queueHide, touchDif, barHeight, percentScroll, lastScroll, divS = "<div></div>", minBarHeight = 30, releaseScroll = false;
                        // used in event handlers and for better minification
                        var me = $(this);
                        //begin: windows phone fix added by keenthemes
                        if ("ontouchstart" in window && window.navigator.msPointerEnabled) {
                            me.css("-ms-touch-action", "none");
                        }
                        //end: windows phone fix added by keenthemes
                        // ensure we are not binding it again
                        if (me.parent().hasClass(o.wrapperClass)) {
                            // start from last bar position
                            var offset = me.scrollTop();
                            // find bar and rail
                            bar = me.parent().find("." + o.barClass);
                            rail = me.parent().find("." + o.railClass);
                            getBarHeight();
                            // check if we should scroll existing instance
                            if ($.isPlainObject(options)) {
                                // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
                                if ("height" in options && options.height == "auto") {
                                    me.parent().css("height", "auto");
                                    me.css("height", "auto");
                                    var height = me.parent().parent().height();
                                    me.parent().css("height", height);
                                    me.css("height", height);
                                }
                                if ("scrollTo" in options) {
                                    // jump to a static point
                                    offset = parseInt(o.scrollTo);
                                } else if ("scrollBy" in options) {
                                    // jump by value pixels
                                    offset += parseInt(o.scrollBy);
                                } else if ("destroy" in options) {
                                    // remove slimscroll elements
                                    bar.remove();
                                    rail.remove();
                                    me.unwrap();
                                    return;
                                }
                                // scroll content by the given offset
                                scrollContent(offset, false, true);
                            }
                            return;
                        }
                        // optionally set height to the parent's height
                        o.height = options.height == "auto" ? me.parent().height() : options.height;
                        // wrap content
                        var wrapper = $(divS).addClass(o.wrapperClass).css({
                            position: "relative",
                            overflow: "hidden",
                            width: o.width,
                            height: o.height
                        });
                        // update style for the div
                        me.css({
                            overflow: "hidden",
                            width: o.width,
                            height: o.height
                        });
                        // create scrollbar rail
                        var rail = $(divS).addClass(o.railClass).css({
                            width: o.size,
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            display: o.alwaysVisible && o.railVisible ? "block" : "none",
                            "border-radius": o.railBorderRadius,
                            background: o.railColor,
                            opacity: o.railOpacity,
                            zIndex: 90
                        });
                        // create scrollbar
                        var bar = $(divS).addClass(o.barClass).css({
                            background: o.color,
                            width: o.size,
                            position: "absolute",
                            top: 0,
                            opacity: o.opacity,
                            display: o.alwaysVisible ? "block" : "none",
                            "border-radius": o.borderRadius,
                            BorderRadius: o.borderRadius,
                            MozBorderRadius: o.borderRadius,
                            WebkitBorderRadius: o.borderRadius,
                            zIndex: 99
                        });
                        // set position
                        var posCss = o.position == "right" ? {
                            right: o.distance
                        } : {
                            left: o.distance
                        };
                        rail.css(posCss);
                        bar.css(posCss);
                        // wrap it
                        me.wrap(wrapper);
                        // append to parent div
                        me.parent().append(bar);
                        me.parent().append(rail);
                        // make it draggable and no longer dependent on the jqueryUI
                        if (o.railDraggable) {
                            bar.bind("mousedown", function(e) {
                                var $doc = $(document);
                                isDragg = true;
                                t = parseFloat(bar.css("top"));
                                pageY = e.pageY;
                                $doc.bind("mousemove.slimscroll", function(e) {
                                    currTop = t + e.pageY - pageY;
                                    bar.css("top", currTop);
                                    scrollContent(0, bar.position().top, false);
                                });
                                $doc.bind("mouseup.slimscroll", function(e) {
                                    isDragg = false;
                                    hideBar();
                                    $doc.unbind(".slimscroll");
                                });
                                return false;
                            }).bind("selectstart.slimscroll", function(e) {
                                e.stopPropagation();
                                e.preventDefault();
                                return false;
                            });
                        }
                        //begin: windows phone fix added by keenthemes
                        if ("ontouchstart" in window && window.navigator.msPointerEnabled) {
                            me.bind("MSPointerDown", function(e, b) {
                                // record where touch started
                                touchDif = e.originalEvent.pageY;
                            });
                            me.bind("MSPointerMove", function(e) {
                                // prevent scrolling the page if necessary
                                e.originalEvent.preventDefault();
                                // see how far user swiped
                                var diff = (touchDif - e.originalEvent.pageY) / o.touchScrollStep;
                                // scroll content
                                scrollContent(diff, true);
                                touchDif = e.originalEvent.pageY;
                            });
                        }
                        //end: windows phone fix added by keenthemes
                        // on rail over
                        rail.hover(function() {
                            showBar();
                        }, function() {
                            hideBar();
                        });
                        // on bar over
                        bar.hover(function() {
                            isOverBar = true;
                        }, function() {
                            isOverBar = false;
                        });
                        // show on parent mouseover
                        me.hover(function() {
                            isOverPanel = true;
                            showBar();
                            hideBar();
                        }, function() {
                            isOverPanel = false;
                            hideBar();
                        });
                        // support for mobile
                        me.bind("touchstart", function(e, b) {
                            if (e.originalEvent.touches.length) {
                                // record where touch started
                                touchDif = e.originalEvent.touches[0].pageY;
                            }
                        });
                        me.bind("touchmove", function(e) {
                            // prevent scrolling the page if necessary
                            if (!releaseScroll) {
                                e.originalEvent.preventDefault();
                            }
                            if (e.originalEvent.touches.length) {
                                // see how far user swiped
                                var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
                                // scroll content
                                scrollContent(diff, true);
                                touchDif = e.originalEvent.touches[0].pageY;
                            }
                        });
                        // set up initial height
                        getBarHeight();
                        // check start position
                        if (o.start === "bottom") {
                            // scroll content to bottom
                            bar.css({
                                top: me.outerHeight() - bar.outerHeight()
                            });
                            scrollContent(0, true);
                        } else if (o.start !== "top") {
                            // assume jQuery selector
                            scrollContent($(o.start).position().top, null, true);
                            // make sure bar stays hidden
                            if (!o.alwaysVisible) {
                                bar.hide();
                            }
                        }
                        // attach scroll events
                        attachWheel();
                        function _onWheel(e) {
                            // use mouse wheel only when mouse is over
                            if (!isOverPanel) {
                                return;
                            }
                            var e = e || window.event;
                            var delta = 0;
                            if (e.wheelDelta) {
                                delta = -e.wheelDelta / 120;
                            }
                            if (e.detail) {
                                delta = e.detail / 3;
                            }
                            var target = e.target || e.srcTarget || e.srcElement;
                            if ($(target).closest("." + o.wrapperClass).is(me.parent())) {
                                // scroll content
                                scrollContent(delta, true);
                            }
                            // stop window scroll
                            if (e.preventDefault && !releaseScroll) {
                                e.preventDefault();
                            }
                            if (!releaseScroll) {
                                e.returnValue = false;
                            }
                        }
                        function scrollContent(y, isWheel, isJump) {
                            releaseScroll = false;
                            var delta = y;
                            var maxTop = me.outerHeight() - bar.outerHeight();
                            if (isWheel) {
                                // move bar with mouse wheel
                                delta = parseInt(bar.css("top")) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();
                                // move bar, make sure it doesn't go out
                                delta = Math.min(Math.max(delta, 0), maxTop);
                                // if scrolling down, make sure a fractional change to the
                                // scroll position isn't rounded away when the scrollbar's CSS is set
                                // this flooring of delta would happened automatically when
                                // bar.css is set below, but we floor here for clarity
                                delta = y > 0 ? Math.ceil(delta) : Math.floor(delta);
                                // scroll the scrollbar
                                bar.css({
                                    top: delta + "px"
                                });
                            }
                            // calculate actual scroll amount
                            percentScroll = parseInt(bar.css("top")) / (me.outerHeight() - bar.outerHeight());
                            delta = percentScroll * (me[0].scrollHeight - me.outerHeight());
                            if (isJump) {
                                delta = y;
                                var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
                                offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
                                bar.css({
                                    top: offsetTop + "px"
                                });
                            }
                            // scroll content
                            if ("scrollTo" in o && o.animate) {
                                me.animate({
                                    scrollTop: delta
                                });
                            } else {
                                me.scrollTop(delta);
                            }
                            // fire scrolling event
                            me.trigger("slimscrolling", ~~delta);
                            // ensure bar is visible
                            showBar();
                            // trigger hide when scroll is stopped
                            hideBar();
                        }
                        function attachWheel() {
                            if (window.addEventListener) {
                                this.addEventListener("DOMMouseScroll", _onWheel, false);
                                this.addEventListener("mousewheel", _onWheel, false);
                            } else {
                                document.attachEvent("onmousewheel", _onWheel);
                            }
                        }
                        function getBarHeight() {
                            // calculate scrollbar height and make sure it is not too small
                            barHeight = Math.max(me.outerHeight() / me[0].scrollHeight * me.outerHeight(), minBarHeight);
                            bar.css({
                                height: barHeight + "px"
                            });
                            // hide scrollbar if content is not long enough
                            var display = barHeight == me.outerHeight() ? "none" : "block";
                            bar.css({
                                display: display
                            });
                        }
                        function showBar() {
                            // recalculate bar height
                            getBarHeight();
                            clearTimeout(queueHide);
                            // when bar reached top or bottom
                            if (percentScroll == ~~percentScroll) {
                                //release wheel
                                releaseScroll = o.allowPageScroll;
                                // publish approporiate event
                                if (lastScroll != percentScroll) {
                                    var msg = ~~percentScroll == 0 ? "top" : "bottom";
                                    me.trigger("slimscroll", msg);
                                }
                            } else {
                                releaseScroll = false;
                            }
                            lastScroll = percentScroll;
                            // show only when required
                            if (barHeight >= me.outerHeight()) {
                                //allow window scroll
                                releaseScroll = true;
                                return;
                            }
                            bar.stop(true, true).fadeIn("fast");
                            if (o.railVisible) {
                                rail.stop(true, true).fadeIn("fast");
                            }
                        }
                        function hideBar() {
                            // only hide when options allow it
                            if (!o.alwaysVisible) {
                                queueHide = setTimeout(function() {
                                    if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg) {
                                        bar.fadeOut("slow");
                                        rail.fadeOut("slow");
                                    }
                                }, 1e3);
                            }
                        }
                    });
                    // maintain chainability
                    return this;
                }
            });
            jQuery.fn.extend({
                slimscroll: jQuery.fn.slimScroll
            });
        })(jQuery);
    };
}, {});

define("#/shine-metron/0.1.21/jquery-blockui-debug", [], function(require, exports, module, installOption) {
    /*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */
    module.exports = function(jQuery) {
        (function() {
            /*jshint eqeqeq:false curly:false latedef:false */
            "use strict";
            function setup($) {
                $.fn._fadeIn = $.fn.fadeIn;
                var noOp = $.noop || function() {};
                // this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
                // confusing userAgent strings on Vista)
                var msie = /MSIE/.test(navigator.userAgent);
                var ie6 = /MSIE 6.0/.test(navigator.userAgent) && !/MSIE 8.0/.test(navigator.userAgent);
                var mode = document.documentMode || 0;
                var setExpr = $.isFunction(document.createElement("div").style.setExpression);
                // global $ methods for blocking/unblocking the entire page
                $.blockUI = function(opts) {
                    install(window, opts);
                };
                $.unblockUI = function(opts) {
                    remove(window, opts);
                };
                // convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
                $.growlUI = function(title, message, timeout, onClose) {
                    var $m = $('<div class="growlUI"></div>');
                    if (title) $m.append("<h1>" + title + "</h1>");
                    if (message) $m.append("<h2>" + message + "</h2>");
                    if (timeout === undefined) timeout = 3e3;
                    // Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
                    var callBlock = function(opts) {
                        opts = opts || {};
                        $.blockUI({
                            message: $m,
                            fadeIn: typeof opts.fadeIn !== "undefined" ? opts.fadeIn : 700,
                            fadeOut: typeof opts.fadeOut !== "undefined" ? opts.fadeOut : 1e3,
                            timeout: typeof opts.timeout !== "undefined" ? opts.timeout : timeout,
                            centerY: false,
                            showOverlay: false,
                            onUnblock: onClose,
                            css: $.blockUI.defaults.growlCSS
                        });
                    };
                    callBlock();
                    var nonmousedOpacity = $m.css("opacity");
                    $m.mouseover(function() {
                        callBlock({
                            fadeIn: 0,
                            timeout: 3e4
                        });
                        var displayBlock = $(".blockMsg");
                        displayBlock.stop();
                        // cancel fadeout if it has started
                        displayBlock.fadeTo(300, 1);
                    }).mouseout(function() {
                        $(".blockMsg").fadeOut(1e3);
                    });
                };
                // plugin method for blocking element content
                $.fn.block = function(opts) {
                    if (this[0] === window) {
                        $.blockUI(opts);
                        return this;
                    }
                    var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
                    this.each(function() {
                        var $el = $(this);
                        if (fullOpts.ignoreIfBlocked && $el.data("blockUI.isBlocked")) return;
                        $el.unblock({
                            fadeOut: 0
                        });
                    });
                    return this.each(function() {
                        if ($.css(this, "position") == "static") {
                            this.style.position = "relative";
                            $(this).data("blockUI.static", true);
                        }
                        this.style.zoom = 1;
                        // force 'hasLayout' in ie
                        install(this, opts);
                    });
                };
                // plugin method for unblocking element content
                $.fn.unblock = function(opts) {
                    if (this[0] === window) {
                        $.unblockUI(opts);
                        return this;
                    }
                    return this.each(function() {
                        remove(this, opts);
                    });
                };
                $.blockUI.version = 2.7;
                // 2nd generation blocking at no extra cost!
                // override these in your code to change the default behavior and style
                $.blockUI.defaults = {
                    // message displayed when blocking (use null for no message)
                    message: "<h1>Please wait...</h1>",
                    title: null,
                    // title string; only used when theme == true
                    draggable: true,
                    // only used when theme == true (requires jquery-ui.js to be loaded)
                    theme: false,
                    // set to true to use with jQuery UI themes
                    // styles for the message when blocking; if you wish to disable
                    // these and use an external stylesheet then do this in your code:
                    // $.blockUI.defaults.css = {};
                    css: {
                        padding: 0,
                        margin: 0,
                        width: "30%",
                        top: "40%",
                        left: "35%",
                        textAlign: "center",
                        color: "#000",
                        border: "3px solid #aaa",
                        backgroundColor: "#fff",
                        cursor: "wait"
                    },
                    // minimal style set used when themes are used
                    themedCSS: {
                        width: "30%",
                        top: "40%",
                        left: "35%"
                    },
                    // styles for the overlay
                    overlayCSS: {
                        backgroundColor: "#000",
                        opacity: .6,
                        cursor: "wait"
                    },
                    // style to replace wait cursor before unblocking to correct issue
                    // of lingering wait cursor
                    cursorReset: "default",
                    // styles applied when using $.growlUI
                    growlCSS: {
                        width: "350px",
                        top: "10px",
                        left: "",
                        right: "10px",
                        border: "none",
                        padding: "5px",
                        opacity: .6,
                        cursor: "default",
                        color: "#fff",
                        backgroundColor: "#000",
                        "-webkit-border-radius": "10px",
                        "-moz-border-radius": "10px",
                        "border-radius": "10px"
                    },
                    // IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
                    // (hat tip to Jorge H. N. de Vasconcelos)
                    /*jshint scripturl:true */
                    iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank",
                    // force usage of iframe in non-IE browsers (handy for blocking applets)
                    forceIframe: false,
                    // z-index for the blocking overlay
                    baseZ: 1e3,
                    // set these to true to have the message automatically centered
                    centerX: true,
                    // <-- only effects element blocking (page block controlled via css above)
                    centerY: true,
                    // allow body element to be stetched in ie6; this makes blocking look better
                    // on "short" pages.  disable if you wish to prevent changes to the body height
                    allowBodyStretch: true,
                    // enable if you want key and mouse events to be disabled for content that is blocked
                    bindEvents: true,
                    // be default blockUI will supress tab navigation from leaving blocking content
                    // (if bindEvents is true)
                    constrainTabKey: true,
                    // fadeIn time in millis; set to 0 to disable fadeIn on block
                    fadeIn: 200,
                    // fadeOut time in millis; set to 0 to disable fadeOut on unblock
                    fadeOut: 400,
                    // time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
                    timeout: 0,
                    // disable if you don't want to show the overlay
                    showOverlay: true,
                    // if true, focus will be placed in the first available input field when
                    // page blocking
                    focusInput: true,
                    // elements that can receive focus
                    focusableElements: ":input:enabled:visible",
                    // suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
                    // no longer needed in 2012
                    // applyPlatformOpacityRules: true,
                    // callback method invoked when fadeIn has completed and blocking message is visible
                    onBlock: null,
                    // callback method invoked when unblocking has completed; the callback is
                    // passed the element that has been unblocked (which is the window object for page
                    // blocks) and the options that were passed to the unblock call:
                    //	onUnblock(element, options)
                    onUnblock: null,
                    // callback method invoked when the overlay area is clicked.
                    // setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
                    onOverlayClick: null,
                    // don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
                    quirksmodeOffsetHack: 4,
                    // class name of the message block
                    blockMsgClass: "blockMsg",
                    // if it is already blocked, then ignore it (don't unblock and reblock)
                    ignoreIfBlocked: false
                };
                // private data and functions follow...
                var pageBlock = null;
                var pageBlockEls = [];
                function install(el, opts) {
                    var css, themedCSS;
                    var full = el == window;
                    var msg = opts && opts.message !== undefined ? opts.message : undefined;
                    opts = $.extend({}, $.blockUI.defaults, opts || {});
                    if (opts.ignoreIfBlocked && $(el).data("blockUI.isBlocked")) return;
                    opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
                    css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
                    if (opts.onOverlayClick) opts.overlayCSS.cursor = "pointer";
                    themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
                    msg = msg === undefined ? opts.message : msg;
                    // remove the current block (if there is one)
                    if (full && pageBlock) remove(window, {
                        fadeOut: 0
                    });
                    // if an existing element is being used as the blocking content then we capture
                    // its current place in the DOM (and current display style) so we can restore
                    // it when we unblock
                    if (msg && typeof msg != "string" && (msg.parentNode || msg.jquery)) {
                        var node = msg.jquery ? msg[0] : msg;
                        var data = {};
                        $(el).data("blockUI.history", data);
                        data.el = node;
                        data.parent = node.parentNode;
                        data.display = node.style.display;
                        data.position = node.style.position;
                        if (data.parent) data.parent.removeChild(node);
                    }
                    $(el).data("blockUI.onUnblock", opts.onUnblock);
                    var z = opts.baseZ;
                    // blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
                    // layer1 is the iframe layer which is used to supress bleed through of underlying content
                    // layer2 is the overlay layer which has opacity and a wait cursor (by default)
                    // layer3 is the message content that is displayed while blocking
                    var lyr1, lyr2, lyr3, s;
                    if (msie || opts.forceIframe) lyr1 = $('<iframe class="blockUI" style="z-index:' + z++ + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>'); else lyr1 = $('<div class="blockUI" style="display:none"></div>');
                    if (opts.theme) lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + z++ + ';display:none"></div>'); else lyr2 = $('<div class="blockUI blockOverlay" style="z-index:' + z++ + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
                    if (opts.theme && full) {
                        s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:fixed">';
                        if (opts.title) {
                            s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || "&nbsp;") + "</div>";
                        }
                        s += '<div class="ui-widget-content ui-dialog-content"></div>';
                        s += "</div>";
                    } else if (opts.theme) {
                        s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:absolute">';
                        if (opts.title) {
                            s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || "&nbsp;") + "</div>";
                        }
                        s += '<div class="ui-widget-content ui-dialog-content"></div>';
                        s += "</div>";
                    } else if (full) {
                        s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:' + (z + 10) + ';display:none;position:fixed"></div>';
                    } else {
                        s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:' + (z + 10) + ';display:none;position:absolute"></div>';
                    }
                    lyr3 = $(s);
                    // if we have a message, style it
                    if (msg) {
                        if (opts.theme) {
                            lyr3.css(themedCSS);
                            lyr3.addClass("ui-widget-content");
                        } else lyr3.css(css);
                    }
                    // style the overlay
                    if (!opts.theme) lyr2.css(opts.overlayCSS);
                    lyr2.css("position", full ? "fixed" : "absolute");
                    // make iframe layer transparent in IE
                    if (msie || opts.forceIframe) lyr1.css("opacity", 0);
                    //$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
                    var layers = [ lyr1, lyr2, lyr3 ], $par = full ? $("body") : $(el);
                    $.each(layers, function() {
                        this.appendTo($par);
                    });
                    if (opts.theme && opts.draggable && $.fn.draggable) {
                        lyr3.draggable({
                            handle: ".ui-dialog-titlebar",
                            cancel: "li"
                        });
                    }
                    // ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
                    var expr = setExpr && (!$.support.boxModel || $("object,embed", full ? null : el).length > 0);
                    if (ie6 || expr) {
                        // give body 100% height
                        if (full && opts.allowBodyStretch && $.support.boxModel) $("html,body").css("height", "100%");
                        // fix ie6 issue when blocked element has a border width
                        if ((ie6 || !$.support.boxModel) && !full) {
                            var t = sz(el, "borderTopWidth"), l = sz(el, "borderLeftWidth");
                            var fixT = t ? "(0 - " + t + ")" : 0;
                            var fixL = l ? "(0 - " + l + ")" : 0;
                        }
                        // simulate fixed position
                        $.each(layers, function(i, o) {
                            var s = o[0].style;
                            s.position = "absolute";
                            if (i < 2) {
                                if (full) s.setExpression("height", "Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:" + opts.quirksmodeOffsetHack + ') + "px"'); else s.setExpression("height", 'this.parentNode.offsetHeight + "px"');
                                if (full) s.setExpression("width", 'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"'); else s.setExpression("width", 'this.parentNode.offsetWidth + "px"');
                                if (fixL) s.setExpression("left", fixL);
                                if (fixT) s.setExpression("top", fixT);
                            } else if (opts.centerY) {
                                if (full) s.setExpression("top", '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
                                s.marginTop = 0;
                            } else if (!opts.centerY && full) {
                                var top = opts.css && opts.css.top ? parseInt(opts.css.top, 10) : 0;
                                var expression = "((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + " + top + ') + "px"';
                                s.setExpression("top", expression);
                            }
                        });
                    }
                    // show the message
                    if (msg) {
                        if (opts.theme) lyr3.find(".ui-widget-content").append(msg); else lyr3.append(msg);
                        if (msg.jquery || msg.nodeType) $(msg).show();
                    }
                    if ((msie || opts.forceIframe) && opts.showOverlay) lyr1.show();
                    // opacity is zero
                    if (opts.fadeIn) {
                        var cb = opts.onBlock ? opts.onBlock : noOp;
                        var cb1 = opts.showOverlay && !msg ? cb : noOp;
                        var cb2 = msg ? cb : noOp;
                        if (opts.showOverlay) lyr2._fadeIn(opts.fadeIn, cb1);
                        if (msg) lyr3._fadeIn(opts.fadeIn, cb2);
                    } else {
                        if (opts.showOverlay) lyr2.show();
                        if (msg) lyr3.show();
                        if (opts.onBlock) opts.onBlock.bind(lyr3)();
                    }
                    // bind key and mouse events
                    bind(1, el, opts);
                    if (full) {
                        pageBlock = lyr3[0];
                        pageBlockEls = $(opts.focusableElements, pageBlock);
                        if (opts.focusInput) setTimeout(focus, 20);
                    } else center(lyr3[0], opts.centerX, opts.centerY);
                    if (opts.timeout) {
                        // auto-unblock
                        var to = setTimeout(function() {
                            if (full) $.unblockUI(opts); else $(el).unblock(opts);
                        }, opts.timeout);
                        $(el).data("blockUI.timeout", to);
                    }
                }
                // remove the block
                function remove(el, opts) {
                    var count;
                    var full = el == window;
                    var $el = $(el);
                    var data = $el.data("blockUI.history");
                    var to = $el.data("blockUI.timeout");
                    if (to) {
                        clearTimeout(to);
                        $el.removeData("blockUI.timeout");
                    }
                    opts = $.extend({}, $.blockUI.defaults, opts || {});
                    bind(0, el, opts);
                    // unbind events
                    if (opts.onUnblock === null) {
                        opts.onUnblock = $el.data("blockUI.onUnblock");
                        $el.removeData("blockUI.onUnblock");
                    }
                    var els;
                    if (full) // crazy selector to handle odd field errors in ie6/7
                    els = $("body").children().filter(".blockUI").add("body > .blockUI"); else els = $el.find(">.blockUI");
                    // fix cursor issue
                    if (opts.cursorReset) {
                        if (els.length > 1) els[1].style.cursor = opts.cursorReset;
                        if (els.length > 2) els[2].style.cursor = opts.cursorReset;
                    }
                    if (full) pageBlock = pageBlockEls = null;
                    if (opts.fadeOut) {
                        count = els.length;
                        els.stop().fadeOut(opts.fadeOut, function() {
                            if (--count === 0) reset(els, data, opts, el);
                        });
                    } else reset(els, data, opts, el);
                }
                // move blocking element back into the DOM where it started
                function reset(els, data, opts, el) {
                    var $el = $(el);
                    if ($el.data("blockUI.isBlocked")) return;
                    els.each(function(i, o) {
                        // remove via DOM calls so we don't lose event handlers
                        if (this.parentNode) this.parentNode.removeChild(this);
                    });
                    if (data && data.el) {
                        data.el.style.display = data.display;
                        data.el.style.position = data.position;
                        data.el.style.cursor = "default";
                        // #59
                        if (data.parent) data.parent.appendChild(data.el);
                        $el.removeData("blockUI.history");
                    }
                    if ($el.data("blockUI.static")) {
                        $el.css("position", "static");
                    }
                    if (typeof opts.onUnblock == "function") opts.onUnblock(el, opts);
                    // fix issue in Safari 6 where block artifacts remain until reflow
                    var body = $(document.body), w = body.width(), cssW = body[0].style.width;
                    body.width(w - 1).width(w);
                    body[0].style.width = cssW;
                }
                // bind/unbind the handler
                function bind(b, el, opts) {
                    var full = el == window, $el = $(el);
                    // don't bother unbinding if there is nothing to unbind
                    if (!b && (full && !pageBlock || !full && !$el.data("blockUI.isBlocked"))) return;
                    $el.data("blockUI.isBlocked", b);
                    // don't bind events when overlay is not in use or if bindEvents is false
                    if (!full || !opts.bindEvents || b && !opts.showOverlay) return;
                    // bind anchors and inputs for mouse and key events
                    var events = "mousedown mouseup keydown keypress keyup touchstart touchend touchmove";
                    if (b) $(document).bind(events, opts, handler); else $(document).unbind(events, handler);
                }
                // event handler to suppress keyboard/mouse events when blocking
                function handler(e) {
                    // allow tab navigation (conditionally)
                    if (e.type === "keydown" && e.keyCode && e.keyCode == 9) {
                        if (pageBlock && e.data.constrainTabKey) {
                            var els = pageBlockEls;
                            var fwd = !e.shiftKey && e.target === els[els.length - 1];
                            var back = e.shiftKey && e.target === els[0];
                            if (fwd || back) {
                                setTimeout(function() {
                                    focus(back);
                                }, 10);
                                return false;
                            }
                        }
                    }
                    var opts = e.data;
                    var target = $(e.target);
                    if (target.hasClass("blockOverlay") && opts.onOverlayClick) opts.onOverlayClick(e);
                    // allow events within the message content
                    if (target.parents("div." + opts.blockMsgClass).length > 0) return true;
                    // allow events for content that is not being blocked
                    return target.parents().children().filter("div.blockUI").length === 0;
                }
                function focus(back) {
                    if (!pageBlockEls) return;
                    var e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
                    if (e) e.focus();
                }
                function center(el, x, y) {
                    var p = el.parentNode, s = el.style;
                    var l = (p.offsetWidth - el.offsetWidth) / 2 - sz(p, "borderLeftWidth");
                    var t = (p.offsetHeight - el.offsetHeight) / 2 - sz(p, "borderTopWidth");
                    if (x) s.left = l > 0 ? l + "px" : "0";
                    if (y) s.top = t > 0 ? t + "px" : "0";
                }
                function sz(el, p) {
                    return parseInt($.css(el, p), 10) || 0;
                }
            }
            setup(jQuery);
        })();
    };
}, {});

define("#/shine-metron/0.1.21/app-debug", [ "#/xyz-util/xyz-util-debug" ], function(require, exports, module, installOption) {
    /**
Core script to handle the entire theme and core functions
**/
    var xyzUtil = require("#/xyz-util/xyz-util-debug");
    module.exports = function(jQuery) {
        var $ = jQuery;
        var App = function() {
            // IE mode
            var isRTL = false;
            var isIE8 = false;
            var isIE9 = false;
            var isIE10 = false;
            var resizeHandlers = [];
            var assetsPath = "/EWebLTE/assets/";
            var globalImgPath = "global/img/";
            var globalPluginsPath = "global/plugins/";
            var globalCssPath = "global/css/";
            // theme layout color set
            var brandColors = {
                blue: "#89C4F4",
                red: "#F3565D",
                green: "#1bbc9b",
                purple: "#9b59b6",
                grey: "#95a5a6",
                yellow: "#F8CB00"
            };
            // initializes main settings
            var handleInit = function() {
                if ($("body").css("direction") === "rtl") {
                    isRTL = true;
                }
                isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
                isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
                isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);
                if (isIE10) {
                    $("html").addClass("ie10");
                }
                if (isIE10 || isIE9 || isIE8) {
                    $("html").addClass("ie");
                }
            };
            // runs callback functions set by App.addResponsiveHandler().
            var _runResizeHandlers = function() {
                // reinitialize other subscribed elements
                for (var i = 0; i < resizeHandlers.length; i++) {
                    var each = resizeHandlers[i];
                    each.call();
                }
            };
            var handleOnResize = function() {
                var windowWidth = $(window).width();
                var resize;
                if (isIE8) {
                    var currheight;
                    $(window).resize(function() {
                        if (currheight == document.documentElement.clientHeight) {
                            return;
                        }
                        if (resize) {
                            clearTimeout(resize);
                        }
                        resize = setTimeout(function() {
                            _runResizeHandlers();
                        }, 50);
                        // wait 50ms until window resize finishes.
                        currheight = document.documentElement.clientHeight;
                    });
                } else {
                    $(window).resize(function() {
                        if ($(window).width() != windowWidth) {
                            windowWidth = $(window).width();
                            if (resize) {
                                clearTimeout(resize);
                            }
                            resize = setTimeout(function() {
                                _runResizeHandlers();
                            }, 50);
                        }
                    });
                }
            };
            // Handles portlet tools & actions
            var handlePortletTools = function() {
                // handle portlet remove
                $("body").on("click", ".portlet > .portlet-title > .tools > a.remove", function(e) {
                    e.preventDefault();
                    var portlet = $(this).closest(".portlet");
                    if ($("body").hasClass("page-portlet-fullscreen")) {
                        $("body").removeClass("page-portlet-fullscreen");
                    }
                    portlet.find(".portlet-title .fullscreen").tooltip("destroy");
                    portlet.find(".portlet-title > .tools > .reload").tooltip("destroy");
                    portlet.find(".portlet-title > .tools > .remove").tooltip("destroy");
                    portlet.find(".portlet-title > .tools > .config").tooltip("destroy");
                    portlet.find(".portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand").tooltip("destroy");
                    portlet.remove();
                });
                // handle portlet fullscreen
                $("body").on("click", ".portlet > .portlet-title .fullscreen", function(e) {
                    e.preventDefault();
                    var portlet = $(this).closest(".portlet");
                    if (portlet.hasClass("portlet-fullscreen")) {
                        $(this).removeClass("on");
                        portlet.removeClass("portlet-fullscreen");
                        $("body").removeClass("page-portlet-fullscreen");
                        portlet.children(".portlet-body").css("height", "auto");
                    } else {
                        var height = App.getViewPort().height - portlet.children(".portlet-title").outerHeight() - parseInt(portlet.children(".portlet-body").css("padding-top")) - parseInt(portlet.children(".portlet-body").css("padding-bottom"));
                        $(this).addClass("on");
                        portlet.addClass("portlet-fullscreen");
                        $("body").addClass("page-portlet-fullscreen");
                        portlet.children(".portlet-body").css("height", height);
                    }
                });
                $("body").on("click", ".portlet > .portlet-title > .tools > a.reload", function(e) {
                    e.preventDefault();
                    var el = $(this).closest(".portlet").children(".portlet-body");
                    var url = $(this).attr("data-url");
                    var error = $(this).attr("data-error-display");
                    if (url) {
                        App.blockUI({
                            target: el,
                            animate: true,
                            overlayColor: "none"
                        });
                        $.ajax({
                            type: "GET",
                            cache: false,
                            url: url,
                            dataType: "html",
                            success: function(res) {
                                App.unblockUI(el);
                                el.html(res);
                                App.initAjax();
                            },
                            error: function(xhr, ajaxOptions, thrownError) {
                                App.unblockUI(el);
                                var msg = "加载失败，请检查数据连接后重新尝试";
                                if (error == "toastr" && toastr) {
                                    toastr.error(msg);
                                } else if (error == "notific8" && $.notific8) {
                                    $.notific8("zindex", 11500);
                                    $.notific8(msg, {
                                        theme: "ruby",
                                        life: 3e3
                                    });
                                } else {
                                    alert(msg);
                                }
                            }
                        });
                    } else {
                        // for demo purpose
                        App.blockUI({
                            target: el,
                            animate: true,
                            overlayColor: "none"
                        });
                        window.setTimeout(function() {
                            App.unblockUI(el);
                        }, 1e3);
                    }
                });
                // load ajax data on page init
                $('.portlet .portlet-title a.reload[data-load="true"]').click();
                $("body").on("click", ".portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand", function(e) {
                    e.preventDefault();
                    var el = $(this).closest(".portlet").children(".portlet-body");
                    if ($(this).hasClass("collapse")) {
                        $(this).removeClass("collapse").addClass("expand");
                        el.slideUp(200);
                    } else {
                        $(this).removeClass("expand").addClass("collapse");
                        el.slideDown(200);
                    }
                });
            };
            // Handlesmaterial design checkboxes
            var handleMaterialDesign = function() {
                // Material design ckeckbox and radio effects
                $("body").on("click", ".md-checkbox > label, .md-radio > label", function() {
                    var the = $(this);
                    // find the first span which is our circle/bubble
                    var el = $(this).children("span:first-child");
                    // add the bubble class (we do this so it doesnt show on page load)
                    el.addClass("inc");
                    // clone it
                    var newone = el.clone(true);
                    // add the cloned version before our original
                    el.before(newone);
                    // remove the original so that it is ready to run on next click
                    $("." + el.attr("class") + ":last", the).remove();
                });
                if ($("body").hasClass("page-md")) {
                    // Material design click effect
                    // credit where credit's due; http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design
                    var element, circle, d, x, y;
                    $("body").on("click", "a.btn, button.btn, input.btn, label.btn", function(e) {
                        element = $(this);
                        if (element.find(".md-click-circle").length == 0) {
                            element.prepend("<span class='md-click-circle'></span>");
                        }
                        circle = element.find(".md-click-circle");
                        circle.removeClass("md-click-animate");
                        if (!circle.height() && !circle.width()) {
                            d = Math.max(element.outerWidth(), element.outerHeight());
                            circle.css({
                                height: d,
                                width: d
                            });
                        }
                        x = e.pageX - element.offset().left - circle.width() / 2;
                        y = e.pageY - element.offset().top - circle.height() / 2;
                        circle.css({
                            top: y + "px",
                            left: x + "px"
                        }).addClass("md-click-animate");
                        setTimeout(function() {
                            circle.remove();
                        }, 1e3);
                    });
                }
                // Floating labels
                var handleInput = function(el) {
                    if (el.val() != "") {
                        el.addClass("edited");
                    } else {
                        el.removeClass("edited");
                    }
                };
                $("body").on("keydown", ".form-md-floating-label .form-control", function(e) {
                    handleInput($(this));
                });
                $("body").on("blur", ".form-md-floating-label .form-control", function(e) {
                    handleInput($(this));
                });
                $(".form-md-floating-label .form-control").each(function() {
                    if ($(this).val().length > 0) {
                        $(this).addClass("edited");
                    }
                });
            };
            // Handles custom checkboxes & radios using jQuery iCheck plugin
            var handleiCheck = function() {
                if (!$().iCheck) {
                    return;
                }
                $(".icheck").each(function() {
                    var checkboxClass = $(this).attr("data-checkbox") ? $(this).attr("data-checkbox") : "icheckbox_minimal-grey";
                    var radioClass = $(this).attr("data-radio") ? $(this).attr("data-radio") : "iradio_minimal-grey";
                    if (checkboxClass.indexOf("_line") > -1 || radioClass.indexOf("_line") > -1) {
                        $(this).iCheck({
                            checkboxClass: checkboxClass,
                            radioClass: radioClass,
                            insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                        });
                    } else {
                        $(this).iCheck({
                            checkboxClass: checkboxClass,
                            radioClass: radioClass
                        });
                    }
                });
            };
            // Handles Bootstrap switches
            var handleBootstrapSwitch = function() {
                if (!$().bootstrapSwitch) {
                    return;
                }
                $(".make-switch").bootstrapSwitch();
            };
            // Handles Bootstrap confirmations
            var handleBootstrapConfirmation = function() {
                if (!$().confirmation) {
                    return;
                }
                $("[data-toggle=confirmation]").confirmation({
                    btnOkClass: "btn btn-sm btn-success",
                    btnCancelClass: "btn btn-sm btn-danger"
                });
            };
            // Handles Bootstrap Accordions.
            var handleAccordions = function() {
                $("body").on("shown.bs.collapse", ".accordion.scrollable", function(e) {
                    App.scrollTo($(e.target));
                });
            };
            // Handles Bootstrap Tabs.
            var handleTabs = function() {
                //activate tab if tab id provided in the URL
                if (encodeURI(location.hash)) {
                    var tabid = encodeURI(location.hash.substr(1));
                    $('a[href="#' + tabid + '"]').parents(".tab-pane:hidden").each(function() {
                        var tabid = $(this).attr("id");
                        $('a[href="#' + tabid + '"]').click();
                    });
                    $('a[href="#' + tabid + '"]').click();
                }
                if ($().tabdrop) {
                    $(".tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs").tabdrop({
                        text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
                    });
                }
            };
            // Handles Bootstrap Modals.
            var handleModals = function() {
                // fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class.
                $("body").on("hide.bs.modal", function() {
                    if ($(".modal:visible").size() > 1 && $("html").hasClass("modal-open") === false) {
                        $("html").addClass("modal-open");
                    } else if ($(".modal:visible").size() <= 1) {
                        $("html").removeClass("modal-open");
                    }
                });
                // fix page scrollbars issue
                $("body").on("show.bs.modal", ".modal", function() {
                    if ($(this).hasClass("modal-scroll")) {
                        $("body").addClass("modal-open-noscroll");
                    }
                });
                // fix page scrollbars issue
                $("body").on("hidden.bs.modal", ".modal", function() {
                    $("body").removeClass("modal-open-noscroll");
                });
                // remove ajax content and remove cache on modal closed
                $("body").on("hidden.bs.modal", ".modal:not(.modal-cached)", function() {
                    $(this).removeData("bs.modal");
                });
            };
            // Handles Bootstrap Tooltips.
            var handleTooltips = function() {
                // global tooltips
                $(".tooltips").tooltip();
                // portlet tooltips
                $(".portlet > .portlet-title .fullscreen").tooltip({
                    trigger: "hover",
                    container: "body",
                    title: "Fullscreen"
                });
                $(".portlet > .portlet-title > .tools > .reload").tooltip({
                    trigger: "hover",
                    container: "body",
                    title: "Reload"
                });
                $(".portlet > .portlet-title > .tools > .remove").tooltip({
                    trigger: "hover",
                    container: "body",
                    title: "Remove"
                });
                $(".portlet > .portlet-title > .tools > .config").tooltip({
                    trigger: "hover",
                    container: "body",
                    title: "Settings"
                });
                $(".portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand").tooltip({
                    trigger: "hover",
                    container: "body",
                    //            title: 'Collapse/Expand'
                    title: "折叠/展开"
                });
            };
            // Handles Bootstrap Dropdowns
            var handleDropdowns = function() {
                /*
              Hold dropdown on click
            */
                $("body").on("click", ".dropdown-menu.hold-on-click", function(e) {
                    e.stopPropagation();
                });
            };
            var handleAlerts = function() {
                $("body").on("click", '[data-close="alert"]', function(e) {
                    $(this).parent(".alert").hide();
                    $(this).closest(".note").hide();
                    e.preventDefault();
                });
                $("body").on("click", '[data-close="note"]', function(e) {
                    $(this).closest(".note").hide();
                    e.preventDefault();
                });
                $("body").on("click", '[data-remove="note"]', function(e) {
                    $(this).closest(".note").remove();
                    e.preventDefault();
                });
            };
            // Handle textarea autosize
            var handleTextareaAutosize = function() {
                if (typeof autosize == "function") {
                    autosize(document.querySelectorAll("textarea.autosizeme"));
                }
            };
            // Handles Bootstrap Popovers
            // last popep popover
            var lastPopedPopover;
            var handlePopovers = function() {
                $(".popovers").popover();
                // close last displayed popover
                $(document).on("click.bs.popover.data-api", function(e) {
                    if (lastPopedPopover) {
                        lastPopedPopover.popover("hide");
                    }
                });
            };
            // Handles scrollable contents using jQuery SlimScroll plugin.
            var handleScrollers = function() {
                App.initSlimScroll(".scroller");
            };
            // Handles Image Preview using jQuery Fancybox plugin
            var handleFancybox = function() {
                if (!jQuery.fancybox) {
                    return;
                }
                if ($(".fancybox-button").size() > 0) {
                    $(".fancybox-button").fancybox({
                        groupAttr: "data-rel",
                        prevEffect: "none",
                        nextEffect: "none",
                        closeBtn: true,
                        helpers: {
                            title: {
                                type: "inside"
                            }
                        }
                    });
                }
            };
            // Handles counterup plugin wrapper
            var handleCounterup = function() {
                if (!$().counterUp) {
                    return;
                }
                $("[data-counter='counterup']").counterUp({
                    delay: 10,
                    time: 1e3
                });
            };
            // Fix input placeholder issue for IE8 and IE9
            var handleFixInputPlaceholderForIE = function() {
                //fix html5 placeholder attribute for ie7 & ie8
                if (isIE8 || isIE9) {
                    // ie8 & ie9
                    // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
                    $("input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)").each(function() {
                        var input = $(this);
                        if (input.val() === "" && input.attr("placeholder") !== "") {
                            input.addClass("placeholder").val(input.attr("placeholder"));
                        }
                        input.focus(function() {
                            if (input.val() == input.attr("placeholder")) {
                                input.val("");
                            }
                        });
                        input.blur(function() {
                            if (input.val() === "" || input.val() == input.attr("placeholder")) {
                                input.val(input.attr("placeholder"));
                            }
                        });
                    });
                }
            };
            // Handle Select2 Dropdowns
            var handleSelect2 = function() {
                if ($().select2) {
                    $.fn.select2.defaults.set("theme", "bootstrap");
                    $(".select2me").select2({
                        placeholder: "Select",
                        width: "auto",
                        allowClear: true
                    });
                }
            };
            // handle group element heights
            var handleHeight = function() {
                $("[data-auto-height]").each(function() {
                    var parent = $(this);
                    var items = $("[data-height]", parent);
                    var height = 0;
                    var mode = parent.attr("data-mode");
                    var offset = parseInt(parent.attr("data-offset") ? parent.attr("data-offset") : 0);
                    items.each(function() {
                        if ($(this).attr("data-height") == "height") {
                            $(this).css("height", "");
                        } else {
                            $(this).css("min-height", "");
                        }
                        var height_ = mode == "base-height" ? $(this).outerHeight() : $(this).outerHeight(true);
                        if (height_ > height) {
                            height = height_;
                        }
                    });
                    height = height + offset;
                    items.each(function() {
                        if ($(this).attr("data-height") == "height") {
                            $(this).css("height", height);
                        } else {
                            $(this).css("min-height", height);
                        }
                    });
                    if (parent.attr("data-related")) {
                        $(parent.attr("data-related")).css("height", parent.height());
                    }
                });
            };
            //* END:CORE HANDLERS *//
            return {
                //main function to initiate the theme
                init: function() {
                    //IMPORTANT!!!: Do not modify the core handlers call order.
                    //Core handlers
                    handleInit();
                    // initialize core variables
                    handleOnResize();
                    // set and handle responsive
                    //UI Component handlers
                    handleMaterialDesign();
                    // handle material design
                    handleiCheck();
                    // handles custom icheck radio and checkboxes
                    handleBootstrapSwitch();
                    // handle bootstrap switch plugin
                    handleScrollers();
                    // handles slim scrolling contents
                    handleFancybox();
                    // handle fancy box
                    handleSelect2();
                    // handle custom Select2 dropdowns
                    handlePortletTools();
                    // handles portlet action bar functionality(refresh, configure, toggle, remove)
                    handleAlerts();
                    //handle closabled alerts
                    handleDropdowns();
                    // handle dropdowns
                    handleTabs();
                    // handle tabs
                    handleTooltips();
                    // handle bootstrap tooltips
                    handlePopovers();
                    // handles bootstrap popovers
                    handleAccordions();
                    //handles accordions
                    handleModals();
                    // handle modals
                    handleBootstrapConfirmation();
                    // handle bootstrap confirmations
                    handleTextareaAutosize();
                    // handle autosize textareas
                    handleCounterup();
                    // handle counterup instances
                    //Handle group element heights
                    this.addResizeHandler(handleHeight);
                    // handle auto calculating height on window resize
                    // Hacks
                    handleFixInputPlaceholderForIE();
                },
                //main function to initiate core javascript after ajax complete
                initAjax: function() {
                    //handleUniform(); // handles custom radio & checkboxes
                    handleiCheck();
                    // handles custom icheck radio and checkboxes
                    handleBootstrapSwitch();
                    // handle bootstrap switch plugin
                    handleScrollers();
                    // handles slim scrolling contents
                    handleSelect2();
                    // handle custom Select2 dropdowns
                    handleFancybox();
                    // handle fancy box
                    handleDropdowns();
                    // handle dropdowns
                    handleTooltips();
                    // handle bootstrap tooltips
                    handlePopovers();
                    // handles bootstrap popovers
                    handleAccordions();
                    //handles accordions
                    handleBootstrapConfirmation();
                },
                //init main components
                initComponents: function() {
                    this.initAjax();
                },
                //public function to remember last opened popover that needs to be closed on click
                setLastPopedPopover: function(el) {
                    lastPopedPopover = el;
                },
                //public function to add callback a function which will be called on window resize
                addResizeHandler: function(func) {
                    resizeHandlers.push(func);
                },
                //public functon to call _runresizeHandlers
                runResizeHandlers: function() {
                    _runResizeHandlers();
                },
                // wrApper function to scroll(focus) to an element
                scrollTo: function(el, offeset) {
                    var pos = el && el.size() > 0 ? el.offset().top : 0;
                    if (el) {
                        if ($("body").hasClass("page-header-fixed")) {
                            pos = pos - $(".page-header").height();
                        } else if ($("body").hasClass("page-header-top-fixed")) {
                            pos = pos - $(".page-header-top").height();
                        } else if ($("body").hasClass("page-header-menu-fixed")) {
                            pos = pos - $(".page-header-menu").height();
                        }
                        pos = pos + (offeset ? offeset : -1 * el.height());
                    }
                    $("html,body").animate({
                        scrollTop: pos
                    }, "slow");
                },
                initSlimScroll: function(el) {
                    if (!$().slimScroll) {
                        return;
                    }
                    $(el).each(function() {
                        if ($(this).attr("data-initialized")) {
                            return;
                        }
                        var height;
                        if ($(this).attr("data-height")) {
                            height = $(this).attr("data-height");
                        } else {
                            height = $(this).css("height");
                        }
                        $(this).slimScroll({
                            allowPageScroll: true,
                            // allow page scroll when the element scroll is ended
                            size: "7px",
                            color: $(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : "#bbb",
                            wrapperClass: $(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : "slimScrollDiv",
                            railColor: $(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : "#eaeaea",
                            position: isRTL ? "left" : "right",
                            height: height,
                            alwaysVisible: $(this).attr("data-always-visible") == "1" ? true : false,
                            railVisible: $(this).attr("data-rail-visible") == "1" ? true : false,
                            disableFadeOut: true
                        });
                        $(this).attr("data-initialized", "1");
                    });
                },
                destroySlimScroll: function(el) {
                    if (!$().slimScroll) {
                        return;
                    }
                    $(el).each(function() {
                        if ($(this).attr("data-initialized") === "1") {
                            // destroy existing instance before updating the height
                            $(this).removeAttr("data-initialized");
                            $(this).removeAttr("style");
                            var attrList = {};
                            // store the custom attribures so later we will reassign.
                            if ($(this).attr("data-handle-color")) {
                                attrList["data-handle-color"] = $(this).attr("data-handle-color");
                            }
                            if ($(this).attr("data-wrapper-class")) {
                                attrList["data-wrapper-class"] = $(this).attr("data-wrapper-class");
                            }
                            if ($(this).attr("data-rail-color")) {
                                attrList["data-rail-color"] = $(this).attr("data-rail-color");
                            }
                            if ($(this).attr("data-always-visible")) {
                                attrList["data-always-visible"] = $(this).attr("data-always-visible");
                            }
                            if ($(this).attr("data-rail-visible")) {
                                attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
                            }
                            $(this).slimScroll({
                                wrapperClass: $(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : "slimScrollDiv",
                                destroy: true
                            });
                            var the = $(this);
                            // reassign custom attributes
                            $.each(attrList, function(key, value) {
                                the.attr(key, value);
                            });
                        }
                    });
                },
                // function to scroll to the top
                scrollTop: function() {
                    App.scrollTo();
                },
                // wrApper function to  block element(indicate loading)
                blockUI: function(options) {
                    options = $.extend(true, {}, options);
                    var html = "";
                    var loadingImgPath = "../assets/shine-metron/loading-spinner-grey.gif";
                    loadingImgPath = xyzUtil.urlParse(loadingImgPath);
                    if (options.animate) {
                        html = '<div class="loading-message ' + (options.boxed ? "loading-message-boxed" : "") + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + "</div>";
                    } else if (options.iconOnly) {
                        html = '<div class="loading-message ' + (options.boxed ? "loading-message-boxed" : "") + '"><img src="' + loadingImgPath + '" align=""></div>';
                    } else if (options.textOnly) {
                        html = '<div class="loading-message ' + (options.boxed ? "loading-message-boxed" : "") + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : "LOADING...") + "</span></div>";
                    } else {
                        html = '<div class="loading-message ' + (options.boxed ? "loading-message-boxed" : "") + '"><img src="' + loadingImgPath + '" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : "LOADING...") + "</span></div>";
                    }
                    if (options.target) {
                        // element blocking
                        var el = $(options.target);
                        if (el.height() <= $(window).height()) {
                            options.cenrerY = true;
                        }
                        el.block({
                            message: html,
                            baseZ: options.zIndex ? options.zIndex : 1e3,
                            centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                            css: {
                                top: "10%",
                                border: "0",
                                padding: "0",
                                backgroundColor: "none"
                            },
                            overlayCSS: {
                                backgroundColor: options.overlayColor ? options.overlayColor : "#555",
                                opacity: options.boxed ? .05 : .1,
                                cursor: "wait"
                            }
                        });
                    } else {
                        // page blocking
                        $.blockUI({
                            message: html,
                            baseZ: options.zIndex ? options.zIndex : 1e3,
                            css: {
                                border: "0",
                                padding: "0",
                                backgroundColor: "none"
                            },
                            overlayCSS: {
                                backgroundColor: options.overlayColor ? options.overlayColor : "#555",
                                opacity: options.boxed ? .05 : .1,
                                cursor: "wait"
                            }
                        });
                    }
                },
                // wrApper function to  un-block element(finish loading)
                unblockUI: function(target) {
                    if (target) {
                        $(target).unblock({
                            onUnblock: function() {
                                $(target).css("position", "");
                                $(target).css("zoom", "");
                            }
                        });
                    } else {
                        $.unblockUI();
                    }
                },
                startPageLoading: function(options) {
                    if (options && options.animate) {
                        $(".page-spinner-bar").remove();
                        $("body").append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
                    } else {
                        $(".page-loading").remove();
                        $("body").append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : "Loading...") + "</span></div>");
                    }
                },
                stopPageLoading: function() {
                    $(".page-loading, .page-spinner-bar").remove();
                },
                alert: function(options) {
                    options = $.extend(true, {
                        container: "",
                        // alerts parent container(by default placed after the page breadcrumbs)
                        place: "append",
                        // "append" or "prepend" in container
                        type: "success",
                        // alert's type
                        message: "",
                        // alert's message
                        close: true,
                        // make alert closable
                        reset: true,
                        // close all previouse alerts first
                        focus: true,
                        // auto scroll to the alert after shown
                        closeInSeconds: 0,
                        // auto close after defined seconds
                        icon: ""
                    }, options);
                    var id = App.getUniqueID("App_alert");
                    var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : "") + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : "") + options.message + "</div>";
                    if (options.reset) {
                        $(".custom-alerts").remove();
                    }
                    if (!options.container) {
                        if ($(".page-fixed-main-content").size() === 1) {
                            $(".page-fixed-main-content").prepend(html);
                        } else if (($("body").hasClass("page-container-bg-solid") || $("body").hasClass("page-content-white")) && $(".page-head").size() === 0) {
                            $(".page-title").after(html);
                        } else {
                            if ($(".page-bar").size() > 0) {
                                $(".page-bar").after(html);
                            } else {
                                $(".page-breadcrumb, .breadcrumbs").after(html);
                            }
                        }
                    } else {
                        if (options.place == "append") {
                            $(options.container).append(html);
                        } else {
                            $(options.container).prepend(html);
                        }
                    }
                    if (options.focus) {
                        App.scrollTo($("#" + id));
                    }
                    if (options.closeInSeconds > 0) {
                        setTimeout(function() {
                            $("#" + id).remove();
                        }, options.closeInSeconds * 1e3);
                    }
                    return id;
                },
                //public function to initialize the fancybox plugin
                initFancybox: function() {
                    handleFancybox();
                },
                //public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
                getActualVal: function(el) {
                    el = $(el);
                    if (el.val() === el.attr("placeholder")) {
                        return "";
                    }
                    return el.val();
                },
                //public function to get a paremeter by name from URL
                getURLParameter: function(paramName) {
                    var searchString = window.location.search.substring(1), i, val, params = searchString.split("&");
                    for (i = 0; i < params.length; i++) {
                        val = params[i].split("=");
                        if (val[0] == paramName) {
                            return unescape(val[1]);
                        }
                    }
                    return null;
                },
                // check for device touch support
                isTouchDevice: function() {
                    try {
                        document.createEvent("TouchEvent");
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
                getViewPort: function() {
                    var e = window, a = "inner";
                    if (!("innerWidth" in window)) {
                        a = "client";
                        e = document.documentElement || document.body;
                    }
                    return {
                        width: e[a + "Width"],
                        height: e[a + "Height"]
                    };
                },
                getUniqueID: function(prefix) {
                    return "prefix_" + Math.floor(Math.random() * new Date().getTime());
                },
                // check IE8 mode
                isIE8: function() {
                    return isIE8;
                },
                // check IE9 mode
                isIE9: function() {
                    return isIE9;
                },
                //check RTL mode
                isRTL: function() {
                    return isRTL;
                },
                // check IE8 mode
                isAngularJsApp: function() {
                    return typeof angular == "undefined" ? false : true;
                },
                getAssetsPath: function() {
                    return assetsPath;
                },
                setAssetsPath: function(path) {
                    assetsPath = path;
                },
                setGlobalImgPath: function(path) {
                    globalImgPath = path;
                },
                getGlobalImgPath: function() {
                    return assetsPath + globalImgPath;
                },
                setGlobalPluginsPath: function(path) {
                    globalPluginsPath = path;
                },
                getGlobalPluginsPath: function() {
                    return assetsPath + globalPluginsPath;
                },
                getGlobalCssPath: function() {
                    return assetsPath + globalCssPath;
                },
                // get layout color code by color name
                getBrandColor: function(name) {
                    if (brandColors[name]) {
                        return brandColors[name];
                    } else {
                        return "";
                    }
                },
                getResponsiveBreakpoint: function(size) {
                    // bootstrap responsive breakpoints
                    var sizes = {
                        xs: 480,
                        // extra small
                        sm: 768,
                        // small
                        md: 992,
                        // medium
                        lg: 1200
                    };
                    return sizes[size] ? sizes[size] : 0;
                }
            };
        }();
        jQuery(document).ready(function() {
            App.init();
        });
        return App;
    };
}, {});

define("#/shine-metron/0.1.21/layout-debug", [], function(require, exports, module, installOption) {
    /**
 Core script to handle the entire theme and core functions
 **/
    module.exports = function(jQuery, App) {
        var $ = jQuery;
        var Layout = function() {
            var layoutImgPath = "layouts/layout/img/";
            var layoutCssPath = "layouts/layout/css/";
            var resBreakpointMd = App.getResponsiveBreakpoint("md");
            var ajaxContentSuccessCallbacks = [];
            var ajaxContentErrorCallbacks = [];
            //* BEGIN:CORE HANDLERS *//
            // this function handles responsive layout on screen size resize or mobile device rotate.
            // Set proper height for sidebar and content. The content and sidebar height must be synced always.
            var handleSidebarAndContentHeight = function() {
                var content = $(".page-content");
                var iframe = $(".J_iframe");
                var sidebar = $(".page-sidebar");
                var body = $("body");
                var height;
                if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
                    var available_height = App.getViewPort().height - $(".page-footer").outerHeight() - $(".page-header").outerHeight();
                    var sidebar_height = sidebar.outerHeight();
                    if (sidebar_height > available_height) {
                        available_height = sidebar_height + $(".page-footer").outerHeight();
                    }
                    if (content.height() < available_height) {
                        content.css("min-height", available_height);
                    }
                } else {
                    if (body.hasClass("page-sidebar-fixed")) {
                        height = _calculateFixedSidebarViewportHeight();
                        if (body.hasClass("page-footer-fixed") === false) {
                            height = height - $(".page-footer").outerHeight();
                        }
                    } else {
                        var headerHeight = $(".page-header").outerHeight();
                        var footerHeight = $(".page-footer").outerHeight();
                        if (App.getViewPort().width < resBreakpointMd) {
                            height = App.getViewPort().height - headerHeight - footerHeight;
                        } else {
                            height = sidebar.height() + 20;
                        }
                        if (height + headerHeight + footerHeight <= App.getViewPort().height) {
                            height = App.getViewPort().height - headerHeight - footerHeight;
                        }
                    }
                    content.css("min-height", height);
                }
                iframe.css("min-height", content.css("min-height"));
            };
            // Handle sidebar menu links
            var handleSidebarMenuActiveLink = function(mode, el, $state) {
                var url = location.hash.toLowerCase();
                var menu = $(".page-sidebar-menu");
                if (mode === "click" || mode === "set") {
                    el = $(el);
                } else if (mode === "match") {
                    menu.find("li > a").each(function() {
                        var state = $(this).attr("ui-sref");
                        if ($state && state) {
                            if ($state.is(state)) {
                                el = $(this);
                                return;
                            }
                        } else {
                            var path = $(this).attr("href");
                            if (path) {
                                // url match condition
                                path = path.toLowerCase();
                                if (path.length > 1 && url.substr(1, path.length - 1) == path.substr(1)) {
                                    el = $(this);
                                    return;
                                }
                            }
                        }
                    });
                }
                if (!el || el.size() == 0) {
                    return;
                }
                if (el.attr("href") == "javascript:;" || el.attr("ui-sref") == "javascript:;" || el.attr("href") == "#" || el.attr("ui-sref") == "#") {
                    return;
                }
                var slideSpeed = parseInt(menu.data("slide-speed"));
                var keepExpand = menu.data("keep-expanded");
                // begin: handle active state
                if (menu.hasClass("page-sidebar-menu-hover-submenu") === false) {
                    menu.find("li.nav-item.open").each(function() {
                        var match = false;
                        $(this).find("li").each(function() {
                            var state = $(this).attr("ui-sref");
                            if ($state && state) {
                                if ($state.is(state)) {
                                    match = true;
                                    return;
                                }
                            } else if ($(this).find(" > a").attr("href") === el.attr("href")) {
                                match = true;
                                return;
                            }
                        });
                        if (match === true) {
                            return;
                        }
                        $(this).removeClass("open");
                        $(this).find("> a > .arrow.open").removeClass("open");
                        $(this).find("> .sub-menu").slideUp();
                    });
                } else {
                    menu.find("li.open").removeClass("open");
                }
                menu.find("li.active").removeClass("active");
                menu.find("li > a > .selected").remove();
                // end: handle active state
                el.parents("li").each(function() {
                    $(this).addClass("active");
                    $(this).find("> a > span.arrow").addClass("open");
                    if ($(this).parent("ul.page-sidebar-menu").size() === 1) {
                        $(this).find("> a").append('<span class="selected"></span>');
                    }
                    if ($(this).children("ul.sub-menu").size() === 1) {
                        $(this).addClass("open");
                    }
                });
                if (mode === "click") {
                    if (App.getViewPort().width < resBreakpointMd && $(".page-sidebar").hasClass("in")) {
                        // close the menu on mobile view while laoding a page
                        $(".page-header .responsive-toggler").click();
                    }
                }
            };
            // Handle sidebar menu
            var handleSidebarMenu = function() {
                // offcanvas mobile menu
                $(".page-sidebar-mobile-offcanvas .responsive-toggler").click(function(e) {
                    $("body").toggleClass("page-sidebar-mobile-offcanvas-open");
                    e.preventDefault();
                    e.stopPropagation();
                });
                if ($("body").hasClass("page-sidebar-mobile-offcanvas")) {
                    $(document).on("click", function(e) {
                        if ($("body").hasClass("page-sidebar-mobile-offcanvas-open")) {
                            if ($(e.target).closest(".page-sidebar-mobile-offcanvas .responsive-toggler").length === 0 && $(e.target).closest(".page-sidebar-wrapper").length === 0) {
                                $("body").removeClass("page-sidebar-mobile-offcanvas-open");
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }
                    });
                }
                // handle sidebar link click
                $(".page-sidebar-menu").on("click", "li > a.nav-toggle, li > a > span.nav-toggle", function(e) {
                    var that = $(this).closest(".nav-item").children(".nav-link");
                    if (App.getViewPort().width >= resBreakpointMd && !$(".page-sidebar-menu").attr("data-initialized") && $("body").hasClass("page-sidebar-closed") && that.parent("li").parent(".page-sidebar-menu").size() === 1) {
                        return;
                    }
                    var hasSubMenu = that.next().hasClass("sub-menu");
                    if (App.getViewPort().width >= resBreakpointMd && that.parents(".page-sidebar-menu-hover-submenu").size() === 1) {
                        // exit of hover sidebar menu
                        return;
                    }
                    if (hasSubMenu === false) {
                        if (App.getViewPort().width < resBreakpointMd && $(".page-sidebar").hasClass("in")) {
                            // close the menu on mobile view while laoding a page
                            $(".page-header .responsive-toggler").click();
                        }
                        return;
                    }
                    var parent = that.parent().parent();
                    var the = that;
                    var menu = $(".page-sidebar-menu");
                    var sub = that.next();
                    var autoScroll = menu.data("auto-scroll");
                    var slideSpeed = parseInt(menu.data("slide-speed"));
                    var keepExpand = menu.data("keep-expanded");
                    if (!keepExpand) {
                        parent.children("li.open").children("a").children(".arrow").removeClass("open");
                        parent.children("li.open").children(".sub-menu:not(.always-open)").slideUp(slideSpeed);
                        parent.children("li.open").removeClass("open");
                    }
                    var slideOffeset = -200;
                    if (sub.is(":visible")) {
                        $(".arrow", the).removeClass("open");
                        the.parent().removeClass("open");
                        sub.slideUp(slideSpeed, function() {
                            if (autoScroll === true && $("body").hasClass("page-sidebar-closed") === false) {
                                if ($("body").hasClass("page-sidebar-fixed")) {
                                    menu.slimScroll({
                                        scrollTo: the.position().top
                                    });
                                } else {
                                    App.scrollTo(the, slideOffeset);
                                }
                            }
                            handleSidebarAndContentHeight();
                        });
                    } else if (hasSubMenu) {
                        $(".arrow", the).addClass("open");
                        the.parent().addClass("open");
                        sub.slideDown(slideSpeed, function() {
                            if (autoScroll === true && $("body").hasClass("page-sidebar-closed") === false) {
                                if ($("body").hasClass("page-sidebar-fixed")) {
                                    menu.slimScroll({
                                        scrollTo: the.position().top
                                    });
                                } else {
                                    App.scrollTo(the, slideOffeset);
                                }
                            }
                            handleSidebarAndContentHeight();
                        });
                    }
                    e.preventDefault();
                });
                // handle menu close for angularjs version
                if (App.isAngularJsApp()) {
                    $(".page-sidebar-menu li > a").on("click", function(e) {
                        if (App.getViewPort().width < resBreakpointMd && $(this).next().hasClass("sub-menu") === false) {
                            $(".page-header .responsive-toggler").click();
                        }
                    });
                }
                // handle ajax links within sidebar menu
                $(".page-sidebar").on("click", " li > a.ajaxify", function(e) {
                    e.preventDefault();
                    App.scrollTop();
                    var url = $(this).attr("href");
                    var menuContainer = $(".page-sidebar ul");
                    menuContainer.children("li.active").removeClass("active");
                    menuContainer.children("arrow.open").removeClass("open");
                    $(this).parents("li").each(function() {
                        $(this).addClass("active");
                        $(this).children("a > span.arrow").addClass("open");
                    });
                    $(this).parents("li").addClass("active");
                    if (App.getViewPort().width < resBreakpointMd && $(".page-sidebar").hasClass("in")) {
                        // close the menu on mobile view while laoding a page
                        $(".page-header .responsive-toggler").click();
                    }
                    Layout.loadAjaxContent(url, $(this));
                });
                // handle ajax link within main content
                $(".page-content").on("click", ".ajaxify", function(e) {
                    e.preventDefault();
                    App.scrollTop();
                    var url = $(this).attr("href");
                    if (App.getViewPort().width < resBreakpointMd && $(".page-sidebar").hasClass("in")) {
                        // close the menu on mobile view while laoding a page
                        $(".page-header .responsive-toggler").click();
                    }
                    Layout.loadAjaxContent(url);
                });
                // handle scrolling to top on responsive menu toggler click when header is fixed for mobile view
                $(document).on("click", ".page-header-fixed-mobile .page-header .responsive-toggler", function() {
                    App.scrollTop();
                });
                // handle sidebar hover effect
                handleFixedSidebarHoverEffect();
                // handle the search bar close
                $(".page-sidebar").on("click", ".sidebar-search .remove", function(e) {
                    e.preventDefault();
                    $(".sidebar-search").removeClass("open");
                });
                // handle the search query submit on enter press
                $(".page-sidebar .sidebar-search").on("keypress", "input.form-control", function(e) {
                    if (e.which == 13) {
                        $(".sidebar-search").submit();
                        return false;
                    }
                });
                // handle the search submit(for sidebar search and responsive mode of the header search)
                $(".sidebar-search .submit").on("click", function(e) {
                    e.preventDefault();
                    if ($("body").hasClass("page-sidebar-closed")) {
                        if ($(".sidebar-search").hasClass("open") === false) {
                            if ($(".page-sidebar-fixed").size() === 1) {
                                $(".page-sidebar .sidebar-toggler").click();
                            }
                            $(".sidebar-search").addClass("open");
                        } else {
                            $(".sidebar-search").submit();
                        }
                    } else {
                        $(".sidebar-search").submit();
                    }
                });
                // handle close on body click
                if ($(".sidebar-search").size() !== 0) {
                    $(".sidebar-search .input-group").on("click", function(e) {
                        e.stopPropagation();
                    });
                    $("body").on("click", function() {
                        if ($(".sidebar-search").hasClass("open")) {
                            $(".sidebar-search").removeClass("open");
                        }
                    });
                }
            };
            // Helper function to calculate sidebar height for fixed sidebar layout.
            var _calculateFixedSidebarViewportHeight = function() {
                var sidebarHeight = App.getViewPort().height - $(".page-header").outerHeight(true);
                if ($("body").hasClass("page-footer-fixed")) {
                    sidebarHeight = sidebarHeight - $(".page-footer").outerHeight();
                }
                return sidebarHeight;
            };
            // Handles fixed sidebar
            var handleFixedSidebar = function() {
                var menu = $(".page-sidebar-menu");
                handleSidebarAndContentHeight();
                if ($(".page-sidebar-fixed").size() === 0) {
                    App.destroySlimScroll(menu);
                    return;
                }
                if (App.getViewPort().width >= resBreakpointMd && !$("body").hasClass("page-sidebar-menu-not-fixed")) {
                    menu.attr("data-height", _calculateFixedSidebarViewportHeight());
                    App.destroySlimScroll(menu);
                    App.initSlimScroll(menu);
                    handleSidebarAndContentHeight();
                }
            };
            // Handles sidebar toggler to close/hide the sidebar.
            var handleFixedSidebarHoverEffect = function() {
                if ($("body").hasClass("page-sidebar-fixed")) {
                    $(".page-sidebar").on("mouseenter", function() {
                        if ($("body").hasClass("page-sidebar-closed")) {
                            $(this).find(".page-sidebar-menu").removeClass("page-sidebar-menu-closed");
                        }
                    }).on("mouseleave", function() {
                        if ($("body").hasClass("page-sidebar-closed")) {
                            $(this).find(".page-sidebar-menu").addClass("page-sidebar-menu-closed");
                        }
                    });
                }
            };
            // Hanles sidebar toggler
            var handleSidebarToggler = function() {
                /**
             if (Cookies && Cookies.get('sidebar_closed') === '1' && App.getViewPort().width >= resBreakpointMd) {
            $('body').addClass('page-sidebar-closed');
            $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
        }
             */
                // handle sidebar show/hide
                $("body").on("click", ".sidebar-toggler", function(e) {
                    var body = $("body");
                    var sidebar = $(".page-sidebar");
                    var sidebarMenu = $(".page-sidebar-menu");
                    $(".sidebar-search", sidebar).removeClass("open");
                    if (body.hasClass("page-sidebar-closed")) {
                        body.removeClass("page-sidebar-closed");
                        sidebarMenu.removeClass("page-sidebar-menu-closed");
                        if (Cookies) {
                            Cookies.set("sidebar_closed", "0");
                        }
                    } else {
                        body.addClass("page-sidebar-closed");
                        sidebarMenu.addClass("page-sidebar-menu-closed");
                        if (body.hasClass("page-sidebar-fixed")) {
                            sidebarMenu.trigger("mouseleave");
                        }
                        if (Cookies) {
                            Cookies.set("sidebar_closed", "1");
                        }
                    }
                    $(window).trigger("resize");
                });
            };
            // Handles the horizontal menu
            var handleHorizontalMenu = function() {
                //handle tab click
                $(".page-header").on("click", '.hor-menu a[data-toggle="tab"]', function(e) {
                    e.preventDefault();
                    var nav = $(".hor-menu .nav");
                    var active_link = nav.find("li.current");
                    $("li.active", active_link).removeClass("active");
                    $(".selected", active_link).remove();
                    var new_link = $(this).parents("li").last();
                    new_link.addClass("current");
                    new_link.find("a:first").append('<span class="selected"></span>');
                });
                // handle search box expand/collapse
                $(".page-header").on("click", ".search-form", function(e) {
                    $(this).addClass("open");
                    $(this).find(".form-control").focus();
                    $(".page-header .search-form .form-control").on("blur", function(e) {
                        $(this).closest(".search-form").removeClass("open");
                        $(this).unbind("blur");
                    });
                });
                // handle hor menu search form on enter press
                $(".page-header").on("keypress", ".hor-menu .search-form .form-control", function(e) {
                    if (e.which == 13) {
                        $(this).closest(".search-form").submit();
                        return false;
                    }
                });
                // handle header search button click
                $(".page-header").on("mousedown", ".search-form.open .submit", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).closest(".search-form").submit();
                });
                $(document).on("click", ".mega-menu-dropdown .dropdown-menu", function(e) {
                    e.stopPropagation();
                });
            };
            // Handles Bootstrap Tabs.
            var handleTabs = function() {
                // fix content height on tab click
                $("body").on("shown.bs.tab", 'a[data-toggle="tab"]', function() {
                    handleSidebarAndContentHeight();
                });
            };
            // Handles the go to top button at the footer
            var handleGoTop = function() {
                var offset = 300;
                var duration = 500;
                if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                    // ios supported
                    $(window).bind("touchend touchcancel touchleave", function(e) {
                        if ($(this).scrollTop() > offset) {
                            $(".scroll-to-top").fadeIn(duration);
                        } else {
                            $(".scroll-to-top").fadeOut(duration);
                        }
                    });
                } else {
                    // general
                    $(window).scroll(function() {
                        if ($(this).scrollTop() > offset) {
                            $(".scroll-to-top").fadeIn(duration);
                        } else {
                            $(".scroll-to-top").fadeOut(duration);
                        }
                    });
                }
                $(".scroll-to-top").click(function(e) {
                    e.preventDefault();
                    $("html, body").animate({
                        scrollTop: 0
                    }, duration);
                    return false;
                });
            };
            // Hanlde 100% height elements(block, portlet, etc)
            var handle100HeightContent = function() {
                $(".full-height-content").each(function() {
                    var target = $(this);
                    var height;
                    height = App.getViewPort().height - $(".page-header").outerHeight(true) - $(".page-footer").outerHeight(true) - $(".page-title").outerHeight(true) - $(".page-bar").outerHeight(true);
                    if (target.hasClass("portlet")) {
                        var portletBody = target.find(".portlet-body");
                        App.destroySlimScroll(portletBody.find(".full-height-content-body"));
                        // destroy slimscroll
                        height = height - target.find(".portlet-title").outerHeight(true) - parseInt(target.find(".portlet-body").css("padding-top")) - parseInt(target.find(".portlet-body").css("padding-bottom")) - 5;
                        if (App.getViewPort().width >= resBreakpointMd && target.hasClass("full-height-content-scrollable")) {
                            height = height - 35;
                            portletBody.find(".full-height-content-body").css("height", height);
                            App.initSlimScroll(portletBody.find(".full-height-content-body"));
                        } else {
                            portletBody.css("min-height", height);
                        }
                    } else {
                        App.destroySlimScroll(target.find(".full-height-content-body"));
                        // destroy slimscroll
                        if (App.p().width >= resBreakpointMd && target.hasClass("full-height-content-scrollable")) {
                            height = height - 35;
                            target.find(".full-height-content-body").css("height", height);
                            App.initSlimScroll(target.find(".full-height-content-body"));
                        } else {
                            target.css("min-height", height);
                        }
                    }
                });
            };
            //* END:CORE HANDLERS *//
            return {
                // Main init methods to initialize the layout
                //IMPORTANT!!!: Do not modify the core handlers call order.
                initHeader: function() {
                    handleHorizontalMenu();
                },
                setSidebarMenuActiveLink: function(mode, el) {
                    handleSidebarMenuActiveLink(mode, el, null);
                },
                setAngularJsSidebarMenuActiveLink: function(mode, el, $state) {
                    handleSidebarMenuActiveLink(mode, el, $state);
                },
                initSidebar: function($state) {
                    //layout handlers
                    handleFixedSidebar();
                    // handles fixed sidebar menu
                    handleSidebarMenu();
                    // handles main menu
                    handleSidebarToggler();
                    // handles sidebar hide/show
                    if (App.isAngularJsApp()) {
                        handleSidebarMenuActiveLink("match", null, $state);
                    }
                    App.addResizeHandler(handleFixedSidebar);
                },
                initContent: function() {
                    handle100HeightContent();
                    // handles 100% height elements(block, portlet, etc)
                    handleTabs();
                    // handle bootstrah tabs
                    App.addResizeHandler(handleSidebarAndContentHeight);
                    // recalculate sidebar & content height on window resize
                    App.addResizeHandler(handle100HeightContent);
                },
                initFooter: function() {
                    handleGoTop();
                },
                init: function() {
                    this.initHeader();
                    this.initSidebar(null);
                    this.initContent();
                    this.initFooter();
                },
                loadAjaxContent: function(url, sidebarMenuLink) {
                    var pageContent = $(".page-content .page-content-body");
                    App.startPageLoading({
                        animate: true
                    });
                    $.ajax({
                        type: "GET",
                        cache: false,
                        url: url,
                        dataType: "html",
                        success: function(res) {
                            App.stopPageLoading();
                            pageContent.html(res);
                            for (var i = 0; i < ajaxContentSuccessCallbacks.length; i++) {
                                ajaxContentSuccessCallbacks[i].call(res);
                            }
                            if (sidebarMenuLink.size() > 0 && sidebarMenuLink.parents("li.open").size() === 0) {
                                $(".page-sidebar-menu > li.open > a").click();
                            }
                            Layout.fixContentHeight();
                            // fix content height
                            App.initAjax();
                        },
                        error: function(res, ajaxOptions, thrownError) {
                            App.stopPageLoading();
                            pageContent.html("<h4>Could not load the requested content.</h4>");
                            for (var i = 0; i < ajaxContentErrorCallbacks.length; i++) {
                                ajaxContentErrorCallbacks[i].call(res);
                            }
                        }
                    });
                },
                addAjaxContentSuccessCallback: function(callback) {
                    ajaxContentSuccessCallbacks.push(callback);
                },
                addAjaxContentErrorCallback: function(callback) {
                    ajaxContentErrorCallbacks.push(callback);
                },
                //public function to fix the sidebar and content height accordingly
                fixContentHeight: function() {
                    handleSidebarAndContentHeight();
                },
                initFixedSidebarHoverEffect: function() {
                    handleFixedSidebarHoverEffect();
                },
                initFixedSidebar: function() {
                    handleFixedSidebar();
                },
                getLayoutImgPath: function() {
                    return App.getAssetsPath() + layoutImgPath;
                },
                getLayoutCssPath: function() {
                    return App.getAssetsPath() + layoutCssPath;
                }
            };
        }();
        if (App.isAngularJsApp() === false) {
            jQuery(document).ready(function() {
                Layout.init();
            });
        }
    };
}, {});

define("#/shine-metron/0.1.21/layer-debug", [], function(require, exports, module, installOption) {
    /*!

 @Name：layer v2.4 弹层组件
 @Author：贤心
 @Site：http://layer.layui.com
 @License：LGPL
    
 */
    null;
    module.exports = function(jQuery) {
        !function(window, undefined) {
            "use strict";
            var $, win, ready = {
                getPath: function() {
                    var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
                    if (script.getAttribute("merge")) return;
                    return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
                }(),
                //屏蔽Enter触发弹层
                enter: function(e) {
                    if (e.keyCode === 13) e.preventDefault();
                },
                config: {},
                end: {},
                btn: [ "&#x786E;&#x5B9A;", "&#x53D6;&#x6D88;" ],
                //五种原始层模式
                type: [ "dialog", "page", "iframe", "loading", "tips" ]
            };
            //默认内置方法。
            var layer = {
                v: "2.4",
                ie6: !!window.ActiveXObject && !window.XMLHttpRequest,
                index: window.layer && window.layer.v ? 1e5 : 0,
                path: ready.getPath,
                config: function(options, fn) {
                    var item = 0;
                    options = options || {};
                    layer.cache = ready.config = $.extend(ready.config, options);
                    layer.path = ready.config.path || layer.path;
                    typeof options.extend === "string" && (options.extend = [ options.extend ]);
                    layer.use("skin/default/layer.css", options.extend && options.extend.length > 0 ? function loop() {
                        var ext = options.extend;
                        layer.use(ext[ext[item] ? item : item - 1], item < ext.length ? function() {
                            ++item;
                            return loop;
                        }() : fn);
                    }() : fn);
                    return this;
                },
                //载入配件
                use: function(module, fn, readyMethod) {
                    var i = 0, head = $("head")[0];
                    var module = module.replace(/\s/g, "");
                    var iscss = /\.css$/.test(module);
                    var node = document.createElement(iscss ? "link" : "script");
                    var id = "layui_layer_" + module.replace(/\.|\//g, "");
                    if (!layer.path) return;
                    if (iscss) {
                        node.rel = "stylesheet";
                    }
                    node[iscss ? "href" : "src"] = /^http:\/\//.test(module) ? module : layer.path + module;
                    node.id = id;
                    if (!$("#" + id)[0]) {
                        head.appendChild(node);
                    }
                    (function poll() {
                        (iscss ? parseInt($("#" + id).css("width")) === 1989 : layer[readyMethod || id]) ? function() {
                            fn && fn();
                            try {
                                iscss || head.removeChild(node);
                            } catch (e) {}
                        }() : setTimeout(poll, 100);
                    })();
                    return this;
                },
                ready: function(path, fn) {
                    var type = typeof path === "function";
                    if (type) fn = path;
                    layer.config($.extend(ready.config, function() {
                        return type ? {} : {
                            path: path
                        };
                    }()), fn);
                    return this;
                },
                //各种快捷引用
                alert: function(content, options, yes) {
                    var type = typeof options === "function";
                    if (type) yes = options;
                    return layer.open($.extend({
                        content: content,
                        yes: yes
                    }, type ? {} : options));
                },
                confirm: function(content, options, yes, cancel) {
                    var type = typeof options === "function";
                    if (type) {
                        cancel = yes;
                        yes = options;
                    }
                    return layer.open($.extend({
                        content: content,
                        btn: ready.btn,
                        yes: yes,
                        btn2: cancel
                    }, type ? {} : options));
                },
                msg: function(content, options, end) {
                    //最常用提示层
                    var type = typeof options === "function", rskin = ready.config.skin;
                    var skin = (rskin ? rskin + " " + rskin + "-msg" : "") || "layui-layer-msg";
                    var shift = doms.anim.length - 1;
                    if (type) end = options;
                    return layer.open($.extend({
                        content: content,
                        time: 3e3,
                        shade: false,
                        skin: skin,
                        title: false,
                        closeBtn: false,
                        btn: false,
                        end: end
                    }, type && !ready.config.skin ? {
                        skin: skin + " layui-layer-hui",
                        shift: shift
                    } : function() {
                        options = options || {};
                        if (options.icon === -1 || options.icon === undefined && !ready.config.skin) {
                            options.skin = skin + " " + (options.skin || "layui-layer-hui");
                        }
                        return options;
                    }()));
                },
                load: function(icon, options) {
                    return layer.open($.extend({
                        type: 3,
                        icon: icon || 0,
                        shade: .01
                    }, options));
                },
                tips: function(content, follow, options) {
                    return layer.open($.extend({
                        type: 4,
                        content: [ content, follow ],
                        closeBtn: false,
                        time: 3e3,
                        shade: false,
                        fix: false,
                        maxWidth: 210
                    }, options));
                }
            };
            var Class = function(setings) {
                var that = this;
                that.index = ++layer.index;
                that.config = $.extend({}, that.config, ready.config, setings);
                that.creat();
            };
            Class.pt = Class.prototype;
            //缓存常用字符
            var doms = [ "layui-layer", ".layui-layer-title", ".layui-layer-main", ".layui-layer-dialog", "layui-layer-iframe", "layui-layer-content", "layui-layer-btn", "layui-layer-close" ];
            doms.anim = [ "layer-anim", "layer-anim-01", "layer-anim-02", "layer-anim-03", "layer-anim-04", "layer-anim-05", "layer-anim-06" ];
            //默认配置
            Class.pt.config = {
                type: 0,
                shade: .3,
                fix: true,
                move: doms[1],
                title: "&#x4FE1;&#x606F;",
                offset: "auto",
                area: "auto",
                closeBtn: 1,
                time: 0,
                //0表示不自动关闭
                zIndex: 19891014,
                maxWidth: 360,
                shift: 0,
                icon: -1,
                scrollbar: true,
                //是否允许浏览器滚动条
                tips: 2
            };
            //容器
            Class.pt.vessel = function(conType, callback) {
                var that = this, times = that.index, config = that.config;
                var zIndex = config.zIndex + times, titype = typeof config.title === "object";
                var ismax = config.maxmin && (config.type === 1 || config.type === 2);
                var titleHTML = config.title ? '<div class="layui-layer-title" style="' + (titype ? config.title[1] : "") + '">' + (titype ? config.title[0] : config.title) + "</div>" : "";
                config.zIndex = zIndex;
                callback([ //遮罩
                config.shade ? '<div class="layui-layer-shade" id="layui-layer-shade' + times + '" times="' + times + '" style="' + ("z-index:" + (zIndex - 1) + "; background-color:" + (config.shade[1] || "#000") + "; opacity:" + (config.shade[0] || config.shade) + "; filter:alpha(opacity=" + (config.shade[0] * 100 || config.shade * 100) + ");") + '"></div>' : "", //主体
                '<div class="' + doms[0] + (" layui-layer-" + ready.type[config.type]) + ((config.type == 0 || config.type == 2) && !config.shade ? " layui-layer-border" : "") + " " + (config.skin || "") + '" id="' + doms[0] + times + '" type="' + ready.type[config.type] + '" times="' + times + '" showtime="' + config.time + '" conType="' + (conType ? "object" : "string") + '" style="z-index: ' + zIndex + "; width:" + config.area[0] + ";height:" + config.area[1] + (config.fix ? "" : ";position:absolute;") + '">' + (conType && config.type != 2 ? "" : titleHTML) + '<div id="' + (config.id || "") + '" class="layui-layer-content' + (config.type == 0 && config.icon !== -1 ? " layui-layer-padding" : "") + (config.type == 3 ? " layui-layer-loading" + config.icon : "") + '">' + (config.type == 0 && config.icon !== -1 ? '<i class="layui-layer-ico layui-layer-ico' + config.icon + '"></i>' : "") + (config.type == 1 && conType ? "" : config.content || "") + "</div>" + '<span class="layui-layer-setwin">' + function() {
                    var closebtn = ismax ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : "";
                    config.closeBtn && (closebtn += '<a class="layui-layer-ico ' + doms[7] + " " + doms[7] + (config.title ? config.closeBtn : config.type == 4 ? "1" : "2") + '" href="javascript:;"></a>');
                    return closebtn;
                }() + "</span>" + (config.btn ? function() {
                    var button = "";
                    typeof config.btn === "string" && (config.btn = [ config.btn ]);
                    for (var i = 0, len = config.btn.length; i < len; i++) {
                        button += '<a class="' + doms[6] + "" + i + '">' + config.btn[i] + "</a>";
                    }
                    return '<div class="' + doms[6] + '">' + button + "</div>";
                }() : "") + "</div>" ], titleHTML);
                return that;
            };
            //创建骨架
            Class.pt.creat = function() {
                var that = this, config = that.config, times = that.index, nodeIndex;
                var content = config.content, conType = typeof content === "object";
                if ($("#" + config.id)[0]) return;
                if (typeof config.area === "string") {
                    config.area = config.area === "auto" ? [ "", "" ] : [ config.area, "" ];
                }
                switch (config.type) {
                  case 0:
                    config.btn = "btn" in config ? config.btn : ready.btn[0];
                    layer.closeAll("dialog");
                    break;

                  case 2:
                    var content = config.content = conType ? config.content : [ config.content || "http://layer.layui.com", "auto" ];
                    config.content = '<iframe scrolling="' + (config.content[1] || "auto") + '" allowtransparency="true" id="' + doms[4] + "" + times + '" name="' + doms[4] + "" + times + '" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="' + config.content[0] + '"></iframe>';
                    break;

                  case 3:
                    config.title = false;
                    config.closeBtn = false;
                    config.icon === -1 && config.icon === 0;
                    layer.closeAll("loading");
                    break;

                  case 4:
                    conType || (config.content = [ config.content, "body" ]);
                    config.follow = config.content[1];
                    config.content = config.content[0] + '<i class="layui-layer-TipsG"></i>';
                    config.title = false;
                    config.tips = typeof config.tips === "object" ? config.tips : [ config.tips, true ];
                    config.tipsMore || layer.closeAll("tips");
                    break;
                }
                //建立容器
                that.vessel(conType, function(html, titleHTML) {
                    $("body").append(html[0]);
                    conType ? function() {
                        config.type == 2 || config.type == 4 ? function() {
                            $("body").append(html[1]);
                        }() : function() {
                            if (!content.parents("." + doms[0])[0]) {
                                content.show().addClass("layui-layer-wrap").wrap(html[1]);
                                $("#" + doms[0] + times).find("." + doms[5]).before(titleHTML);
                            }
                        }();
                    }() : $("body").append(html[1]);
                    that.layero = $("#" + doms[0] + times);
                    config.scrollbar || doms.html.css("overflow", "hidden").attr("layer-full", times);
                }).auto(times);
                config.type == 2 && layer.ie6 && that.layero.find("iframe").attr("src", content[0]);
                $(document).off("keydown", ready.enter).on("keydown", ready.enter);
                that.layero.on("keydown", function(e) {
                    $(document).off("keydown", ready.enter);
                });
                //坐标自适应浏览器窗口尺寸
                config.type == 4 ? that.tips() : that.offset();
                if (config.fix) {
                    win.on("resize", function() {
                        that.offset();
                        (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) && that.auto(times);
                        config.type == 4 && that.tips();
                    });
                }
                config.time <= 0 || setTimeout(function() {
                    layer.close(that.index);
                }, config.time);
                that.move().callback();
                //为兼容jQuery3.0的css动画影响元素尺寸计算
                if (doms.anim[config.shift]) {
                    that.layero.addClass(doms.anim[config.shift]);
                }
            };
            //自适应
            Class.pt.auto = function(index) {
                var that = this, config = that.config, layero = $("#" + doms[0] + index);
                if (config.area[0] === "" && config.maxWidth > 0) {
                    //为了修复IE7下一个让人难以理解的bug
                    if (/MSIE 7/.test(navigator.userAgent) && config.btn) {
                        layero.width(layero.innerWidth());
                    }
                    layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
                }
                var area = [ layero.innerWidth(), layero.innerHeight() ];
                var titHeight = layero.find(doms[1]).outerHeight() || 0;
                var btnHeight = layero.find("." + doms[6]).outerHeight() || 0;
                function setHeight(elem) {
                    elem = layero.find(elem);
                    elem.height(area[1] - titHeight - btnHeight - 2 * (parseFloat(elem.css("padding")) | 0));
                }
                switch (config.type) {
                  case 2:
                    setHeight("iframe");
                    break;

                  default:
                    if (config.area[1] === "") {
                        if (config.fix && area[1] >= win.height()) {
                            area[1] = win.height();
                            setHeight("." + doms[5]);
                        }
                    } else {
                        setHeight("." + doms[5]);
                    }
                    break;
                }
                return that;
            };
            //计算坐标
            Class.pt.offset = function() {
                var that = this, config = that.config, layero = that.layero;
                var area = [ layero.outerWidth(), layero.outerHeight() ];
                var type = typeof config.offset === "object";
                that.offsetTop = (win.height() - area[1]) / 2;
                that.offsetLeft = (win.width() - area[0]) / 2;
                if (type) {
                    that.offsetTop = config.offset[0];
                    that.offsetLeft = config.offset[1] || that.offsetLeft;
                } else if (config.offset !== "auto") {
                    that.offsetTop = config.offset;
                    if (config.offset === "rb") {
                        //右下角
                        that.offsetTop = win.height() - area[1];
                        that.offsetLeft = win.width() - area[0];
                    }
                }
                if (!config.fix) {
                    that.offsetTop = /%$/.test(that.offsetTop) ? win.height() * parseFloat(that.offsetTop) / 100 : parseFloat(that.offsetTop);
                    that.offsetLeft = /%$/.test(that.offsetLeft) ? win.width() * parseFloat(that.offsetLeft) / 100 : parseFloat(that.offsetLeft);
                    that.offsetTop += win.scrollTop();
                    that.offsetLeft += win.scrollLeft();
                }
                layero.css({
                    top: that.offsetTop,
                    left: that.offsetLeft
                });
            };
            //Tips
            Class.pt.tips = function() {
                var that = this, config = that.config, layero = that.layero;
                var layArea = [ layero.outerWidth(), layero.outerHeight() ], follow = $(config.follow);
                if (!follow[0]) follow = $("body");
                var goal = {
                    width: follow.outerWidth(),
                    height: follow.outerHeight(),
                    top: follow.offset().top,
                    left: follow.offset().left
                }, tipsG = layero.find(".layui-layer-TipsG");
                var guide = config.tips[0];
                config.tips[1] || tipsG.remove();
                goal.autoLeft = function() {
                    if (goal.left + layArea[0] - win.width() > 0) {
                        goal.tipLeft = goal.left + goal.width - layArea[0];
                        tipsG.css({
                            right: 12,
                            left: "auto"
                        });
                    } else {
                        goal.tipLeft = goal.left;
                    }
                };
                //辨别tips的方位
                goal.where = [ function() {
                    //上
                    goal.autoLeft();
                    goal.tipTop = goal.top - layArea[1] - 10;
                    tipsG.removeClass("layui-layer-TipsB").addClass("layui-layer-TipsT").css("border-right-color", config.tips[1]);
                }, function() {
                    //右
                    goal.tipLeft = goal.left + goal.width + 10;
                    goal.tipTop = goal.top;
                    tipsG.removeClass("layui-layer-TipsL").addClass("layui-layer-TipsR").css("border-bottom-color", config.tips[1]);
                }, function() {
                    //下
                    goal.autoLeft();
                    goal.tipTop = goal.top + goal.height + 10;
                    tipsG.removeClass("layui-layer-TipsT").addClass("layui-layer-TipsB").css("border-right-color", config.tips[1]);
                }, function() {
                    //左
                    goal.tipLeft = goal.left - layArea[0] - 10;
                    goal.tipTop = goal.top;
                    tipsG.removeClass("layui-layer-TipsR").addClass("layui-layer-TipsL").css("border-bottom-color", config.tips[1]);
                } ];
                goal.where[guide - 1]();
                /* 8*2为小三角形占据的空间 */
                if (guide === 1) {
                    goal.top - (win.scrollTop() + layArea[1] + 8 * 2) < 0 && goal.where[2]();
                } else if (guide === 2) {
                    win.width() - (goal.left + goal.width + layArea[0] + 8 * 2) > 0 || goal.where[3]();
                } else if (guide === 3) {
                    goal.top - win.scrollTop() + goal.height + layArea[1] + 8 * 2 - win.height() > 0 && goal.where[0]();
                } else if (guide === 4) {
                    layArea[0] + 8 * 2 - goal.left > 0 && goal.where[1]();
                }
                layero.find("." + doms[5]).css({
                    "background-color": config.tips[1],
                    "padding-right": config.closeBtn ? "30px" : ""
                });
                layero.css({
                    left: goal.tipLeft - (config.fix ? win.scrollLeft() : 0),
                    top: goal.tipTop - (config.fix ? win.scrollTop() : 0)
                });
            };
            //拖拽层
            Class.pt.move = function() {
                var that = this, config = that.config, conf = {
                    setY: 0,
                    moveLayer: function() {
                        var layero = conf.layero, mgleft = parseInt(layero.css("margin-left"));
                        var lefts = parseInt(conf.move.css("left"));
                        mgleft === 0 || (lefts = lefts - mgleft);
                        if (layero.css("position") !== "fixed") {
                            lefts = lefts - layero.parent().offset().left;
                            conf.setY = 0;
                        }
                        layero.css({
                            left: lefts,
                            top: parseInt(conf.move.css("top")) - conf.setY
                        });
                    }
                };
                var movedom = that.layero.find(config.move);
                config.move && movedom.attr("move", "ok");
                movedom.css({
                    cursor: config.move ? "move" : "auto"
                });
                $(config.move).on("mousedown", function(M) {
                    M.preventDefault();
                    if ($(this).attr("move") === "ok") {
                        conf.ismove = true;
                        conf.layero = $(this).parents("." + doms[0]);
                        var xx = conf.layero.offset().left, yy = conf.layero.offset().top, ww = conf.layero.outerWidth() - 6, hh = conf.layero.outerHeight() - 6;
                        if (!$("#layui-layer-moves")[0]) {
                            $("body").append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:' + xx + "px; top:" + yy + "px; width:" + ww + "px; height:" + hh + 'px; z-index:2147483584"></div>');
                        }
                        conf.move = $("#layui-layer-moves");
                        config.moveType && conf.move.css({
                            visibility: "hidden"
                        });
                        conf.moveX = M.pageX - conf.move.position().left;
                        conf.moveY = M.pageY - conf.move.position().top;
                        conf.layero.css("position") !== "fixed" || (conf.setY = win.scrollTop());
                    }
                });
                $(document).mousemove(function(M) {
                    if (conf.ismove) {
                        var offsetX = M.pageX - conf.moveX, offsetY = M.pageY - conf.moveY;
                        M.preventDefault();
                        //控制元素不被拖出窗口外
                        if (!config.moveOut) {
                            conf.setY = win.scrollTop();
                            var setRig = win.width() - conf.move.outerWidth(), setTop = conf.setY;
                            offsetX < 0 && (offsetX = 0);
                            offsetX > setRig && (offsetX = setRig);
                            offsetY < setTop && (offsetY = setTop);
                            offsetY > win.height() - conf.move.outerHeight() + conf.setY && (offsetY = win.height() - conf.move.outerHeight() + conf.setY);
                        }
                        conf.move.css({
                            left: offsetX,
                            top: offsetY
                        });
                        config.moveType && conf.moveLayer();
                        offsetX = offsetY = setRig = setTop = null;
                    }
                }).mouseup(function() {
                    try {
                        if (conf.ismove) {
                            conf.moveLayer();
                            conf.move.remove();
                            config.moveEnd && config.moveEnd();
                        }
                        conf.ismove = false;
                    } catch (e) {
                        conf.ismove = false;
                    }
                });
                return that;
            };
            Class.pt.callback = function() {
                var that = this, layero = that.layero, config = that.config;
                that.openLayer();
                if (config.success) {
                    if (config.type == 2) {
                        layero.find("iframe").on("load", function() {
                            config.success(layero, that.index);
                        });
                    } else {
                        config.success(layero, that.index);
                    }
                }
                layer.ie6 && that.IE6(layero);
                //按钮
                layero.find("." + doms[6]).children("a").on("click", function() {
                    var index = $(this).index();
                    if (index === 0) {
                        if (config.yes) {
                            config.yes(that.index, layero);
                        } else if (config["btn1"]) {
                            config["btn1"](that.index, layero);
                        } else {
                            layer.close(that.index);
                        }
                    } else {
                        var close = config["btn" + (index + 1)] && config["btn" + (index + 1)](that.index, layero);
                        close === false || layer.close(that.index);
                    }
                });
                //取消
                function cancel() {
                    var close = config.cancel && config.cancel(that.index, layero);
                    close === false || layer.close(that.index);
                }
                //右上角关闭回调
                layero.find("." + doms[7]).on("click", cancel);
                //点遮罩关闭
                if (config.shadeClose) {
                    $("#layui-layer-shade" + that.index).on("click", function() {
                        layer.close(that.index);
                    });
                }
                //最小化
                layero.find(".layui-layer-min").on("click", function() {
                    var min = config.min && config.min(layero);
                    min === false || layer.min(that.index, config);
                });
                //全屏/还原
                layero.find(".layui-layer-max").on("click", function() {
                    if ($(this).hasClass("layui-layer-maxmin")) {
                        layer.restore(that.index);
                        config.restore && config.restore(layero);
                    } else {
                        layer.full(that.index, config);
                        setTimeout(function() {
                            config.full && config.full(layero);
                        }, 100);
                    }
                });
                config.end && (ready.end[that.index] = config.end);
            };
            //for ie6 恢复select
            ready.reselect = function() {
                $.each($("select"), function(index, value) {
                    var sthis = $(this);
                    if (!sthis.parents("." + doms[0])[0]) {
                        sthis.attr("layer") == 1 && $("." + doms[0]).length < 1 && sthis.removeAttr("layer").show();
                    }
                    sthis = null;
                });
            };
            Class.pt.IE6 = function(layero) {
                var that = this, _ieTop = layero.offset().top;
                //ie6的固定与相对定位
                function ie6Fix() {
                    layero.css({
                        top: _ieTop + (that.config.fix ? win.scrollTop() : 0)
                    });
                }
                ie6Fix();
                win.scroll(ie6Fix);
                //隐藏select
                $("select").each(function(index, value) {
                    var sthis = $(this);
                    if (!sthis.parents("." + doms[0])[0]) {
                        sthis.css("display") === "none" || sthis.attr({
                            layer: "1"
                        }).hide();
                    }
                    sthis = null;
                });
            };
            //需依赖原型的对外方法
            Class.pt.openLayer = function() {
                var that = this;
                //置顶当前窗口
                layer.zIndex = that.config.zIndex;
                layer.setTop = function(layero) {
                    var setZindex = function() {
                        layer.zIndex++;
                        layero.css("z-index", layer.zIndex + 1);
                    };
                    layer.zIndex = parseInt(layero[0].style.zIndex);
                    layero.on("mousedown", setZindex);
                    return layer.zIndex;
                };
            };
            ready.record = function(layero) {
                var area = [ layero.width(), layero.height(), layero.position().top, layero.position().left + parseFloat(layero.css("margin-left")) ];
                layero.find(".layui-layer-max").addClass("layui-layer-maxmin");
                layero.attr({
                    area: area
                });
            };
            ready.rescollbar = function(index) {
                if (doms.html.attr("layer-full") == index) {
                    if (doms.html[0].style.removeProperty) {
                        doms.html[0].style.removeProperty("overflow");
                    } else {
                        doms.html[0].style.removeAttribute("overflow");
                    }
                    doms.html.removeAttr("layer-full");
                }
            };
            /** 内置成员 */
            window.layer = layer;
            //获取子iframe的DOM
            layer.getChildFrame = function(selector, index) {
                index = index || $("." + doms[4]).attr("times");
                return $("#" + doms[0] + index).find("iframe").contents().find(selector);
            };
            //得到当前iframe层的索引，子iframe时使用
            layer.getFrameIndex = function(name) {
                return $("#" + name).parents("." + doms[4]).attr("times");
            };
            //iframe层自适应宽高
            layer.iframeAuto = function(index) {
                if (!index) return;
                var heg = layer.getChildFrame("html", index).outerHeight();
                var layero = $("#" + doms[0] + index);
                var titHeight = layero.find(doms[1]).outerHeight() || 0;
                var btnHeight = layero.find("." + doms[6]).outerHeight() || 0;
                layero.css({
                    height: heg + titHeight + btnHeight
                });
                layero.find("iframe").css({
                    height: heg
                });
            };
            //重置iframe url
            layer.iframeSrc = function(index, url) {
                $("#" + doms[0] + index).find("iframe").attr("src", url);
            };
            //设定层的样式
            layer.style = function(index, options) {
                var layero = $("#" + doms[0] + index), type = layero.attr("type");
                var titHeight = layero.find(doms[1]).outerHeight() || 0;
                var btnHeight = layero.find("." + doms[6]).outerHeight() || 0;
                if (type === ready.type[1] || type === ready.type[2]) {
                    layero.css(options);
                    if (type === ready.type[2]) {
                        layero.find("iframe").css({
                            height: parseFloat(options.height) - titHeight - btnHeight
                        });
                    }
                }
            };
            //最小化
            layer.min = function(index, options) {
                var layero = $("#" + doms[0] + index);
                var titHeight = layero.find(doms[1]).outerHeight() || 0;
                ready.record(layero);
                layer.style(index, {
                    width: 180,
                    height: titHeight,
                    overflow: "hidden"
                });
                layero.find(".layui-layer-min").hide();
                layero.attr("type") === "page" && layero.find(doms[4]).hide();
                ready.rescollbar(index);
            };
            //还原
            layer.restore = function(index) {
                var layero = $("#" + doms[0] + index), area = layero.attr("area").split(",");
                var type = layero.attr("type");
                layer.style(index, {
                    width: parseFloat(area[0]),
                    height: parseFloat(area[1]),
                    top: parseFloat(area[2]),
                    left: parseFloat(area[3]),
                    overflow: "visible"
                });
                layero.find(".layui-layer-max").removeClass("layui-layer-maxmin");
                layero.find(".layui-layer-min").show();
                layero.attr("type") === "page" && layero.find(doms[4]).show();
                ready.rescollbar(index);
            };
            //全屏
            layer.full = function(index) {
                var layero = $("#" + doms[0] + index), timer;
                ready.record(layero);
                if (!doms.html.attr("layer-full")) {
                    doms.html.css("overflow", "hidden").attr("layer-full", index);
                }
                clearTimeout(timer);
                timer = setTimeout(function() {
                    var isfix = layero.css("position") === "fixed";
                    layer.style(index, {
                        top: isfix ? 0 : win.scrollTop(),
                        left: isfix ? 0 : win.scrollLeft(),
                        width: win.width(),
                        height: win.height()
                    });
                    layero.find(".layui-layer-min").hide();
                }, 100);
            };
            //改变title
            layer.title = function(name, index) {
                var title = $("#" + doms[0] + (index || layer.index)).find(doms[1]);
                title.html(name);
            };
            //关闭layer总方法
            layer.close = function(index) {
                var layero = $("#" + doms[0] + index), type = layero.attr("type");
                if (!layero[0]) return;
                if (type === ready.type[1] && layero.attr("conType") === "object") {
                    layero.children(":not(." + doms[5] + ")").remove();
                    for (var i = 0; i < 2; i++) {
                        layero.find(".layui-layer-wrap").unwrap().hide();
                    }
                } else {
                    //低版本IE 回收 iframe
                    if (type === ready.type[2]) {
                        try {
                            var iframe = $("#" + doms[4] + index)[0];
                            iframe.contentWindow.document.write("");
                            iframe.contentWindow.close();
                            layero.find("." + doms[5])[0].removeChild(iframe);
                        } catch (e) {}
                    }
                    layero[0].innerHTML = "";
                    layero.remove();
                }
                $("#layui-layer-moves, #layui-layer-shade" + index).remove();
                layer.ie6 && ready.reselect();
                ready.rescollbar(index);
                $(document).off("keydown", ready.enter);
                typeof ready.end[index] === "function" && ready.end[index]();
                delete ready.end[index];
            };
            //关闭所有层
            layer.closeAll = function(type) {
                $.each($("." + doms[0]), function() {
                    var othis = $(this);
                    var is = type ? othis.attr("type") === type : 1;
                    is && layer.close(othis.attr("times"));
                    is = null;
                });
            };
            /**

         拓展模块，layui开始合并在一起

         */
            var cache = layer.cache || {}, skin = function(type) {
                return cache.skin ? " " + cache.skin + " " + cache.skin + "-" + type : "";
            };
            //仿系统prompt
            layer.prompt = function(options, yes) {
                options = options || {};
                if (typeof options === "function") yes = options;
                var prompt, content = options.formType == 2 ? '<textarea class="layui-layer-input">' + (options.value || "") + "</textarea>" : function() {
                    return '<input type="' + (options.formType == 1 ? "password" : "text") + '" class="layui-layer-input" value="' + (options.value || "") + '">';
                }();
                return layer.open($.extend({
                    btn: [ "&#x786E;&#x5B9A;", "&#x53D6;&#x6D88;" ],
                    content: content,
                    skin: "layui-layer-prompt" + skin("prompt"),
                    success: function(layero) {
                        prompt = layero.find(".layui-layer-input");
                        prompt.focus();
                    },
                    yes: function(index) {
                        var value = prompt.val();
                        if (value === "") {
                            prompt.focus();
                        } else if (value.length > (options.maxlength || 500)) {
                            layer.tips("&#x6700;&#x591A;&#x8F93;&#x5165;" + (options.maxlength || 500) + "&#x4E2A;&#x5B57;&#x6570;", prompt, {
                                tips: 1
                            });
                        } else {
                            yes && yes(value, index, prompt);
                        }
                    }
                }, options));
            };
            //tab层
            layer.tab = function(options) {
                options = options || {};
                var tab = options.tab || {};
                return layer.open($.extend({
                    type: 1,
                    skin: "layui-layer-tab" + skin("tab"),
                    title: function() {
                        var len = tab.length, ii = 1, str = "";
                        if (len > 0) {
                            str = '<span class="layui-layer-tabnow">' + tab[0].title + "</span>";
                            for (;ii < len; ii++) {
                                str += "<span>" + tab[ii].title + "</span>";
                            }
                        }
                        return str;
                    }(),
                    content: '<ul class="layui-layer-tabmain">' + function() {
                        var len = tab.length, ii = 1, str = "";
                        if (len > 0) {
                            str = '<li class="layui-layer-tabli xubox_tab_layer">' + (tab[0].content || "no content") + "</li>";
                            for (;ii < len; ii++) {
                                str += '<li class="layui-layer-tabli">' + (tab[ii].content || "no  content") + "</li>";
                            }
                        }
                        return str;
                    }() + "</ul>",
                    success: function(layero) {
                        var btn = layero.find(".layui-layer-title").children();
                        var main = layero.find(".layui-layer-tabmain").children();
                        btn.on("mousedown", function(e) {
                            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                            var othis = $(this), index = othis.index();
                            othis.addClass("layui-layer-tabnow").siblings().removeClass("layui-layer-tabnow");
                            main.eq(index).show().siblings().hide();
                            typeof options.change === "function" && options.change(index);
                        });
                    }
                }, options));
            };
            //相册层
            layer.photos = function(options, loop, key) {
                var dict = {};
                options = options || {};
                if (!options.photos) return;
                var type = options.photos.constructor === Object;
                var photos = type ? options.photos : {}, data = photos.data || [];
                var start = photos.start || 0;
                dict.imgIndex = (start | 0) + 1;
                options.img = options.img || "img";
                if (!type) {
                    //页面直接获取
                    var parent = $(options.photos), pushData = function() {
                        data = [];
                        parent.find(options.img).each(function(index) {
                            var othis = $(this);
                            othis.attr("layer-index", index);
                            data.push({
                                alt: othis.attr("alt"),
                                pid: othis.attr("layer-pid"),
                                src: othis.attr("layer-src") || othis.attr("src"),
                                thumb: othis.attr("src")
                            });
                        });
                    };
                    pushData();
                    if (data.length === 0) return;
                    loop || parent.on("click", options.img, function() {
                        var othis = $(this), index = othis.attr("layer-index");
                        layer.photos($.extend(options, {
                            photos: {
                                start: index,
                                data: data,
                                tab: options.tab
                            },
                            full: options.full
                        }), true);
                        pushData();
                    });
                    //不直接弹出
                    if (!loop) return;
                } else if (data.length === 0) {
                    return layer.msg("&#x6CA1;&#x6709;&#x56FE;&#x7247;");
                }
                //上一张
                dict.imgprev = function(key) {
                    dict.imgIndex--;
                    if (dict.imgIndex < 1) {
                        dict.imgIndex = data.length;
                    }
                    dict.tabimg(key);
                };
                //下一张
                dict.imgnext = function(key, errorMsg) {
                    dict.imgIndex++;
                    if (dict.imgIndex > data.length) {
                        dict.imgIndex = 1;
                        if (errorMsg) {
                            return;
                        }
                    }
                    dict.tabimg(key);
                };
                //方向键
                dict.keyup = function(event) {
                    if (!dict.end) {
                        var code = event.keyCode;
                        event.preventDefault();
                        if (code === 37) {
                            dict.imgprev(true);
                        } else if (code === 39) {
                            dict.imgnext(true);
                        } else if (code === 27) {
                            layer.close(dict.index);
                        }
                    }
                };
                //切换
                dict.tabimg = function(key) {
                    if (data.length <= 1) return;
                    photos.start = dict.imgIndex - 1;
                    layer.close(dict.index);
                    layer.photos(options, true, key);
                };
                //一些动作
                dict.event = function() {
                    dict.bigimg.hover(function() {
                        dict.imgsee.show();
                    }, function() {
                        dict.imgsee.hide();
                    });
                    dict.bigimg.find(".layui-layer-imgprev").on("click", function(event) {
                        event.preventDefault();
                        dict.imgprev();
                    });
                    dict.bigimg.find(".layui-layer-imgnext").on("click", function(event) {
                        event.preventDefault();
                        dict.imgnext();
                    });
                    $(document).on("keyup", dict.keyup);
                };
                //图片预加载
                function loadImage(url, callback, error) {
                    var img = new Image();
                    img.src = url;
                    if (img.complete) {
                        return callback(img);
                    }
                    img.onload = function() {
                        img.onload = null;
                        callback(img);
                    };
                    img.onerror = function(e) {
                        img.onerror = null;
                        error(e);
                    };
                }
                dict.loadi = layer.load(1, {
                    shade: "shade" in options ? false : .9,
                    scrollbar: false
                });
                loadImage(data[start].src, function(img) {
                    layer.close(dict.loadi);
                    dict.index = layer.open($.extend({
                        type: 1,
                        area: function() {
                            var imgarea = [ img.width, img.height ];
                            var winarea = [ $(window).width() - 50, $(window).height() - 50 ];
                            if (!options.full && imgarea[0] > winarea[0]) {
                                imgarea[0] = winarea[0];
                                imgarea[1] = imgarea[0] * img.height / img.width;
                            }
                            return [ imgarea[0] + "px", imgarea[1] + "px" ];
                        }(),
                        title: false,
                        shade: .9,
                        shadeClose: true,
                        closeBtn: false,
                        move: ".layui-layer-phimg img",
                        moveType: 1,
                        scrollbar: false,
                        moveOut: true,
                        shift: Math.random() * 5 | 0,
                        skin: "layui-layer-photos" + skin("photos"),
                        content: '<div class="layui-layer-phimg">' + '<img src="' + data[start].src + '" alt="' + (data[start].alt || "") + '" layer-pid="' + data[start].pid + '">' + '<div class="layui-layer-imgsee">' + (data.length > 1 ? '<span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span>' : "") + '<div class="layui-layer-imgbar" style="display:' + (key ? "block" : "") + '"><span class="layui-layer-imgtit"><a href="javascript:;">' + (data[start].alt || "") + "</a><em>" + dict.imgIndex + "/" + data.length + "</em></span></div>" + "</div>" + "</div>",
                        success: function(layero, index) {
                            dict.bigimg = layero.find(".layui-layer-phimg");
                            dict.imgsee = layero.find(".layui-layer-imguide,.layui-layer-imgbar");
                            dict.event(layero);
                            options.tab && options.tab(data[start], layero);
                        },
                        end: function() {
                            dict.end = true;
                            $(document).off("keyup", dict.keyup);
                        }
                    }, options));
                }, function() {
                    layer.close(dict.loadi);
                    layer.msg("&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;<br>&#x662F;&#x5426;&#x7EE7;&#x7EED;&#x67E5;&#x770B;&#x4E0B;&#x4E00;&#x5F20;&#xFF1F;", {
                        time: 3e4,
                        btn: [ "&#x4E0B;&#x4E00;&#x5F20;", "&#x4E0D;&#x770B;&#x4E86;" ],
                        yes: function() {
                            data.length > 1 && dict.imgnext(true, true);
                        }
                    });
                });
            };
            //主入口
            ready.run = function() {
                $ = jQuery;
                win = $(window);
                doms.html = $("html");
                layer.open = function(deliver) {
                    var o = new Class(deliver);
                    return o.index;
                };
            };
            ready.run();
        }(window);
    };
}, {});