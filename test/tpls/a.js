(function(root, factory) {
 if (typeof define === 'function' && (define.amd || define.cmd)) {
   define(factory);
 } else if (typeof exports === 'object') {
   module.exports = factory();
 } else {
   factory()(window.nodetpl);
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
    css += '';
    css += '#' + guid + ' a{  font-size: 12px;}';
    _ += N.css(css);
with($DATA || {}){

    _ += '<div id="'+ guid +'">\n  <h1>';
    _ += ((title) == null ? '' : (title));
    _ += '</h1>\n  <ul>\n    ';
for(var i=0; i<favor.length; i++){
    _ += '\n      <li>';
    _ += ((i) == null ? '' : (i));
    _ += '：';
    _ += ((favor[i]) == null ? '' : (favor[i]));
    _ += '</li>\n    ';
}
    _ += '\n  </ul>\n</div>';

}
    _ += '<script>';
    _ += '(function(window, document, undefined){\n';
    _ += '  var ROOT, $ROOT, SUBROOT, $SUBROOT, $TPLS, $DATA;\n';
    _ += '  ROOT = document.getElementById("'+ guid +'");\n';
    _ += '  SUBROOT = document.getElementById("'+ guid + dguid +'");\n';
    _ += '  $TPLS = nodetpl._tpls["'+ PATH +'"];\n';
    _ += '  $DATA = nodetpl._data["'+ dguid +'"];\n';
    _ += '  try{\n';
    _ += '    $ROOT = '+ N.options.vars.root.replace(/~/, guid) + ';\n';
    _ += '    $SUBROOT = '+ N.options.vars.root.replace(/~/, guid + dguid) + ';\n';
    _ += '  } catch(e) { }\n';
    _ += 'console.log($ROOT);\n';
    _ += '})(window, document);\n';
    _ += 'delete nodetpl._data["'+ dguid +'"];\n';
    _ += '</script>\n';
    $DATA && (N._data[dguid] = $DATA);
    return _;
  }
};
};
}));