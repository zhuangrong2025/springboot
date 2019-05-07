
### observer

#### 简介

多模块通信库，用于不同模块之前的事件监听与触发。

#### 示例代码

```js
var observer = require('observer');
/*
*   以下例子假设模块名都为 "data-table-list"
*   observer.on监听事件, 同一事件，可绑定多个方法
*   params1*: 自定义事件名，命名规范："模块名:事件名"
*   params2*: 绑定的回调函数
*   params3: 当前模块的指针，在方法中调用this对象，可以得到模块全局对象，而并非取到window对象。
* */
var consoleData = function(data){
	console.log(data);
};
var alertData = function(data){
	alert(data);
};
observer.on('data-table-list:dataClick', consoleData, this)
observer.on('data-table-list:dataClick', alertData, this)

/*
*   observer.trigger 触发事件
*   params1*: 自定义事件名，命名规范："模块名:事件名"
*   params2: 传递给事件的参数
*   params3,params4....  参数个数没有限制, 按照模块的业务需求来制定。
* */
observer.trigger('data-table-list:dataClick', "123");

/*
*   observer.off 删除事件
*   params1*: 自定义事件名，命名规范："模块名:事件名"
*   params2: 传递给事件的回调函数，若不传此参数，默认删除绑定当前事件名的所有方法。
* */
observer.off('data-table-list:dataClick', alertData);

/*
*   observer.past 强绑定事件，由于有些事件trigger在on之前执行，这种情况，on里面绑定的事件是无法执行的，如果存在这种情况， 使用past方法做替换。（机制可参靠jquery的live方法）
*   参数用法与observer.on()一致
* */
observer.past('data-table-list:dataClick', consoleData, this);
```