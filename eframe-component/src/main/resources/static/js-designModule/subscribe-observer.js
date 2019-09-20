/*
 *  观察者模式
 *  订阅发布
 */
class Subscribe{
    constructor(){
        this.pond = []; // [fn, fn]
    }
    add(fn){
        var pond = this.pond,
            isExist = false;
        // 去重
        pond.forEach(item => item === fn ? isExist = true : null);
        !isExist ? pond.push(fn) : null;
    }
    remove(fn){
        var pond = this.pond;
        pond.forEach((item, index) => {
            if(item == fn){
                pond[index] = null
            }
        })
    }
    fire(...args){
        var pond = this.pond;
        for(var i=0; i<pond.length; i++){
            var item = pond[i]
            if(item == null){
                pond.slice(i, 1)
                i--;
                continue;
            }
            item(...args)
        }
    }
}
export default Subscribe
