define(function(require, exports, module) {
    var _ = require('lodash'),
        $ = require('jquery'),
        Observer = require('observer');

    var tpl = require('./template/RoleInfoTab.html')
    var RoleInfo = function(options) {
        this.initialize(options);
    };

    RoleInfo.prototype = {
        initialize: function(options) {
            this.el = $(options.el);
        },
        render: function() {
            this.el.html(tpl);
            this._bindEvents()
        }
    };

    // 绑定事件
    RoleInfo.prototype._bindEvents = function(){
      Observer.on("deprole:click", function(data, change){
        if(change){
          console.log(data);
        }
      })
    }

    module.exports = RoleInfo;
});
