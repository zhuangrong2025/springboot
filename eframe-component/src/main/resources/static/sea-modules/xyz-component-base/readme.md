
### xyz-component-base

#### 简介
组件基类，组件基于该基类统一受控管理. 主要提供如下接口:
* extend： 组件继承扩展接口
* getComponent： 获取组件实例对象, 按el获取
* create: 某一类标签创建组件
* createAll: 所有内置标签创建组件   
#### 示例代码

js代码:

```js
//示例代码
var ComponentBase = require('xyz-component-base');
var ComponentA = ComponentBase.extend({
    constructor: function(options) {
        ComponentA.superclass.constructor.call(this, options);
        this.initialize(options);
    },
    initialize: function(options) {
        console.log("init arguments.");
        console.log(options);
    },
    setValue: function(v) {
        this.emit("change", v);
        console.log("setValue:" + v);
    }
});
var cmpA = new ComponentA({
    el:"#e4"
});
cmpA.on("change", function(data) {
    alert("值变化, 最新值为:" + data);
});
cmpA.setValue("aaaa");
//按el从组件库中获取组件对象
ComponentBase.getComponent("#e4").setValue("999");
//创建所有标签组件
ComponentBase.createAll();
```

##### 方法说明
| 方法 | 说明 |
| - | :- |
| extend(options) | 组件继承|
| getComponent(el) | 获取组件对象, 参数为el，如：ComponentBase.getComponent("#date") |
| create(type, ctx) | 创建指定类型标签组件, 参数分别为: <br>type: 标签类型 <br> ctx(可选): 处理元素下的标签, 支持字符串和jquery对象|
| createAll(type, ctx) | 创建所有标签组件, 参数为: <br> ctx(可选): 处理元素下的所有标签, 支持字符串和jquery对象|
| on(ename, handler, scope) | 事件监听,参数: <br>ename: 事件名称 <br> handler: 事件响应处理方法 <br> scope(可选):作用域 |
| one(ename, handler, scope) | 事件监听, 只执行一次,参数: <br>ename: 事件名称 <br> handler: 事件响应处理方法 <br> scope(可选):作用域 |
| off(ename, handler, scope) | 解除事件绑定,参数: <br>ename: 事件名称 <br> handler: 事件响应处理方法 <br> scope(可选):作用域 |
| emit(ename, data) | 事件触发,参数: <br>ename: 事件名称 <br> data: 事件触发参数, 多个参数则在emit方法参数中添加， 如：emit('click', 'a', 'b') |
| defaultTrue(options, key) | 通用组件设置默认参数为true |
| readAjaxData(ajaxObj, eventName, callback) | 通用组件读取ajax配置对象，获取数据 |
| getStyleVersion() | 获取当前组件皮肤样式版本 |

##### 内置标签类型
| 类型 | 组件 | 标签样式 |
| - | :- | :- |
| datepicker | 日期组件 | .xyz_datepicker_trans | 
| dselecttepicker | 下拉组件 | .xyz_select_trans |