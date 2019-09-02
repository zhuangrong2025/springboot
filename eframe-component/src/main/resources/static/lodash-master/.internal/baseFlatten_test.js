import isFlattenable from './isFlattenable.js'

/**
 * The base implementation of `flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 * var arr = [['a'], ['b']] => [a, b]


 */
function baseFlatten(array, depth, predicate, isStrict, result) {
    predicate || (predicate = isFlattenable)
    result || (result = [])

    if(array == null){
        return result //返回初始值
    }

    for (var value of array){
        if(depth > 0 && predicate(value)){ // depth > 0 ,也算递归结束的条件
            if(depth > 1){
                baseFlatten(value, depth - 1, predicate, isStrict, result)
            }else{  // depth == 1
                
                result.push(...value)  // ...value
            }
        }else if(!isStrict){
            result[result.length] = value // 数组新增一个
        }
    }
    return result
}

export default baseFlatten
