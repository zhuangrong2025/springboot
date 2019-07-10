
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

 /**
  * mse.apply对象,赋值数据
  */
(function(){
  var step = {id: "0", sec: "流程块"},
      props = {id: "1", file: '123.ahk'}
  var newObj = mse.apply(step, props);
  console.log(newObj); // {id:1, sec: "流程块", file: '123.ahk'}
})();

/**
 * 存储数据
 * 1、普通的存取数据
 * 2、window.sessionStorage的二次封装
 */
 (function(){
   mse.datas = {}
   var data = {}
   function MemoryStorage(){}
   MemoryStorage.prototype = {
       getItem: function(key){
           return data[key]
       },
       setItem: function(key, value){
           if(typeof key !== 'string' || !key){
               throw new Error("key is invalid")
           }
           data[key] = value
           return this
       }
   }
   mse.datas.MemoryStorage = new MemoryStorage()
 })();

 (function(){
   mse.datas.Storage = function(){
       var storage = window.sessionStorage;
       if (!storage) {//不支持sessionStorage则使用内存缓存
           storage = mse.data.MemoryStorage;
       }
       var methods = {
           getItem: function (key) {
               value = JSON.parse(storage.getItem(key));
               return value;
           },
           setItem : function (key, value) {
               if (typeof key !== 'string' || !key) {
                   throw new Error('cannot call sui.data.Storage.set(), key is invalid');
               }
               storage.setItem(key, JSON.stringify(value));
               return storage;
           }
       };
       methods.get = methods.getItem;
       methods.set = methods.setItem;
       return methods;
   }(); // 注意这里有(),是立即执行

   mse.apply(mse, {
       iStorage : function() {
           return mse.datas.Storage
       }
   });
   console.log(mse.iStorage().get('user2'));

   // mse.iStorage().set('user2', 'zr2');
 })();
