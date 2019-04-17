define("seajs/plugin-text", ["./plugin-base"], function(e) {
  function t(e) {
    return e.replace(/(["\\])/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\f/g, "\\f")
  }
  var n = e("./plugin-base"),
    a = n.util;
  n.add({
    name: "text",
    ext: [".tpl", ".htm", ".html"],
    fetch: function(e, n) {
      a.xhr(e, function(e) {
        var l = t(e);
        a.globalEval('define([], "' + l + '")'), n()
      })
    }
  })
}), seajs.use("seajs/plugin-text");
