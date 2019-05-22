
### xyz-cryptojs

#### 简介
对各种加密算法的封装

#### 示例代码
js代码:

```js
var xyzCry = require('xyz-cryptojs');

xyzCry.getCid();
xyzCry.encryptByDESModeCBC('string');
```

##### 方法说明
| 方法 | 说明 |
| - | :- |
| getCid() | 获取cookie中的cid |
| getTm() | csrf协议获取时间戳算法 |
| encryptByDESModeCBC(str, key) | EPBOS框架，权限加密算法。<br/>&emsp; str:需要加密的字符串 <br/> key: 加密秘钥，不传默认会取cookie中的cid |
| encryptByCsrf(tm) | csrf加密算法。例如jsonRPC中的ex-h <br/>&emsp; tm:时间戳参数，可选参数，不传时默认取当前时间 |