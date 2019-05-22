
### xyz-alert

#### 简介

```js
//示例代码
xyz-alert基于sweetalert，如不了解sweetalert，可参考如下链接
sweetalert：http://mishengqiang.com/sweetalert/

```

#### 示例代码

```js
//示例代码
var xyzAlert = require('xyz-alert');

//参数里的contents属于自定义内容，例如：
xyzAlert.error('出错啦！');
xyzAlert.info('信息提示框!');
xyzAlert.warning('警告');
xyzAlert.success('成功!');
xyzAlert.confirm('确认提示框', {
    confirm: function(){},
    cancel: function(){}
})
xyzAlert.close();  //关闭页面的所有xyzAlert弹出框

//自定义图标
xyzAlert.default('<i class="fa fa-spin fa-spinner"></i>', {
	html: true
});

参数说明：
xyzAlert.error(contents, option, titles);//四个方法所用到的参数都一样，即都应有contents, option, titles
contents：自定义内容
option：sweet-alert的参数
titles：标题名称

```