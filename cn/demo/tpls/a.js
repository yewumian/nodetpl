(function(root, factory) {
 if (typeof define === 'function') {
   define(factory);
 } else if (typeof require === 'function' && typeof exports === 'object') {
   factory(require, exports, module);
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
    css += '\n#' + guid + ' a{  font-size: 12px;}';
    _ += nodetpl.css(css);
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
    _ += '\n<script>\n';
    _ += '(function(window, document, undefined){\n';
    _ += '  var _module_id = Math.random().toString();\n';
    _ += '  var _factory = function(require, exports, module){\n';
    _ += '    var nodetpl = typeof require === \'function\' ? require(\'nodetpl\') : window.nodetpl;\n';
    _ += '    var ROOT, $ROOT, SUBROOT, $SUBROOT, $TPLS, $DATA;\n';
    _ += '    var guid = \''+ guid + '\', duid = \''+ duid + '\';\n';
    _ += '    ROOT = document.getElementById(guid);\n';
    _ += '    SUBROOT = document.getElementById(guid + duid);\n';
    _ += '    $TPLS = nodetpl._tpls["'+ tpl_id +'"];\n';
    _ += '    $DATA = nodetpl._data[duid];\n';
    _ += 'console.log($(ROOT));\n';
    _ += '  }\n';
    _ += '  if(typeof define === \'function\'){\n';
    _ += '    define(_module_id, _factory);\n';
    _ += '    if (define.amd && typeof require === \'function\') {\n';
    _ += '      require([_module_id]);\n';
    _ += '    } else if (define.cmd && typeof seajs === \'object\') {\n';
    _ += '      seajs.use([_module_id]);\n';
    _ += '    }\n';
    _ += '  } else {\n';
    _ += '    _factory();\n';
    _ += '  }\n';
    _ += '})(window, document);';
    _ += '</script>\n';
    $DATA && (nodetpl._data[duid] = $DATA);
    return _;
  }
};
  return nodetpl._tpls[tpl_id];
}));