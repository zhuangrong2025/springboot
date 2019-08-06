
/*
* isArrayLike([1, 2, 3])
* // => true
*
* isArrayLike(document.body.children)
* // => true
*
* isArrayLike('abc')
* // => true
*
* isArrayLike(Function)
* // => false
 */
import isLength from './isLength.js';
function isArrayLike(value){
    return value != null && typeof value != 'function' && isLength(value.length)
}
export default isArrayLike
