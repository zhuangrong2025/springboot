/*
 *  验证eaup表单，二次封装验证
 *  1命名空间
 *  2调用组件validator
 */
// import Validator from './validator.js';

//生成xy.widget命名空间
if(!window.xy) window.xy = {};
xy.namespace = function() {
	var o, d;
	$.each(arguments, function(i, v) {
		d = v.split(".");
		o = window[d[0]] = window[d[0]] || {};
		$.each(d.slice(1), function(j, v2) {
			o = o[v2] = o[v2] || {};
		});
	});
	return o;
};
xy.ns = xy.namespace;
xy.ns("xy.widget");
if(!xy.widget) xy.widget = {};
// Validator组件赋值命名空间
xy.widget.Validator = Validator;


// 生成euap的命名空间, eaup.config = {}是对象
xy.ns("euap.config");

/*验证eaup表单 -- 函数封装*/
euap.config.Validator = function(){
    /*
     * setValidator的pages,item数据
     * pages:[{
        defaultvalue: "金证超级代理",
        groupid: "200",
        key: "EUAPFP#businame",
        remark: "用于程序窗口显示业务名称。",
        title: "业务名称",
        type: "text",
        validator: "required"
        }]
    */
    //先添加表单校验属性，创建校验表单对象createValidator
    function setValidator($target, data){
        data = data || {}
        var pages = data['pages']
        $.each(pages, function(index, item){
            var row = item;
            var validatorFlag = row['validator']
            var key = row['key']
            var $tmpTarget = $target.find('[name=' + key + ']')
            if(validatorFlag){
                var flags = validatorFlag.split(';')
                $.each(flags, function(index, flag){
                    $tmpTarget.attr(flag, '')
                })
            }
            $tmpTarget.attr('data-validator', '')
        })
        var validator = createValidator($target)
        return validator;
    }

    //创建表单验证
    function createValidator($target){
        // 调用xy.widget.Validator
        var validator = new xy.widget.Validator({
            selector: $target.find("[data-validator]"), //dom数组 select[0] => 表单对象
            rules:{ // 规则函数
                __sernameext:function(value,field){ //sernameext是input的属性，如果是单独属性说明是空串，不是undefined
                    if(!value){
                        return "";
                    }
                    if(isIP(value))
                        return "";
                    else
                        return "此栏位必须为IP格式!!!";
                },
                __ip:function(value,field){
                    if(!value){
                        return "";
                    }
                    if(isIP(value))
                        return "";
                    else
                        return "此栏位必须为IP格式!!!";
                },
                __optionType: function(value,filed){ //通过option.type传递规则函数，不从input的属性中获取
                    return 'test参数传递规则'
                }
            }
        })
        $target.find("[data-validator]").keyup(function(){
            console.log('keyup');
            validator.validate(this)
        })
        //通过参数传递规则
        // $target.find("[data-validator=optionType]").keyup(function(){
        //     validator.validate(this, {'type': '__optionType'}) //调用规则__optionType
        // })
        return validator;
    }
    return {
        createValidator: createValidator,
        buildValidator: setValidator
    }
}() //在这里执行，返回是对象

// 检查是否是空串
function isNull(str){
    if(str == ''){
        return true
    }
    var reg = new RegExp('^[ ]+$')
    return reg.test(str)
}
//检查输入对象的值是否符合端口号格式
function isIP(strIP) {
    if (this.isNull(strIP)) return false;
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g; //匹配IP地址的正则表达式
    if (re.test(strIP)) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) return true;
    }
    return false;
}
