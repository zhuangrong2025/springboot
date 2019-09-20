/**
 * A specialized version of `reduce` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 * arrayReduce([1,2], (sum, n) => sum + n, 0)
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  let index = -1
  const length = array == null ? 0 : array.length
  //判读初始值是数组的第一个值
  if(initAccum && length){
      accumulator = array[++index]
  }
  while(++index < length){
      accumulator = iteratee(accumulator, )
      return accumulator
  }
}

export default arrayReduce
