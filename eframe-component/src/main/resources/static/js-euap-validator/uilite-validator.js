/*
 *  uilite  原始Validator
 */
 function Validator(params) {
     this.hasAttr = function (field, attrName) {
         var attrVal = $(field).attr(attrName);
         return typeof(attrVal) == "undefined" ? false : true;
     };
     this.errClass = "error";
     this.typeAttr = "name";
     this.style = (params || {}).style || "block";
     this.selector = (params || {}).selector || "";
     this.skip = (params || {}).skip || function() {return false};
     //显示错误
     this.showErr = function (field, text, i) {
         i = i || {};
         $(field).addClass(this.errClass);
         i.noTips || this.showTips(field, text);
     }
     this.hideErr = function (field) {
         this.hideTips(field);
         $(field).removeClass(this.errClass);
     }
     this.showTips = function (field, text) {
         var $field = $(field);
         var $siblingsWarning;
         if (this.hasAttr($field, "el-ref")) {//是否存在el-ref属性。
             var elref = $field.attr("el-ref"); //获取el-ref属性的值。
             var $closestField = $field.closest(elref);//逐级向上级元素匹配，找到要添回<span>的节点。
             $siblingsWarning = $closestField.siblings(".xy-form-error");//搜索同辈元素的节点。
             $field = $closestField;
         } else {
             $siblingsWarning = $field.siblings(".xy-form-error");
         }
         if ($siblingsWarning[0]) {
             $siblingsWarning.text(text);
         } else {
             var errorTag;
             errorTag = $('<span>').addClass('xy-form-error').css({"display": this.style}).text(text);
             $field.after(errorTag);
         }
     }

     this.hideTips = function (field) {
         var $field = $(field);
         if (this.hasAttr($field, "el-ref")) {//是否存在el-ref属性。
             var elref = $field.attr("el-ref"); //获取el-ref属性的值。
             var $closestField = $field.closest(elref);//逐级向上级元素匹配，找到要添回<span>的节点。
             $field = $closestField;
         }
         $field.siblings(".xy-form-error:first").empty();
     }
     /**
      * 表单元素校验提示，只针对单项的校验.
      * @param field 表单元素
      * @param options 可选参数,是一个json对象,options中可通过type属性指定判断规则
      *
      */
     this.validate = function (field, options) {
         //为空时，默认为空的json串。
         options = options || {};
         //获取指定表单
         var result, $element = $(field);
         //如果json对象中[options]存在[value]的值则取[value]的值，否则取表单[filed]的值
         var val = options.value || $element.val();
         if(this.skip.call(this, field, val)) {//允许设置skip函数用于特定条件下跳过校验
             return (options.hideErr || this.hideErr).call(this, field), !0;
         }
         //如果json对象中[options]存在[type]的值则取[type]的值，否则取表单[filed]的属性name对应的值。
         var type = options.type || $element.attr(this.typeAttr);
         //获取校验规则。
         var rulesr = this.rules;
         //判断是否在需要校验的方法
         if (rulesr[type]) {
             //调用方法，返回结果。
             if (result = (rulesr[type]).call(this, val, field, options)) {
                 result = options.text || result;
                 //返回最终的结果。
                 return (options.showErr || this.showErr).call(this, field, result, options), !1
             }
         }
         //从input、password、textarea中查看是否符合条件的
         for (var methodProp in rulesr) {
             if (methodProp.indexOf("__") == 0) {
                 var methodPropTmp = methodProp.substr(2);//以__作为前缀，因此需要从第二位开始截取。
                 if (this.hasAttr(field, methodPropTmp)) {//判断在input、password、textarea等中是否存在指定的属性，列如:required。
                     //调用方法，返回结果。
                     if (result = (rulesr[methodProp]).call(this, val, field, options)) {
                         //result = options.text || result;
                         //返回最终的结果。
                         return (options.showErr || this.showErr).call(this, field, result, options), !1
                     }
                 }
             }
         }
         /*
          else{
          console.error("没有找到校验规则: " + type);
          }*/
         return (options.hideErr || this.hideErr).call(this, field), !0;
     }

     /**
      * 单纯校验，不提示.
      * @param selector 表单选择器表达式
      */
     this.clear = function () {
         if (this.selector == "")return false;
         var result = true;
         var item;
         var isValid = true;
         var $field = $(this.selector);
         var len = $field.length;
         for (var i = 0; i < len; i++) {
             this.hideErr($field[i]);
         }
     }
     /**
      * 单纯校验，不提示.
      * @param selector 表单选择器表达式
      */
     this.checkAll = function () {
         if (this.selector == "")return false;
         var result = true;
         var item;
         var isValid = true;
         var $field = $(this.selector);
         var len = $field.length;
         for (var i = 0; i < len; i++) {
             if (item = $field[i],
                 result = this.validate(item,
                     {
                         showErr: function () {
                         },
                         hideErr: function () {
                         },
                         noTips: true
                     }),
                 !result) {
                 isValid = false;
                 break;
             }
         }
         return isValid;
     }
     /**
      * 表单校验提示.
      * @param selector 表单选择器表达式
      */
     this.validateAll = function () {
         if (this.selector == "")return false;
         //定义方法。
         var self = this;
         var r = true;
         var $field;
         var name;
         var $fields = $(this.selector), val, o;
         //循环进行检验。
         return $fields.each(function () {
             name = $(this).attr(self.typeAttr),//获得表单的name属性。
                 val = $(this).val(),//获得表单的value属性。
                 o = {value: val, type: name};
             //开始进行校验。
             r = self.validate(this, o) && r;
             //return !self.validate(this, o) ? (r = false, !1) : void 0;
         }), r;
     }
     $.extend(this, params);
     this.defaultTipText = $.extend({
                 requiredText: "对不起，不允许为空!",
                 maxlengthText: "对不起，超出允许的最长长度[value]。",
                 minlengthText: "对不起，不能小于允许的最小长度[value]。"
             }, (params || {}).defaultTipText || {}
     );
     this.defaultRules = {
         __required: function (val, field) {
             if (this.hasAttr(field, "required") && $(field).attr("required") == "required" && val == "") {
                 return this.defaultTipText.requiredText;
             }
             return "";
         },
         __maxlength: function (val, field) {
             var length = $(field).attr("maxlength");
             if (this.hasAttr(field, "maxlength") && val.length > parseInt(length)) {
                 var text = this.defaultTipText.maxlengthText.replace("value", length);
                 return text;
             }
             return "";
         },
         __minlength: function (val, field) {
             var length = $(field).attr("minlength");
             if (this.hasAttr(field, "minlength") && val.length < parseInt(length)) {
                 var text = this.defaultTipText.minlengthText.replace("value", length);
                 return text;
             }
             return "";
         }
     };
     this.rules = $.extend(this.defaultRules, (params || {}).rules || {});
 }
