
### shine-step

#### 简介
步骤控件封装, 支持子模块模式的加载模式。

#### 示例代码

html代码:

```html
<div id="main"></div>
```
js代码:

```js
var ShineStep = require('shine-step');
var step = new ShineStep({
    el: '#main',
    config: [{
        id: 'step1',          //唯一id， 必填项
        title: '步骤1',    //名称， 必填项
        child: {     //子模块，如果tab页的各项内容较简单，可以自行在render后往对应的div中添加内容，不一定都要使用子模块模式
            path: '/examples/tab1',      //加载子模块的绝对路径
            options: {     //子模块所需要的参数
                name: '333'
            },
            refresh: true    //是否每次切换到当前tab页都做刷新
        }
    }, {
         id: 'step2',
         title: '步骤2'
    }],
    buttons: true   //自带按钮, 默认显示取消、上一步、保存、下一步按扭
});
step.render();
```

##### 参数说明
```js
{
    el: "#main",
    active: 1,            //外部设置默认选中项， 优先级 高于config中配置的active
    config: [{
        id: 'step1',          //必填项
        title: '步骤1',    //必填项
        active: true,      //默认选中，如果不配，默认在步骤1
        finish: true,    //当前步骤的完成状态, 默认false
        child: {
            path: '/examples/tab1',      //加载的子模块路径
            options: {      //子模块所需要的参数
                name: '333'
            },
            refresh: true    //是否每次切换到当前tab页都做刷新，默认不刷新（false）
        }
    }],
    buttons: [ //buttons:true将按默认的按扭显示，下面是自定义的方式，对于复杂的按扭定义，可自行在html中定义和实现逻辑，不需在此定义。
        {type: 'cancel', title: '取消', cls: 'btn-cancel-lv1'}, //取消按扭自定义配置, 配置为字符串值'cancel',将以默认的取消按扭配置显示
        {type: 'prev', title: '上一步', cls: 'btn-action-lv2'},//上一步按扭自定义配置
        {type: 'save', title: '保存', cls: 'btn-action-lv1'},//保存按扭自定义配置
        {type: 'presave', title: '保存, 后续完善', cls: 'btn-action-lv1', scope: [1]},//保存后续完善按扭自定义配置, scope表示哪个步骤显示该按扭
        {type: 'next', title: '下一步', cls: 'btn-action-lv1'}//下一步按扭自定义配置
    ],
    events: {
        change: function(id, status, finish, _m){
            console.log('change, id:' + id);                    //当前step的id
            console.log('change, status:' + status);      //当前step是否为人为点击状态（true为人为点击，false为调用程序调用选中）
            console.log('change, finish:' + finish);      //当前step是否存在finish状态
            console.log(_m);                                            //当前实例对象
        },
        beforeChange: function(id, status, finish, _m, cb){
            console.log(id);     //当前表格对象的id
            console.log('change, finish:' + finish);      //当前step是否存在finish状态
            console.log(_m);   //当前实例对象
            cb();      //继续执行的信号，注：如果配置了beforeChange， 不执行cb，那么change事件将不会执行。
            //适用场景：用于切换步骤之前，提示用户当前界面存在尚未保存数据的提醒。可以等用户点击确认按钮后，再执行cb
        },
        save : function(m) { //保存按扭触发事件
            console.log(m); //当前实例对象
        },
        presave : function(m) {//保存后续完善按扭触发事件
            console.log(m); //当前实例对象
        },
        cancel: function(index, id, m) {
            console.log(index); //当前索引值
            console.log(id); //当前步骤id
            console.log(m);//当前实例对象
        }

    }
}
```

##### 方法说明
```js
xt.getInstanceById(id);   //根据id，获取子模块的实例。（注：子模块还没初始化时，返回为undefined）
xt.activeById(id);     //根据id，外部调用选中步骤的方法
xt.activeByIndex(1);   //根据索引，外部调用选中步骤的方法
xt.getCurrentCheckId();    //获取当前选中步骤的id
xt.getCurrentCheckIndex();   //获取当前选中步骤的索引，未找到为-1
xt.setFinishStatus(idList);    //手动设置步骤为finish状态。idList可以以逗号隔开，或者传入字符串数组
xt.removeFinishStatus(idList);    //手动溢出步骤的finish状态。idList可以以逗号隔开，或者传入字符串数组
xt.getFinishStatus();     //获取当前为finish状态的id列表
xt.isFinishStatus(id);   //判断当前的id是否为finish状态（id为字符串）


xt.dispose();    //销毁
xt.refresh();   //刷新
```