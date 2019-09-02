
/*
 *  透明单例模式
 *  单例模式的实现实质即创建一个可以返回对象实例的引用和一个获取该实例的方法
 */


 let Modal = (function(){
     let instance;
     return function(name) {
         if (instance) {
            return instance;
         }
         this.name = name;
         return instance = this;
     }
 })();
 Modal.prototype.getName = function() {
     return this.name
 }


export default Modal
