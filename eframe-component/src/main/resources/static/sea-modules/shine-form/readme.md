
### shine-form

#### 简介

提供通用的表单工具（如需表单验证，请参考【shine-validator】组件）。

#### 示例代码

html代码:

```html
<form id="myform">
    <!-- 普通表单控件（如需让表单工具获取/设置值，需要添加样式类“xyz_validate_input”） -->
    
    <!-- 单行输入框 -->
    <input name="form_input_text" class="xyz_validate_input" />
    
    <!-- 单选按钮 -->
    <label>
        <input type="radio" name="form_input_radio" class="xyz_validate_input" value="单选按钮A" checked="checked" />单选按钮A
    </label>
    <label>
        <input type="radio" name="form_input_radio" class="xyz_validate_input" value="单选按钮B" />单选按钮B
    </label>
    
    <!-- 复选框 -->
    <label>
        <input type="checkbox" name="form_input_checkbox" class="xyz_validate_input" value="复选框A" checked="checked" />独立复选框A
    </label>
    
    <!-- 下拉框 -->
    <select name="form_select_single" class="xyz_validate_input">
        <option>...省略...</option>
    </select>
    
    <!-- 组件控件 -->
    <label>组件：下拉框</label>
    <div id="xyz_select2"></div>
</form>
```
js代码:

```js
var $ = require('jquery');
var form = require('shine-form');
var XyzSelect2 = require('xyz-select2');

(new XyzSelect2({
    el: '#xyz_select2',
    name: 'xyz_select',
    ajax: {
        url: "https://easy-mock.com/mock/5b9b62f41615c53f58edfe3d/select",
        id: 'acc_id',
        text: 'acc_name'
    }
})).render();

form.getValue('#myform'); //获取表单域的值（包含组件）
```

##### 方法说明
| 方法 | 说明 |
| - | :- |
| getValue(el) | 获取指定表单下所有控件的值<br>注意：<br>     1）表单组件：表单组件指的是用组件库创建的组件，其值的获取方式由组件“getValue()”决定；<br>     2）表单控件：表单控件指的是非组件方式创建的表单控件，如`<select>`、`<input>`之类。<br>         a.单选按钮：单选按钮返回选中项的“value”;<br>         b.复选框：复选框分为独立复选框和分组复选框（name相同的一组复选框）。独立复选框若被选中，则返回选中项的“value”，否则返回null。分组复选框返回同name复选框中被勾选项的“value”数组，都未选中返回“[]”;<br>         c.下拉选择框：下拉框分为单选和多选。单选下拉框返回选中项的“value”，未有选中项时返回null。多选下拉框返回选中项的“value”组成的数组，都未选中返回“[]”。<br>         d.其它控件：除了以上控件，其它控件都直接返回值。<br><br>参数：<br>     el：表单form对应的选择器，或表单form对象，或其对应的jquery对象<br><br>返回：object - 组件“name”和“值”构成的集合 |
| setValue(el, values, editable) | 设置指定表单下所有控件的值<br><br>参数：<br>     el：表单form对应的选择器，或表单form对象，或其对应的jquery对象<br>     values: object - 组件“name”和“值”构成的集合(值的数据结构请参照getValue(..)返回值说明)<br>     editale: boolean - true表示对编辑状态的表单设值, 组件的显示文本自动回填到对应显示区, 默认为false)<br><br>返回：无 |
| startEdit(el) | 表单开启编辑状态<br><br>参数：<br>     el：表单form对应的选择器，或表单form对象，或其对应的jquery对象<br><br>返回：无 |
| stopEdit(el) | 表单关闭编辑状态<br><br>参数：<br>     el：表单form对应的选择器，或表单form对象，或其对应的jquery对象<br><br>返回：无 |
