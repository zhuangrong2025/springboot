var mse = {
    /**
     * True if `value` is an primitive `Object`.
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     */
    isObject : function (value) {
        var type = typeof value;
        return value != null && (type == 'object' || type == 'function');
    },
    /**
     * This method returns `undefined`.
     */
    noop : function() {},
    /**
     * Copies all the properties of config to obj.
     * @param {Object} obj The receiver of the properties
     * @param {Object} config The source of the properties
     * @param {Object} defaults A different object that will also be applied for default values
     * @return {Object} returns obj
     */
    apply : function(o, c, defaults){
        // no "this" reference for friendly out of scope calls
        if(defaults){
            mse.apply(o, defaults);
        }
        if(o && c && typeof c == 'object'){
            for(var p in c){
                o[p] = c[p];
            }
        }
        return o;
    }
}
(function() {
    mse.data = {};
    var data = {};
    function MemoryStorage() {}
    MemoryStorage.prototype = {
        //获取数据
        getItem : function(key){
            return data[key];
        },
        //保存数据
        setItem : function(key, value){
            if (typeof key !== 'string' || !key) {
                throw new Error('cannot call sui.data.MemoryStorage.set(), key is invalid');
            }
            data[key] = value;
            return this;
        },
        //删除保存的数据
        removeItem : function(key) {
            delete data[key];
            return this;
        },
        //删除所有保存的数据
        clear : function() {
            data = {};
            return this;
        },
        //复制所有保存的数据
        clone: function() {
            return mse.clone(data);
        }
    }
    mse.data.MemoryStorage = new MemoryStorage();
})();
(function() {
    mse.data.Storage = function() {
        var storage = window.sessionStorage;
        if (!storage) {//不支持sessionStorage则使用内存缓存
            storage = mse.data.MemoryStorage;
        }
        var methods = {
            getItem: function (key) {
                var value = null;
                try {
                    value = JSON.parse(storage.getItem(key));
                } catch (e) {
                }
                return value;
            },
            setItem : function (key, value) {
                if (typeof key !== 'string' || !key) {
                    throw new Error('cannot call sui.data.Storage.set(), key is invalid');
                }
                storage.setItem(key, JSON.stringify(value));
                return storage;
            },
            removeItem: function (key) {
                storage.removeItem(key);
                return this;
            },
            clear: function () {
                storage.clear();
                return this;
            }
        };
        methods.get = methods.getItem;
        methods.set = methods.setItem;
        methods.update = methods.updateItem;
        methods.remove = methods.removeItem;
        return methods;
    }();

    mse.apply(mse, {
        getStorage : function() {
            return mse.data.Storage
        }
    });
})();