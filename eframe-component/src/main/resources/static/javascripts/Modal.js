define(function(require,exports,module){
  var $ = require("jquery"),
      _ = require("lodash")


  // 创建类
  var Modal = function () {
    this.cfg = {
      width: 500,
      height: 300,
      title: "title",
      content: "",
      handler: null
    }
  }

  Modal.prototype = {
    alert: function(cfg){
      var CFG = $.extend(this.cfg, cfg)
      var modalBox = '<div id="modal" class="modal-wrap">'+ CFG.content +'<button class="btn" id="btnok">ok</button></div>'
      $("body").append(modalBox)
      $("#btnok").on("click",function(){
        CFG.handler && CFG.handler()
        $("#modal").remove()
      })
    }
  }

  module.exports = Modal;
})
