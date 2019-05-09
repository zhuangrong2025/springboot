define("#/shine-form/0.1.4/shine-form-debug", [ "#/jquery/jquery-debug" ], function(require, exports, module, installOption) {
    var $ = require("#/jquery/jquery-debug");
    var getForm = function(el) {
        //支持传入选择器字符串或jquery对象
        return el instanceof $ ? el : $(el);
    };
    var getValueOfCheckbox = function(result, name) {
        //复选框（独立+分组）
        //独立：返回选中项的值或null（未勾选）
        //分组：返回选中项的值组成的数组，否则为[]
        var oldVal = result[name];
        if (undefined === oldVal) {
            result[name] = this.checked ? this.value : null;
        } else if ($.isArray(oldVal)) {
            if (this.checked) {
                result[name].push(this.value);
            }
        } else {
            result[name] = null === oldVal ? [] : [ oldVal ];
            if (this.checked) {
                result[name].push(this.value);
            }
        }
    };
    var getValueOfSelect = function(result, name, type) {
        //原生下拉选择框
        //单选：返回选中项的值或null（未选中）
        //多选：返回选中项的值组成的数组，否则为[]（未选中）
        if ("select-multiple" === type) {
            //多选下拉选择框
            var vals = result[name] = [];
            $("option:selected", this).each(function() {
                vals.push(this.value);
            });
        } else {
            //单选下拉选择框
            result[name] = $(this).val();
        }
    };
    //获取表单域的值（组件+控件）
    var getValue = function(el) {
        var jqForm = getForm(el), result = {};
        //表单组件（依照组件内置方式取值）
        jqForm.find(".xyz_validate_inst").each(function() {
            var jdom = $(this);
            var instance = jdom.data("form");
            if (instance) {
                var name = jdom.attr("name");
                if (name) {
                    result[name] = instance.getValue();
                } else {
                    throw "表单组件未设置 name";
                }
            }
        });
        //表单控件（非组件）
        var handleComponent = function() {
            var tagName = this.tagName.toLowerCase(), name = this.name, type = this.type;
            if (name) {
                if ("radio" === type) {
                    //单选按钮
                    if (this.checked) {
                        result[name] = this.value;
                    }
                } else if ("checkbox" === type) {
                    //复选框（独立+分组）
                    getValueOfCheckbox.call(this, result, name);
                } else if ("select" === tagName) {
                    //原生下拉选择框
                    getValueOfSelect.call(this, result, name, type);
                } else {
                    //其它控件
                    result[name] = $(this).val();
                }
            }
        };
        jqForm.find(".xyz_validate_input").each(handleComponent);
        return result;
    };
    var setValueOfCheckbox = function(val) {
        //复选框（独立+分组）
        if ($.isArray(val)) {
            var curVal = this.value, found = false;
            $.each(val, function(i, gckVal) {
                gckVal = null === gckVal || undefined === gckVal ? "" : gckVal.toString();
                if (curVal === gckVal) {
                    found = true;
                    return false;
                }
            });
            this.checked = found ? true : false;
        } else {
            val = null === val || undefined === val ? "" : val.toString();
            this.checked = this.value === val ? true : false;
        }
    };
    var setValueOfSelect = function(val, type) {
        //原生下拉选择框
        if ("select-multiple" === type) {
            //多选下拉选择框
            if (!$.isArray(val)) {
                throw "多选下拉选择框传入值有误，必须为数组";
            }
            $("option", this).each(function() {
                var curVal = this.value, found = false;
                $.each(val, function(i, optVal) {
                    optVal = null === optVal || undefined === optVal ? "" : optVal.toString();
                    if (curVal === optVal) {
                        found = true;
                        return false;
                    }
                });
                this.selected = found ? true : false;
            });
        } else {
            //单选下拉选择框
            if ($.isArray(val) || $.isPlainObject(val)) {
                throw "单选下拉选择框传入值有误，必须非数组和json对象";
            }
            $(this).val(val);
        }
    };
    var setValue = function(el, values, editState) {
        var jqForm = getForm(el), instName = {};
        //表单组件（依照组件内置方式设值）
        jqForm.find(".xyz_validate_inst").each(function() {
            var jdom = $(this);
            var instance = jdom.data("form");
            if (instance) {
                var name = jdom.attr("name"), val = values[name];
                if (name && undefined !== val) {
                    instance.setValue(val);
                }
                if (editState && instance.getText) {
                    jqForm.find("[lbl][field=" + name + "]").text(instance.getText());
                }
                instName[name] = true;
            }
        });
        //表单控件（非组件）
        var handleComponent = function() {
            var tagName = this.tagName.toLowerCase(), name = this.name, type = this.type, val = values[name];
            if (name) {
                if ("radio" === type) {
                    //单选按钮
                    val = null === val || undefined === val ? "" : val.toString();
                    this.checked = val === this.value ? true : false;
                } else if ("checkbox" === type) {
                    //复选框（独立+分组）
                    setValueOfCheckbox.call(this, val);
                } else if ("select" === tagName) {
                    //原生下拉选择框
                    setValueOfSelect.call(this, val, type);
                } else {
                    //其它控件
                    $(this).val(val);
                }
            }
        };
        jqForm.find(".xyz_validate_input").each(handleComponent);
        //标签值替换
        if (editState) {
            jqForm.find("[lbl][field]").filter(function() {
                var name = $(this).attr("field");
                if (undefined !== name && null !== name && $.trim(name).length > 0 && true !== instName[name]) {
                    return true;
                } else {
                    return false;
                }
            }).each(function() {
                var jdom = $(this);
                jdom.text(values[jdom.attr("field")]);
            });
        }
    };
    var startEdit = function(el) {
        var jqForm = getForm(el);
        jqForm.addClass("edit");
    };
    var stopEdit = function(el) {
        var jqForm = getForm(el);
        jqForm.removeClass("edit");
    };
    module.exports = {
        getValue: getValue,
        setValue: setValue,
        startEdit: startEdit,
        stopEdit: stopEdit
    };
}, {});