/*
 *  根据json数据动态生成表单
 *  EUAP配置项视图渲染.
 *  config_page.json
 *  pages:[{
        defaultvalue: "金证超级代理",
        groupid: "200",
        key: "EUAPFP#businame",
        remark: "用于程序窗口显示业务名称。",
        title: "业务名称",
        type: "text",
        validator: "required"
    }]
  *  config_server.json
        {
        "EUAPFP#COUNTERTIMEOUT":"120",
        "EUAPFP#HBTIMEOUT":"30",
        "EUAPFP#LISTENPORT":"5330",
        "EUAPFP#LOCALPORT":"5315",
        "EUAPFP#MAXLISTLENGTH":"20000"
        }
 */
xy.ns('euap.config.view')
euap.config.view.ConfigView = function(){

    // 处理每一行的数据
    function handleRow(rowData) {
        var type = rowData['type'],
            title = rowData['title'],
            key = rowData['key'],
            remark = rowData['remark'],
            validator = rowData['validator'];
        // 设置默认值
        var defaultvalue = rowData["defaultvalue"] ||" ";
        var row = $('<tr></tr>')
        var col = ''
        col = $('<td class="xy-label">' + title + '</td>')
        var col1 = $('<td></td>')
        if(type=="checkbox"){
            col1 = $('<td class="xy-detail"></td>')
        }else{
            col1 = $('<td></td>')
        }
        //渲染单个表单元素
        var control = $(inputControl(type,key,defaultvalue))
        control.attr('name', key)
        col1.append(control)
        row.append(col)
        row.append(col1)
        return row
    }
    //生成表单元素
    function inputControl(type, key, defaultvalue){
        if(type == undefined || type == '') type = 'text'
        var inputControl = ''
        inputControl = '<input type="' + type + '"value="' + defaultvalue + '"class="xy-ipt" />';
        return inputControl
    }


    return {
        // config_page.json返回属性渲染render方法
        render: function($target, data){
            console.log(data);
            var pages = data['pages']
            var tbody = $('<tbody></tbody>')
            $.each(pages, function(i, row){
                var jqRow = handleRow(row)
                tbody.append(jqRow)
            })
            $target.append(tbody)
        },
        // 处理服务器返回的数据 config_server.json，设置
        setValue: function($wrap, values){
            var vals = {}
            $.each(values, function(k, v){
                vals[k.toLowerCase()] = v
            })
            $wrap.find('input, select, textarea').each(function(){
                var name = this.name
                var val = vals[name.toLowerCase()]
                $(this).val($.trim(val))
            })

        }
    }


}();
