
/*
 * iteratee(value, index, array)
 * function square(n) {
 *   return n * n
 * }
 *
 * map([4, 8], square)
 * // => [16, 64]
 */

function map(array, iteratee){
    let index = -1
    const length = array == null ? 0 : array.length
    const result = new Array(length)
    while(++index < length){
        result[index] = iteratee(array[index], index, array)
    }
    return result
}
export default map
