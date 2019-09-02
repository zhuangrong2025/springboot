




/*
 *  工厂方法模式
 *  其核心思想就是独立出一个大的User类，将创建实例对象的过程用其子类来实现
 */
class User{
    constructor(name = '', viewPage = []){ //默认值
        this.name = name;
        this.viewPage = viewPage;
    }
    init(){
        console.log(this.viewPage);
    }
}
class UserFactory extends User{ //子类
    constructor(name, viewPage){
        super(name, viewPage)
    }
    create(role){
        switch(role){
            case 'superAdmin':
                return new UserFactory('超级管理员', ['首页', '通讯录', '发现页', '应用数据', '权限管理'] );
                break
            case 'admin':
                return new UserFactory('管理员', ['首页', '通讯录'] );
                break
            default:
                throw new Error('params error')
        }
    }
}
export default UserFactory

//应用场景 jQuery
// class jQuery{
//     constructor(selector){
//         super(selector)
//     }
// }
// window.$ = function(selector){
//     return new jQuery(selector)
// }
