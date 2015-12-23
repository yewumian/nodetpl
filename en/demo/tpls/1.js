(function(root, factory) {
 if (typeof define === 'function') {
   define(factory);
 } else if (typeof exports === 'object') {
   module.exports = factory;
 } else {
   factory();
 }
}(this, function(require, exports, module) {
  var nodetpl = typeof require === 'function' ? require('nodetpl') : window.nodetpl;
  var tpl_id = module && module.uri ? module.uri : nodetpl._getCurrentScript();
  nodetpl._tpls[tpl_id] = {
  "main": function($DATA, guid){
    var _ = '';
    var css = '';
    var duid = nodetpl.duid();
    guid = guid || nodetpl.guid();

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
    $DATA && (nodetpl._data[duid] = $DATA);
    return _;
  }
};
  return nodetpl._tpls[tpl_id];
}));