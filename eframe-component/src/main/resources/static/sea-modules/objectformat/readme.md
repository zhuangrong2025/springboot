
### objectformat

#### 简介
html模板占位符处理模块。
#### 示例代码

html代码:

js代码:

```js
var format = require('objectformat');

var tpl = '<div>{a}</div><div>{b}</div><div>{c.d}</div><div>{e.f.g}</div>';
var html = format(tpl, {
    a: '1',
    b: '2',
    c: {
        d: '3'
    },
    e: {
        f: {
            g: '4'
        }
    }
});
$('#main').html(html);     //<div>1</div><div>2</div><div>3</div><div>4</div>
```