(function(root, factory) {
 if (typeof define === 'function' && (define.amd || define.cmd)) {
   define(factory);
 } else if (typeof exports === 'object') {
   module.exports = factory();
 } else {
   factory()(window.NodeTpl);
 }
}(this, function() {
return function(N, undefined){
  var PATH = '/demo/tpls/1.js';
  if(!N || !N._tpls) return false;
  N._tpls[PATH] = N._tpls[PATH] ||
{
  "main": function($DATA, guid){
    var _ = '', css = '', dguid = N.dguid();
    guid = guid || N.guid();

    _ += '<h1>';
    _ += (($DATA.title) == null ? '' : ($DATA.title));
    _ += '</h1>\n<ul>\n  ';
for(var i=0; i<$DATA.favor.length; i++){
    _ += '\n    <li>';
    _ += ((i) == null ? '' : (i));
    _ += '：';
    _ += (($DATA.favor[i]) == null ? '' : ($DATA.favor[i]));
    _ += '</li>\n  ';
}
    _ += '\n</ul>';
    $DATA && (N._data[dguid] = $DATA);
    return _;
  }
};
};
}));