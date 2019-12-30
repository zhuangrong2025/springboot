
/*
 *  cookie值判断提示层是否显示
 *  有多个步骤的状态 GUIDE_STATUS{ none:0, index:1, guide1:3，guide2:5，finish:9}
 *  一、设置和获取浏览器cookie
 *  1、默认status=0，在guide1时显示提示，然后setCookie(guide1)即flag=3
 *  2、下一步，获取cookie，flag=3，如果guide的9比较，继续提示，然后setCookie(guide2)即flag=5
 *  3、结束，应该设置finish，浏览器flag=9,如果是同一浏览器的话，9 < comparedStatus, return null
 *  二、用户登录后json的变化来判断status，
 *  json的isFirsttime:"0",下次登录时不提示
 */

if(!window.xy) {
 var namespace = function() {
     var o, d;
     $.each(arguments, function(i, v) {
         d = v.split(".");
         o = window[d[0]] = window[d[0]] || {};
         $.each(d.slice(1), function(j, v2) {
             o = o[v2] = o[v2] || {};
         });
     });
     return o;
 }
    namespace("euap.config");
    namespace("euap.config.data");
} else {
    xy.ns("euap.config");
    xy.ns("euap.config.data");
}

/*
 * cookie操作
 */

euap.config.data.cookieOP =  function(){
    //setCookie   无过期时间，默认为会话级Cookie，浏览器关闭就会失效
    function setCookie(name, value){
        document.cookie = name + '=' + escape(value);
    }
    // getCookie
    function getCookie(name){
        var arr,
            reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
        arr = document.cookie.match(reg) // document.cookie值是name和value组合 "flag=9"
        if(arr){
          return unescape(arr[2]);
        }else{
          return null;
        }
    }
    //删除cookie
    function delCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null){
          document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }
    }
    return {
        setCookie : setCookie,
        getCookie : getCookie,
        delCookie : delCookie
    }
}()

/*
 * 向导配置,设置cookie
 */
euap.config.data.GuideConfig = function(){
    var GUIDE_STATUS = {
        none:       0,
        index:      1,
        guide1:     3,
        guide2:     5,
        finish:     9
    };


    //点击下一步，执行saveStatus和回调函数
    function nextGuide(comparedStatus, callback){
        gainGuideStatus(function(status){
            if(status < comparedStatus){
                saveGuideStatus(comparedStatus)
                $.isFunction(callback) && callback(status) //这个callback是nextGuide()的
            }
        })
    }

    //首次加载向导
    function guideLoadConfigGuide(comparedStatus){
        gainGuideStatus(function(status){
            if(status < comparedStatus){ // 第一次加载 0 < 3
                $(".pop").show()
                console.log('pop show')
            }else{
                $(".pop").hide()
                console.log('pop hide')
            }
        })
    }

    //检查向导配置，把字符转为数字
    function checkStatus(status){
        if(status == null){
            return GUIDE_STATUS.none
        }else{
            try{
                return parseInt(status)
            }catch(e){
                return GUIDE_STATUS.none
            }
        }
    }

    // 获取状态status并执行回调函数, 如果为空 从服务器上获取，
    function gainGuideStatus(callback){
        var cookieOP = euap.config.data.cookieOP,
            status = cookieOP.getCookie('flag'); // 直接获取cookie的status
        if(null == status){
            $.ajax({
                type: 'GET',
                url: "config_status.json",
                dataType: 'json',
                success: function(data) {
                    status = GUIDE_STATUS.none; //默认设置为0
                    // isfirsttime: "0"，就是已提示过，针对登录过的用户即使cookie中没有flag
                    if('0' == data.isfirsttime){
                        status = GUIDE_STATUS.finish;
                    }
                    cookieOP.setCookie("flag", status);
                    $.isFunction(callback) && callback(status);
                }
            });
        }else{
            $.isFunction(callback) && callback(checkStatus(status));
        }
    };

    // 保存，设置cookie
    function saveGuideStatus(status, callback){
        var status = checkStatus(status)
        euap.config.data.cookieOP.setCookie("flag", status)
        $.isFunction(callback) && callback(status);
    }

    return {
        gainGuideStatus: gainGuideStatus,
        guideLoadConfigGuide: guideLoadConfigGuide,
        nextGuide: nextGuide,
        saveGuideStatus: saveGuideStatus,
        GUIDE_STATUS: GUIDE_STATUS
    }
}()
