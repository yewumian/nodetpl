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
  var PATH = '/static/js/tpl/a.js';
  if(!N || !N._tpls) return false;
  N._tpls[PATH] = N._tpls[PATH] ||
{
  "main": function($DATA, guid){
    var _ = '', css = '', dguid = N.dguid();
    guid = guid || N.guid();
    css += '';
    css += '#' + guid + ' a{  font-size: 12px;}';
    _ += N.css(css);
    _ += '<div id="'+ guid +'">\n  ';
for(var i=0; i<10; i++){
    _ += '\n    <p>';
    _ += ((i) == null ? '' : (i));
    _ += '</p>\n  ';
}
    _ += '\n</div>';
    _ += '<script>';
    _ += '(function(window, document, undefined){\n';
    _ += '  var $ROOT = '+ N.options.vars.root.replace(/~/, guid) + ';\n';
    _ += '  var $TPLS = NodeTpl._tpls["'+ PATH +'"];\n';
    _ += '  var $DATA = NodeTpl._data["'+ dguid +'"];\n';
    _ += 'console.log($ROOT);\n';
    _ += '})(window, document);\n';
    _ += 'delete NodeTpl._data["'+ dguid +'"];\n';
    _ += '</script>\n';
    $DATA && (N._data[dguid] = $DATA);
    return _;
  }
};
};
}));