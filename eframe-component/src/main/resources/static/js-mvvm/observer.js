/*
 *  observer
 *  Observer是一个数据监听器，其实现核心方法就是前文所说的Object.defineProperty( ),set()方法
 *  如果要对所有属性都进行监听的话，那么可以通过递归方法遍历所有属性值
 *  dep 类，添加订阅者容器 this.subs = []， push ，通知 notify
 */

// 遍历data
function observe(data){
    if(!data || typeof data !== 'object'){
        return
    }
    Object.keys(data).forEach(function(key){
        defineReactive(data, key, data[key])
    })

}
// 定义属性
function defineReactive(data, key, val){
    observe(val) // 判断是否是object，不是object或数据，就return，递归子属性， val是observer函数data[key]
    var dep = new Dep()
    Object.defineProperty(data, key, {
        get: function(){
            console.log(1);
            if(Dep.target){ // 是否需要添加，初始化就添加watcher
                dep.addSub(Dep.target)
            }
            return val
        },
        set: function(newVal){
            val = newVal
            console.log('属性' + key + '已被监听，现在值为:' + newVal.toString());
            dep.notify() // 数据变化通知订阅者
        }
    })
}
// 订阅者容器
function Dep(){
    this.subs = [] // 添加watcher
}
Dep.prototype.addSub = function(watcher){
    this.subs.push(watcher)
}
Dep.prototype.notify = function(){
    this.subs.forEach(function(sub){
        sub.update()
    })
}
Dep.target = null;
