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
  var PATH = '';
  if(!N || !N._tpls) return false;
  if (PATH === '' && N._getCurrentScript) {
    PATH = N._getCurrentScript();
  }
  N._tpls[PATH] = N._tpls[PATH] ||
{
  "main": function($DATA, guid){
    var _ = '', css = '', dguid = N.dguid();
    guid = guid || N.guid();

with($DATA || {}){

    _ += '<h1>';
    _ += ((title) == null ? '' : (title));
    _ += '</h1>\n<ul>\n  ';
for(var i=0; i<favor.length; i++){
    _ += '\n    <li>';
    _ += ((i) == null ? '' : (i));
    _ += '：';
    _ += ((favor[i]) == null ? '' : (favor[i]));
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