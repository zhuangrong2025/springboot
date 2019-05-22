define("#/xyz-alert/0.1.13/xyz-alert-debug", [ "#/sweetalert/sweetalert-debug", "#/jquery/jquery-debug" ], function(require, exports, module, installOption) {
    require("#/sweetalert/sweetalert-debug");
    var $ = require("#/jquery/jquery-debug");
    null;
    var swal = window.swal;
    var XyzAlert = {
        "default": function(contents, option, titles) {
            var options = {
                title: titles || "",
                text: contents,
                confirmButtonText: "确认",
                closeOnconfirm: true
            };
            $.extend(options, option || {});
            if (option && option.timer) {
                swal(options);
            } else if (options && (options.type === "input" || options.showLoaderOnConfirm)) {
                swal(options, options.success);
            } else {
                swal(options, function(isConfirm) {
                    if (isConfirm) {
                        if (options && options.confirm) {
                            options.confirm(isConfirm);
                        }
                    } else {
                        if (options && options.cancel) {
                            options.cancel(isConfirm);
                        }
                    }
                });
            }
        },
        info: function(contents, option, titles) {
            var fObj = formatContent(contents, option, "提示信息为空!");
            alertLevel("info", fObj.contents, fObj.option, titles);
        },
        success: function(contents, option, titles) {
            alertLevel("success", contents, option, titles);
        },
        warning: function(contents, option, titles) {
            var fObj = formatContent(contents, option, "警告信息为空!");
            alertLevel("warning", fObj.contents, fObj.option, titles);
        },
        error: function(contents, option, titles) {
            var fObj = formatContent(contents, option, "错误信息为空!");
            alertLevel("error", fObj.contents, fObj.option, titles);
        },
        formInfo: function(contents, target, option) {
            option.target = target;
            formAlert("info", contents, option);
        },
        formSuccess: function(contents, target, option) {
            option.target = target;
            formAlert("success", contents, option);
        },
        formWarning: function(contents, target, option) {
            option.target = target;
            formAlert("warning", contents, option);
        },
        formError: function(contents, target, option) {
            option.target = target;
            formAlert("danger", contents, option);
        },
        confirm: function(contents, option, title) {
            var opt = {
                title: title || "",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                closeOnCancel: true,
                showLoaderOnConfirm: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirm: function() {},
                cancel: function() {}
            };
            $.extend(opt, option || {});
            this[opt.type](contents, opt, "");
        },
        close: function() {
            swal.close();
        }
    };
    var formatContent = function(contents, option, emptyText) {
        if (!option) {
            option = {};
        }
        if (contents === undefined || contents === null) {
            return {
                contents: emptyText,
                option: option
            };
        }
        contents = contents.toString();
        if (contents.length > 500) {
            if (!option.html) {
                option.html = true;
                contents = '<div style="max-height: 250px;overflow: auto;">' + contents + "</div>";
            }
        }
        return {
            contents: contents,
            option: option
        };
    };
    var alertLevel = function(type, contents, option, titles) {
        var options = {
            type: type,
            title: titles || "",
            text: contents,
            closeOnconfirm: true,
            showCancelButton: false,
            confirmButtonText: "确认"
        };
        $.extend(options, option || {});
        swal(options, function(isConfirm) {
            if (isConfirm) {
                if (options && options.confirm) {
                    setTimeout(function() {
                        options.confirm(isConfirm);
                    }, 200);
                }
            } else {
                if (options && options.cancel) {
                    setTimeout(function() {
                        options.cancel(isConfirm);
                    }, 200);
                }
            }
        });
    };
    var formAlert = function(type, contents, option) {
        var position = "";
        var width = $(option.target).css("width").replace("px", "");
        var pwidth = width;
        if (option.position !== "full-top") {
            width = width * (option.widthper ? option.widthper : .33);
            position = option.position ? option.position + ":0px" : "";
        }
        var alerthtml = '<div class="row form-alert"><div class="alert alert-' + type + '" ' + 'style="position: absolute;z-index: 99;margin-left:5px;margin-right:5px;' + "opacity: 0.8;max-width:" + pwidth + "px;min-width:" + width + "px;" + position + '">';
        alerthtml += '<button data-dismiss="alert" class="close"></button>' + '<span style="white-space:pre-wrap;max-width:' + pwidth + "px;min-width:" + width + 'px;">' + contents + "<span>";
        alerthtml += "</div></div>";
        var timeOut = option.timeOut ? option.timeOut : 1500;
        var hideDuration = option.hideDuration ? option.hideDuration : 1e3;
        if ($(option.target).first().find(".form-alert").length > 0) {
            // $('.form-alert span').text(contents);
            // $('.form-alert').fadeIn();
            // setTimeout('$('.form-alert').fadeOut(' + hideDuration + ');', timeOut);
            // return
            $(option.target).first().find(".form-alert").remove();
        }
        $(option.target).first().prepend(alerthtml);
        setTimeout(function() {
            $(".form-alert").fadeOut(hideDuration);
        }, timeOut);
    };
    module.exports = XyzAlert;
}, {});