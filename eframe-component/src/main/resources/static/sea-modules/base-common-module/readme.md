
### base-common-module

#### 简介
 公共模块
1. 用于往html中添加公共的meta标签
2. 暴露模块化组件的相关功能到全局对象window.ModulesGlobal
3. 控制界面元素权限, 权限的控制需在html中添加属性sth-as，例如```html <button sth-as="per_code" >提交</button> ```;
4. 缓存登录用户，当前选中菜单信息。

#### 示例代码

html代码:
```html
<script>
//建议写法，可直接在主页面的seajs.use中引用，示例如下
seajs.use('base-common-module'', function(base){
    base.changeStyle('blue');
});
</script>
```

js代码:

```js
//示例代码
var baseObj = require('base-common-module');

baseObj.changeStyle('blue');
```

##### 方法说明
| 方法 | 说明 |
| - | :- |
| changeStyle(theme) | 切换皮肤, 可选主题darkblue和blue|
| createAll() | 标签创建渲染成组件|
| setActiveMenu(menu) | 设置当前选中的菜单<br/>menu数据结构为{menu_code:'00001002', func_code: '00001002', orig_app_id: '1'},其中<br> menu_code: 菜单编号<br/>func_code: 功能编号<br/>orig_app_id: 原应用系统ID|
| getActiveMenu() | 获取当前选中菜单信息, 数据结构：<br/>{menu_code: 菜单编号, func_code: 功能编号, orig_app_id: 原应用系统ID}|
| getCurrentAppId() | 获取选中的菜单的应用系统ID|
| getUser() | 获取当前登录用户信息, 数据结构：<br/>{user_code: "001", user_name: "小张", dept_id: 100, dept_code: "0016", dept_name: "清算部"}|
| getContext() | 获取当前登录用户上下文信息, 主要包括当前登录系统app_id,数据结构：<br/>{app_id: '1'}|
| getAppContext(key) | 获取当前登录用户关联信息<br/>key为字段名称, 可选参数，不传时默认返回用户关联信息。<br/> key参数支持多层嵌套获取 ，如 user.username|
| getUrlPath(key) | 获取服务端配置的各功能界面的url地址。<br/>数据结构为:  [{  "url_name":"login_url", "url_value":"/cas"}] <br/>key为可选参数，传递url_name的值，返回url_value. 如不传key默认返回所有接口列表。|

##### 父级页面调用通用模块全局对象示例（主要提供给新资管产品，当外层jsp需与模块化开发的页面做交互时使用）
```js
document.getElementById("iframeId").contentWindow.ModulesGlobal.changeStyle('darkblue');  //使用darkblue样式
document.getElementById("iframeId").contentWindow.ModulesGlobal.Observer;   //模块化的observer对象
```