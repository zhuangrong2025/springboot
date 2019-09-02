/*
 * new Hash([['tes1', 1],['test2',2],['test3',3]])
 * =>  {
      size: 3,
      __data__: {
        test1: 1,
        test2: 2,
        test3: 3
      }
    }
 */

const HASH_UNDEFINED = '__lodash_hash_undefined__'


var Hash = function(entries){
    this.initial(entries)
}
    Hash.prototype = {
        initial: function(entries){
            this.entries = entries
            this.__data__ = {}
            this.size = 0
        },
        render: function(){

            var length = this.entries == null ? 0 : this.entries.length;
            for (var entry of entries){
                
            }

        }
    }
// class Hash {
//     constructor(entries){
//         var index = -1
//         var length = entries == null ? 0 : entries.length
//
//         this.clear()
//         while(++index < length){
//             var entry = entries[index]
//             this.set(entry[0], entry[1])
//         }
//     }
//
//     clear(){
//         this.__data__ = Object.create(null)
//         this.size = 0
//     }
//
//     has(key){
//         var data = this.__data__
//         return data[key] !== undefined
//     }
//
//     set(key, value){
//         var data = this.__data__
//         this.size += this.has(key) ? 0 : 1
//         data[key] = value === undefined ? HASH_UNDEFINED : value
//         return this
//     }
// }
export default Hash
