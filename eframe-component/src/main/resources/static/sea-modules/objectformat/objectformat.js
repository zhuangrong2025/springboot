define("#/objectformat/0.1.3/objectformat",["#/lodash/lodash"],function(r,n,e){var a=r("#/lodash/lodash");e.exports=function(r,n){if(0===arguments.length)return null;var e=arguments[0];for(var u in n){var s=n[u];i(s)?e=o(e,u,s):a.isPlainObject(s)&&(e=t(s,[u],e))}return e};var t=function(r,n,e){for(var u in r){var s=r[u];if(n.push(u),a.isPlainObject(s))e=t(s,n,e);else if(i(s)){var f=n.join(".");e=o(e,f,s)}}return e},i=function(r){return a.isString(r)||a.isNumber(r)||a.isBoolean(r)},o=function(r,n,e){var a=new RegExp("{"+n+"}","gm");return r=r.replace(a,e)}},{});