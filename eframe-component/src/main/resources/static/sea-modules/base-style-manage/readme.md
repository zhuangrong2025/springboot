
### base-style-manage

#### 简介
主题皮肤管理模块，可通过引用base-common-module做管理

#### 示例代码

js代码:

```js
var styleObj = require('base-style-manage');
/*
 * 使用darkblue皮肤.
 * 换肤事件监听: observer.on('base-style:stylechange', function(style){console.log('主题:' + style);});
 */
styleObj.changeStyle('darkblue');    //使用darkblue皮肤
```