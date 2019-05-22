
### stringformat

#### 占位符替换模块, 主要用于html中的内容填充. 常用于tpl(html)中的占位符替换

#### 示例代码

```js
var format = require('stringformat');

//示例代码
var tpl = '这是第一条数据:{0}, 这是第二条数据: {1}';
var htmlTpl = '<h1>h1的内容: {0}</h1><h2>h2的内容: {1}</h2>';
var tplStr = format(tpl, 'data1', 'data2');
var htmlTplStr = format(htmlTpl, 'h1Data', 'h2Data');
console.log(tplStr);            //这是第一条数据:data1, 这是第二条数据: data2
console.log(htmlTplStr);    //<h1>h1的内容: h1Data</h1><h2>h2的内容: h2Data</h2>
```