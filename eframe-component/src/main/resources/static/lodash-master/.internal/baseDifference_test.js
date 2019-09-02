import map from '../map.js'


/**
 * The base implementation of methods like `difference` without support
 * for excluding multiple arrays.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * var ret = differenceBy([{ 'x': 2 }, { 'x': 1, 'y': 2 }, { 'x': 3 }], [{ 'x': 1 }], function(o){
 *      return o.x
 * });
 * console.log(ret) // [{x: 2}]

 * var ret1 = differenceBy([1, 2], [1]);
 * console.log(ret1) // [2]
 */
function baseDifference(array, values, iteratee) {
    var result = []
    var valuesLength = values.length
    var isCommon = true

    if(!array.length){ // 如果数组length为0
        return result
    }
    if(iteratee){
        values = map(values, (value) => iteratee(value))
    }

    outer:
    for(var value of array){
        var computed = iteratee == null ? value : iteratee(value)
        if(isCommon && computed === computed){ // 排除1 == '1' 的情况, isCommon是开关
            //排除一致的
            var valuesIndex = valuesLength
            while(valuesIndex--){
                if(values[valuesIndex] == computed){
                    continue outer // 值相等，就不执行下面，继续for执行
                }
            }
            result.push(value)
        }
    }
    return result

}

export default baseDifference
