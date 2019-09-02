

/*
 *  单例模式
 *  弹窗
 *  单例模式的实现实质即创建一个可以返回对象实例的引用和一个获取该实例的方法。保证创建对象的引用恒唯一
 */
class Modal{
    login(){
        console.log('login...');
    }
}
Modal.create = (function(){
    var instance
    return function(){
        if(!instance){
            instance = new Modal()
        }
        return instance
    }
})()

export default Modal
