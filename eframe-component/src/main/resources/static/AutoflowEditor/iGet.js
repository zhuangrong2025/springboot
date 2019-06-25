
// 全局 env
var env = {};

/**
 * 所有操作事件管理.
 */
 var Actions = function(){
   this.actions = {} // {key: fn, key1: fn1}
 }
 Actions.prototype = {
   add: function(name, action){
      this.actions[name] = action
      return action
   },
   get: function(name){
      return this.actions[name]
   }
 }
 env.actions = new Actions();

 /**
  * 页面事件定义和注册.
  */
  (function(){
    var handlers = {
      open: function(){
        console.log("open");
      },
      save: function(){
        console.log("save");
      }
    }
    // 注册
    for(var m in handlers){
      env.actions.add(m, handlers[m])
    }

  })();
  /**
   * 菜单工具栏模块.
   * 1. 菜单栏的渲染及事件绑定.
   * 2. 快捷工具栏的渲染及事件绑定
   */
 (function(){
   var MenuToolBar = mse.BaseModule.extend({
     constructor: function(){
       this.init()
     },
     init: function(){
       this.bindEvent()
     },
     bindEvent: function(){
       // 绑定菜单事件
       $('.menu a').click(function(){
         var action = $(this).attr('data-action')
         var fn = env.actions.get(action)
         fn && fn()
       })
     }
   })
   env.MenuToolbar = new MenuToolBar();
 })();
