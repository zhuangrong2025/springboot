define(function(require, exports, module) {
	var _ = require('lodash'),
        $ = require('jquery'),
        FormHelper = require('shine-form'),
        Observer = require('observer');



  var tpl = require('./template/RoleInfoStep.html');
  
	var RoleInfoStep = function(options) {
		this.initialize(options);
	};

	RoleInfoStep.prototype = {
		initialize : function(options) {
            this.el = options.el;
		},
		render : function() {
            $(this.el).html(tpl);
		},
		dispose : function() {
		},
		refresh : function() {
		}
    };


	module.exports = RoleInfoStep;
});
