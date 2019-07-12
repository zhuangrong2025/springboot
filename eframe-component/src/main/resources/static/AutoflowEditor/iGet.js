
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

 /**
  * 模拟模块，方法注册register, 调用 invoke
  * 实现过程： 1、 register ,invoke
  *           2、 callFn -- 传method， args
  *           3、 invokeExecutor(options) -- 用{method:'getflow',params: [], }组合成类c++接口函数|~|
  */
(function(){
    var fns = {} // {method: fn, method: fn}
    mse.mocks = {
        register: function(method, fn){
            fns[method] = fn
        },
        invoke: function(method, args){
            if(!fns[method]){
                throw new Error("没有方法" + method)
            }
            return fns[method].apply(this, args)
        }
    }
})();
(function(){ // 调用invoke，并分解str接口值，传参
    var separator = '|~|'
    function cppFns(str){ // str = '0|~|method|~|str1|~|str2'
        var sections = str.split(separator),
            len = sections.length,
            method = len > 1 ? sections[1] : '',
            args = [];
        if(len > 2){
            for(var i = 2; i < len ; i++){
                args.push(sections[i])
            }
        }
        return mse.mocks.invoke(method, args)
    }
    if(!window.callCppFuncs){
        window.callCppFuncs = cppFns
    }
})();
/*
    mse.invokeExecutors({
        method: 'getflow',
        params: [a, b],
        success: function(data) {

        }
    })
*/
(function(){
    var separator = '|~|'
    mse.invokeExecutors = function(options){
        options = options || {};
        var method = options.method,
            module = 0,
            params = options.params || [],
            success = options.success || mse.noop;
        var p = [];
        p.push(module);
        p.push(method);
        var callStr = p.concat(params).join(separator); // '0|~|method|~|str1|~|str2'
        var ret = window.callCppFuncs(callStr);
        return ret;
    }

})();
