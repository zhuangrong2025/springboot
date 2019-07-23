define("#/xyz-storage/0.1.1/xyz-storage-debug", [ "#/lodash/lodash-debug" ], function(require, exports, module, installOption) {
    //浏览器缓存相关逻辑
    var _ = require("#/lodash/lodash-debug");
    var _localStorage = window.localStorage, _sessionStorage = window.sessionStorage;
    var setItem = function(storage, key, val, cacheTime) {
        var saveObj = {
            xyzStorageKey: true,
            //自定义缓存key
            tm: new Date().getTime(),
            data: val
        };
        if (!_.isNumber(cacheTime)) {
            cacheTime = 10;
        }
        saveObj.cacheTime = cacheTime;
        var saveData = JSON.stringify(saveObj);
        try {
            storage.setItem(key, saveData);
        } catch (e) {
            storage.clear();
            storage.setItem(key, saveData);
        }
    };
    var getItem = function(storage, key) {
        return storage.getItem(key);
    };
    var getObjItem = function(storage, key, str) {
        try {
            var dataObj = JSON.parse(str);
            if (_.isEmpty(dataObj)) {
                return null;
            }
            if (dataObj.xyzStorageKey === true) {
                var cacheTime = dataObj.cacheTime;
                if (_.isNumber(cacheTime)) {
                    var cacheSec = cacheTime * 1e3 * 60;
                    var tm = dataObj.tm;
                    var nowTime = new Date().getTime();
                    if (nowTime > cacheSec + tm) {
                        //缓存已过期
                        storage.removeItem(key);
                        return null;
                    }
                }
                return dataObj.data;
            } else {
                return str;
            }
        } catch (e) {
            return str;
        }
    };
    // localStorage setItem
    exports.setLocalItem = function(key, val, cacheTime) {
        setItem(window.localStorage, key, val, cacheTime);
    };
    // sessionStorage setItem
    exports.setSessItem = function(key, val, cacheTime) {
        setItem(window.sessionStorage, key, val, cacheTime || 1e4);
    };
    // sessionStorage getItem
    exports.getLocalItem = function(key) {
        var itemStr = getItem(_localStorage, key);
        return getObjItem(_localStorage, key, itemStr);
    };
    // sessionStorage getItem
    exports.getSessItem = function(key) {
        var itemStr = getItem(_sessionStorage, key);
        return getObjItem(_sessionStorage, key, itemStr);
    };
}, {});