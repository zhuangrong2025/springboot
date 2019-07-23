
### xyz-storage

#### 简介
对localStorage, sessionStorage获取机制的封装

#### 示例代码

js代码:

```js
var storage = require('xyz-storage');

storage.setSessItem('a', {a: 1, b: 2});      //往sessionstorage中设置对象
console.log(storage.getSessItem('a'));
storage.setSessItem('b', '123123');     //往sessionstorage中设置数字
console.log(storage.getSessItem('b'));

storage.setLocalItem('c', {a: 2, b: 1});    //往localStorage中设置对象
console.log(storage.getLocalItem('c'));
storage.setLocalItem('d', 321321);    //往localStorage中设置对象
console.log(storage.getLocalItem('d'));
```

##### 方法说明
| 方法 | 说明 |
| - | :- |
| setSessItem(key, val, cacheTime) | 往sessionStorage中设置缓存<br/>key: 缓存的键值<br/> val: 缓存的数据 <br/> cacheTime: 缓存的时间, 默认为10,单位分钟|
| setLocalItem(key, val, cacheTime) | 往localStorage中设置缓存<br/>key: 缓存的键值<br/> val: 缓存的数据 <br/> cacheTime: 缓存的时间, 默认为10000,单位分钟 |
| getSessItem(key) | 获取sessionStorage中缓存的数据，如果key的值未找到，或是缓存已过期，返回null |
| getLocalItem(key) | 获取localStorage中缓存的数据，如果key的值未找到，或是缓存已过期，返回null |