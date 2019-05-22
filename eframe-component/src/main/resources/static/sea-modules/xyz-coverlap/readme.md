
### xyz-coverlap

#### 简介
弹出层，用于显示配置的url地址

#### 示例代码

js代码:

```js
var xyzCover = require('xyz-coverlap');

var cov = new xyzCover({
    remote: 'test.html',   //iframe的url
    id: '',    //coverlap的唯一标识，用于子模块(或子页面)需要调用coverlap实例时的调用。 若不传此参数，默认使用随机生成的uuid。
	title: ''     //可选参数，如果coverlap需要带标题，则加此参数
	returnbtn: false	//可选参数，如果coverlap不需要带返回按钮，则加此参数，默认带返回按钮
});

cov.render();
```

##### 参数说明
1. iframe模式
```js
{
   remote: '/EAMS/RE/XXX.html',     //页面的url地址    必填
   destroy: true,                                 //点击返回按钮时，是否销毁内容。 默认true
   onShow: function(){},                   //coverlap显示时的回调函数
   onHide: function(status){},                    //coverlap隐藏时的回调函数，status: 是否为主动销毁（即true时，为人工点击了返回按钮）
   onLoad: function(){},                    //首次加载coverlap，iframe内容加载完成的回调函数
   onDispose: function(status){}               //coverlap被销毁后的回调函数，status: 是否为主动销毁（即true时，为人工点击了返回按钮）
}
```
2. 子模块模式
```js
{
    child: {
           path: '/aa/xx',       //子模块js的绝对路径    必填
           options: {}         //子模块的参数    选填
    }
   destroy: true,                                 //点击返回按钮时，是否销毁内容。 默认true
   onShow: function(){},                   //coverlap显示时的回调函数
   onHide: function(){},                    //coverlap隐藏时的回调函数，status: 是否为主动销毁（即true时，为人工点击了返回按钮）
   onLoad: function(status){},                    //首次加载coverlap，iframe内容加载完成的回调函数
   onDispose: function(status){}               //coverlap被销毁后的回调函数,  status: 是否为主动销毁（即true时，为人工点击了返回按钮）
}
```

##### 方法说明
```js
cov.getId();         //获取coverlap的id
cov.dispose();    //销毁
cov.show();       //显示
cov.hide();        //隐藏
cov.toggle();     //切换状态显示（显示/隐藏）
cov.setEvent();         //支持给实例设置回调函数。例如： cov.setEvent('onLoad',  function(){});
```

##### 子模块/子页面调用coverlap实例示例
子模块模式
```js
var id = cov.getId();
var cov = window.XyzCoverlap && window.XyzCoverlap[id];    //id为coverlap的id
if(cov){
    cov.hide();
}
```

子页面模式
```js
var id = cov.getId();
var cov = window.parent && window.parent.XyzCoverlap && window.parent.XyzCoverlap[id];    //id为coverlap的id
if(cov){
    cov.hide();
}
```