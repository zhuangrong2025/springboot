
### xyz-jsonRPC

#### 简介
通用ajax请求模块封装, 分为常规模式和精简模式两种调用方式

#### 前后端分离调试模式

```js
//设置请求的全局host（跨域），前端开发人员可以不需要搭建java环境，配置服务器的host即可调试效果
$.jsonRPC.setHost('http://192.168.1.1');
//设置debug模式，自动替换所有url中的 USAccess ===> TestUSAccess
$.jsonRPC.setDebug(true);
//设置mock模式，自动返回url对应mock文件夹（与release文件夹同级）下配置的json。该功能仅支持EPBOS框架。
$.jsonRPC.setMock(true);
```

#### mock目录结构说明

```js
规则:  /mock/请求类型/service[0]/sevice[1]/sevice[2].json
说明:  请求类型分为table, json两种类型.  service为url的sevice参数，以点号做切割。

普通服务地址示例:
url地址：/EPSERVICERUN/json/USAccess/json.do?service=esowpMonitor.esowpMonitor_soMonitorTermService.queryMonitorTermDef
mock地址： /mock/json/esowpMonitor/esowpMonitor_soMonitorTermService/queryMonitorTermDef.json

dataTable服务地址示例:
url地址：/EPSERVICERUN/table/USAccess/dataTables.do?service=esowpCollect.esowpCollect_soConnectSourceService.queryAllConnectSourceByPage
mock地址：/mock/table/esowpCollect/esowpCollect_soConnectSourceService/queryAllConnectSourceByPage.json

```

#### 示例代码

```js
var $ = require('jquery');
require('xyz-jsonRPC')($);

//常规自定义模式
$.jsonRPC.request({
    url: '/test',
    params: {
        params: {
            a: '1',
            b: '2'
        }
    },
    success: function (response, url) {
        console.log(response);
    }
});

//缓存模式
$.jsonRPC.request({
    url: '/test',
    params: {
        params: {
            a: '1',
            b: '2'
        }
    },
    success: function (response, url) {
        console.log(response);
    },
    cache: true,
    cacheTime: 6   //cache为true时生效，不设置cacheTime时，默认值为5， 单位分钟
});

//配置请求模式
$.jsonRPC.setConfigBase('/');   //设置配置文件的默认路由， 默认为'/'
//极简模式 第一个参数的格式为："配置文件路径.配置文件id"
$.jsonRPC.fetch('api.searchForDepart', function(error, data, url){
    if(error){
        console.log(error);
        return false;
    }
    console.log(data);
});
//极简模式，外部传参
$.jsonRPC.fetch('api.searchForDepart', {
    params: {params: {c: 1}}
}, function(error, data){
    console.log(data);
});

//设置全局host（跨域），支持开发调试
$.jsonRPC.setHost('http://192.168.1.1');
//跨域请求模式
$.jsonRPC.request({
    url: '/test',    //由于上面调用了setHost方法，此处的请求url地址自动变为http://192.168.1.1/test
    params: {
        params: {
            a: '1',
            b: '2'
        }
    },
    success: function (response, url) {
        console.log(response);
    }
});

```

##### 调用参数示例
```js
{
    url: '/test',          //url地址
    params: {           //url参数
        params: {
            a: '1',
            b: '2'
        }
    },
    controlCode: '',          //功能权限编码
    success: function (response, url) {},   //请求成功的回调函数
    error: function (response, url) {},   //可选，请求失败的回调函数。不配置时默认已jsonRPC内置的方法去处理错误信息
    cache: true,     //是否缓存。  true时为缓存当前请求，false时为强制重新请求接口。
    cacheTime: 5    //缓存时间，cache为true时生效，默认为5，单位分钟
}

```

##### 特殊参数机制说明
| 参数 | 说明 |
| - | :- |
| cache |  true:  rpc内部会优先从localStorage中提取缓存数据，如果不存在则重新发起请求，并缓存当前数据。 <br/> false: 强制重新发起请求。 <br/>不配置：rpc内部会优先从localStorage中提取缓存数据，如果不存在则重新发起请求。

##### 方法说明
| 方法 | 说明 |
| - | :- |
| $.jsonRPC.removeDataCache(url, params) | 根据url,params, 手动删除缓存|


#### 缓存接口数据结构
```json
//localStorage
{"xyz-jsonRPC": [{
    url: '',    //请求的地址
    params: {},    //请求的参数
    time: 1535954772089,  //缓存创建时间
    data: []   //缓存的数据
}]}
```

#### 缓存配置数据结构
```json
//localStorage
{"xyz-jsonRPC-config": {
    api: {
         "name": "新资管项目配置",      //配置文件描述
         "cache": true,                     //是否缓存
         "cacheTime": 5,              //缓存时长，cache为true时生效，默认5分钟
         "time": 1535954772089,  //缓存创建时间
         "ajax": [{
           "id": "searchForDepart",    //接口唯一标识
           "description": "搜索部门"     //接口描述
           "url":  "/test",                  //接口地址
           "params":  {              //默认提交参数
             "params": {
               "a": "1",
               "b": "2"
             }
           }
         }]
    }
}
```