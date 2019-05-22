### xyz-util

#### 简介
原xyz.js中的util工具方法

#### 示例代码

```js
var xyzUtil = require('xyz-util');

xyzUtil.fnConvertDate('20180403')
xyzUtil.getUrlParams();   //http://xxx?a=1&b=2   ==>    {a:1, b:2}

xyzUtil.pageUtil.isEmpty('123');

xyzUtil.formUtil.getValue('#myform'); //获取表单域的值（包含组件）
```

##### 方法
```js
supportCss3Animation
animationend
escapeJavascript
escapeHtml
escapeUrl
isEmpty
toThousands
formatMoney
pad
removeProperty
isIpStr
ipToInt
fnConvertDate  //建议使用更为灵活的time-format模块
fnParseDate    //建议使用更为灵活的time-format模块
fnString
isClass
clone
getObjStr
getUrlParams      //获取url的参数
getFuncCode
numberToMoney(val, deicmal)   //数字转千分位, decimal默认为2
moneyToNumber(val, deicmal)    //千分位转数字, decimal默认为2
numToChinese()     //数字转成大写中文
```

##### 扩展方法说明
| 方法 | 说明 |
| - | :- |
| generateId() | 生成唯一的uuid |
| pathJoin(args) | 参考nodejs中path.join的实现逻辑封装。<br/>示例: join('../var/www', '../abc') ===> "../var/abc" |
| getBaseUrlPath(url) | 截取请求中的url路径。  <br/>示例: /a?x=123 ===>  /a |
| joinUrlParams(url, params) | 向url中拼接params <br/>示例:  joinUrlParams('http://www.baidu.com', {a:1,b:2}) <br/> 结果: http://www.baidu.com?a=1&b=2|
| urlParse(url, pathname) | 用于assets目录下的静态文件路径转义。 自动检测是否为发布状态（路径存在/release/的情况）|
| fullScreen(el) | 全屏显示 <br/> el: 指定容器全屏,  支持字符串，jquery对象， dom对象传入 <br/> 执行完成后会触发observer事件observer.trigger('xyz-util:fullScreen', el);  el为全屏容器的dom对象。 <br/> 退出全屏时将会执行observer.trigger('xyz-util:fullScreenExit', el); |
| resizeDom(opt) | 监听dom(div)容器大小的变化 <br/> 参数说明: <br/> opt.el: 监听的容器, 必填<br/> opt.eventName: 事件名(默认为模块js的名字), 必填 <br/> opt.delay: 延时，单位ms。默认值:200<br/> opt.callback: 容器发生变化的回调函数, 示例 function(e){}  //e为event对象 |
| getScreenHeight() | 获取浏览器可视范围高度 |
| getScreenWidth() | 获取浏览器可视范围宽度 |
| getDomObj(el) | 获取html dom对象，el支持jquery对象，字符串传入。 |
| destroyIframe(el, remove) | 销毁iframe，释放内存. <br/> el: iframe对象 <br/> remove: 默认false,  为true时删除传入的iframe元素|
| numberConfirm(val1, val2) | 判断val1和val2 是否为相等的数字  即 1 === '1'  |
| isIE() | 判断是否为ie或者edge浏览器 |
| isEdge() | 判断是否为edge浏览器 |
| isOnlyIE() | 是否为ie浏览器 |
| countTextWidth(text, size) | 计算文字单行显示时占用的宽度. text:为文字，size：为字体的font-size |