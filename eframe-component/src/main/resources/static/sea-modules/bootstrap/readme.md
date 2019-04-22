
### bootstrap

#### 简介

#### 示例代码

```js
//bootstrap需要依赖jquery，调用前请先依赖jquery
var $ = require('jquery');
require('bootstrap')($);

//bootstrap的api方法
$('#myModal').on('show.bs.modal', function (event) {
    alert('modal显示事件被触发！');
})
```