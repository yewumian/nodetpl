(function(root, factory) {
 if (typeof define === 'function') {
   if (define.amd){
     define(factory);
   } else if (define.cmd){
     define(function(require, exports, module) {
       return factory(require, exports, module);
     });
   }
 } else if (typeof exports === 'object') {
   module.exports = factory();
 } else {
   factory()(window.nodetpl);
 }
}(this, function(require, exports, module) {
return function(N, undefined){
  var PATH = '';
  if(!N || !N._tpls) return false;
  if (PATH === '') {
    if (module && module.uri) {
      PATH = module.uri;
    } else if (N._getCurrentScript) {
      PATH = N._getCurrentScript();
    }
  }
  N._tpls[PATH] = N._tpls[PATH] ||
{
  "main": function($DATA, guid){
    var _ = '', css = '', dguid = N.dguid();
    guid = guid || N.guid();

with($DATA || {}){

    _ += '<h1>';
    if (typeof title !== "undefined") {
      _ += (title);
    }

    _ += '</h1>\n<ul>\n  ';
for(var i=0; i<favor.length; i++){
    _ += '\n    <li>';
    if (typeof i !== "undefined") {
      _ += (i);
    }

    _ += '：';
    if (typeof favor !== "undefined") {
      _ += (favor[i]);
    }

    _ += '</li>\n  ';
}
    _ += '\n</ul>';

}
    $DATA && (N._data[dguid] = $DATA);
    return _;
  }
};
};
}));