/*
 *  工厂模式
 *  工厂模式最直观的地方在于，创建产品对象不是通过直接new 产品类实现，而是通过工厂方法实现
 *  class Product  =>  class Factory => create(){new Product}
 */
class Product{
    constructor(name){
        this.name = name;
    }
    init(){
        console.log('初始化产品' + this.name);
    }
}
class Factory{
    create(name){
        return new Product(name)
    }
}
export default Factory
