/*
 *  适配器模式
 *  适配器模式（Adapter）是将一个类（对象）的接口（方法或属性）转化成适应当前场景的另一个接口（方法或属性）
 *  createTime => createAt ;  2019-10-01 => 2019/10/01
 */

function adapter(item){
    switch(item.type){
        case 'article':
            item.createAt = new Date(item.createAt.replace(/-/g, '/')).getTime()
            item.updateAt = new Date(item.updateAt.replace(/-/g, '/')).getTime()
        break;
        case 'answer':
            item.createAt = new Date(item.createAt.replace(/-/g, '/')).getTime()
        break;
        case 'course':
            item.createAt = item.createTime
        break;

    }
}
