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
    css += '';
    css += '#' + guid + ' a{  font-size: 12px;}';
    _ += N.css(css);
with($DATA || {}){

    _ += '<div id="'+ guid +'">\n  <h1>';
    if (typeof title !== "undefined") {
      _ += (title);
    }

    _ += '</h1>\n  <ul>\n    ';
for(var i=0; i<favor.length; i++){
    _ += '\n      <li>';
    if (typeof i !== "undefined") {
      _ += (i);
    }

    _ += '：';
    if (typeof favor !== "undefined") {
      _ += (favor[i]);
    }

    _ += '</li>\n    ';
}
    _ += '\n  </ul>\n</div>';

}
    _ += '<script>';
    _ += '(function(window, document, undefined){\n';
    _ += '  var __module_id = "'+ PATH + '_main";\n';
    _ += '  var __callback = function(nodetpl, guid, dguid){\n';
    _ += '    var ROOT, $ROOT, SUBROOT, $SUBROOT, $TPLS, $DATA;\n';
    _ += '    ROOT = document.getElementById(guid);\n';
    _ += '    SUBROOT = document.getElementById(guid + dguid);\n';
    _ += '    $TPLS = nodetpl._tpls["'+ PATH +'"];\n';
    _ += '    $DATA = nodetpl._data[dguid];\n';
    _ += '    try{\n';
    _ += '      $ROOT = '+ N.options.vars.root.replace(/~/, '"+ guid + "') + ';\n';
    _ += '      $SUBROOT = '+ N.options.vars.root.replace(/~/, '"+ guid + dguid + "') + ';\n';
    _ += '    } catch(e) { }\n';
    _ += 'console.log($ROOT);\n';
    _ += '    delete nodetpl._data[dguid];\n';
    _ += '  };\n';
    if (typeof define === 'function' && define.cmd && typeof seajs === 'object') {
      // CMD seaJs
      _ += '  define(__module_id, function(require, exports, module){\n';
      _ += '    var nodetpl = require(\'nodetpl\');\n';
      _ += '    return function(guid, dguid){\n';
      _ += '      __callback(nodetpl, guid, dguid);\n';
      _ += '    };\n';
      _ += '  });\n';
      _ += '  seajs.use(__module_id, function(fn){\n';
      _ += '    fn && fn("'+ guid + '", "'+ dguid + '");\n';
      _ += '  });\n';
    } else if (typeof define === 'function' && define.amd && typeof require === 'function') {
      // AMD requireJs
      _ += '  require(\'nodetpl\', function(nodetpl){\n';
      _ += '    __callback(nodetpl, "'+ guid + '", "'+ dguid + '");\n';
      _ += '  });\n';
    } else {
      _ += '__callback(window.nodetpl, "'+ guid + '", "'+ dguid + '");\n';
    }
    _ += '})(window, document);\n';
    _ += '</script>\n';
    $DATA && (N._data[dguid] = $DATA);
    return _;
  }
};
};
}));