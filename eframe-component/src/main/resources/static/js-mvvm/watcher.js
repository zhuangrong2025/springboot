/*
 *  watcher
 *  param:  vm, exp, cb
 *  判断value 和 oldvalue,赋值新value
 *  执行cb
 *  过程：1、当new Watcher时候，强制执行observer中的get（dep.addSub(watcher)）
 *       2、但执行set的时候，就触发 deps中的watcher的update，执行新旧值的替换，
 */

function Watcher(vm, exp, cb){
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = this.get() // 将自己添加到订阅器的操作
}
Watcher.prototype = {
    update: function(){
        this.run()
    },
    run: function(){
        var value = this.vm.data[this.exp] // 新的value
        var oldValue = this.value
        if(value !== oldValue){
            this.value = value
            this.cb.call(this.vm, value, oldValue)
        }
    },
    get: function(){
        console.log(22);
        Dep.target = this  // 缓存自己
        var value = this.vm.data[this.exp] // 强制执行监听器里的get函数，dep.addSub(Dep.target)
        Dep.target = null  // 释放自己
        return value
    }
}
