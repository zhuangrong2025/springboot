/*
 *  SelfVue，监听数据，和编译dom
 */
 function SelfVue(options){
     var self = this;
     this.vm = this
     this.data = options.data; // 保证要有data元素，不然value就没有
     Object.keys(this.data).forEach(function(key){
         self.proxyKeys(key)
     })
     observe(this.data)
     new Compile(options.el, this.vm)
     return this
 }
 SelfVue.prototype.proxyKeys =  function(key){
     var self = this
     Object.defineProperty(this, key, {
         get: function(){
             return self.data[key]
         },
         set: function(newVal){
             self.data[key] = newVal
         }
     })
 }
