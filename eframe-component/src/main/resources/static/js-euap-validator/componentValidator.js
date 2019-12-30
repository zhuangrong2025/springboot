/*
 *  表单校验组件
 *  1、在同一个id下的元素
 *  2、显示错误信息，隐藏错误信息
 *  3、显示提示，隐藏提示
 *  4、跳过或取消验证
 *  5、rule规则，就是一个方法
 *  6、规则是匹配错误的，也是返回错误信息
 */
function Validator(params){
    this.params = params || {};
    this.selector = this.params.selector || '';
    this.typeAttr = 'name';
    this.errClass = 'error'


    this.hasAttr = function(field, attrName){
        var attrVal = $(field).attr(attrName);
        return typeof(attrVal) == 'undefined' ? false : true;
    }
    $.extend(this, params);
    // 默认的提示文字合计
    this.defaultTipText = $.extend({
        requiredText: '对不起，不允许为空!',
        maxlengthText: "对不起，超出允许的最长长度[value]。",
        minlengthText: "对不起，不能小于允许的最小长度[value]。"
    }, this.params.defaultTipText || {})
    this.defaultRules = {
        __required: function(val, field){
            if(this.hasAttr(field, 'required') && $(field).attr('required') == 'required' && val == ''){
                return this.defaultTipText.requiredText
            }
            return '';
        }
    };
    this.rules = $.extend(this.defaultRules, (params || {}).rules || {});
    /**
     * 显示错误
     */
    this.showErr =  function(field, text, opt){
        $(field).addClass(this.errClass).css('border','border:1px solid #f00');
        this.showTips(field,text)
    }
    this.showTips = function(field, text){
        var $field = $(field),
            $siblingsWarning = $field.siblings('.xy-form-error')

        if($siblingsWarning[0]){
            $siblingsWarning.text(text)
        }else{
            var errorTag
            errorTag = $('<span>').addClass('xy-form-error').text(text)
            $field.after(errorTag)
        }
    }
    /**
     * 隐藏错误
     */
    this.hideErr = function(field){
        this.hideTips(field)
        $(field).removeClass(this.errClass).css('border','border:1px solid #00f');
    }
    this.hideTips = function(field){
        var $field = $(field)
        $field.siblings().empty()
    }
    /**
     * 单个表单验证
     */
    this.validate =  function(field, options){
        options = options || {}
        var result,
            $el = $(field),
            val = options.value || $el.val(),
            type = options.type || $el.attr(this.typeAttr),
            rulesr = this.rules;
        //方式一判断：options.type通过参数指定调用哪个规则、或input属性 name='__max'
        if(rulesr[type]){
            if(result = (rulesr[type]).call(this, val, field, options)){
                result = options.text || result // 返回
                return (options.showErr || this.showErr).call(this, field, result, options), !1 // 用call传参,因为 || 另外一个函数
            }
        }
        //方式二判断： 根据属性值 required = 'required' 判断是否符合条件的
        for(var methodprop in rulesr){ //从rulesr中匹配field的属性
            if(methodprop.indexOf('__') == 0){
                var methodpropTmp = methodprop.substr(2)
                if(this.hasAttr(field, methodpropTmp)){
                    if( result = (rulesr[methodprop]).call(this, val, field, options)){
                        return (options.showErr || this.showErr).call(this, field, result, options), !1
                    }
                }
            }
        }
        return (options.hideErr || this.hideErr).call(this, field), !0
    }
    // 全局表单校验
    this.validateAll =  function(){
        if (this.selector == "")return false;
        var self = this,
            r = true,
            $fields = $(this.selector),
            val,
            o
        return $fields.each(function(){
            name = $(this).attr(self.typeAttr);
            val = $(this).val()
            o = {value: val, type: name}
            r = self.validate(this, o) && r
        }), r
    }


}
