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
    css += '\n#' + guid + ' .title{    font-size: 14px;    font-weight: bold;  }\n#' + guid + ' .content{    padding: 10px;  }';
    _ += nodetpl.css(css);
with($DATA || {}){

    _ += '<div id="'+ guid +'">\n    <div class="title">个人名片 [<a class="link-modify" href="javascript:;">修改</a>]</div>\n    <div class="content"></div>\n  </div>';

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
    _ += 'var contentBox = $(ROOT).find(\'.content\');\n';
    _ += '  var viewHtml = $TPLS[\'view\']($DATA, guid);\n';
    _ += '  contentBox.html(viewHtml);\n';
    _ += '  $(ROOT).find(\'.title a.link-modify\').on(\'click\', function(){\n';
    _ += '    var editHtml = $TPLS[\'edit\']($DATA, guid);\n';
    _ += '    contentBox.html(editHtml);\n';
    _ += '  });\n';
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
  },
  "view": function($DATA, guid){
    var _ = '';
    var css = '';
    var duid = nodetpl.duid();
    guid = guid || nodetpl.guid();
    css += '\n#' + guid + duid + ' ul li{    border: 1px solid #ccc;  }';
    _ += nodetpl.css(css);
with($DATA || {}){

    _ += '<div id="'+ guid + duid +'">\n    <ul>\n      <li>姓名：';
    if (typeof name !== "undefined") {
      _ += (name);
    }

    _ += '</li>\n      <li>性别：';
    if (typeof gender !== "undefined") {
      _ += (gender);
    }

    _ += '</li>\n      <li>年龄：';
    if (typeof age !== "undefined") {
      _ += (age);
    }

    _ += '</li>\n    </ul>\n  </div>';

}
    $DATA && (nodetpl._data[duid] = $DATA);
    return _;
  },
  "edit": function($DATA, guid){
    var _ = '';
    var css = '';
    var duid = nodetpl.duid();
    guid = guid || nodetpl.guid();
    css += '\n#' + guid + duid + ' ul li{    margin: 0 10px;    background-color: #eee;  }';
    _ += nodetpl.css(css);
with($DATA || {}){

    _ += '<div id="'+ guid + duid +'">\n    <form action="">\n      <ul>\n        <li>姓名：<input type="text" name="name" value="';
    if (typeof name !== "undefined") {
      _ += (name);
    }

    _ += '" /></li>\n        <li>性别：<input type="text" name="gender" value="';
    if (typeof gender !== "undefined") {
      _ += (gender);
    }

    _ += '" /></li>\n        <li>年龄：<input type="text" name="age" value="';
    if (typeof age !== "undefined") {
      _ += (age);
    }

    _ += '" /></li>\n      </ul>\n      <div class="form-actions">\n        <button type="submit">保存</button>\n      </div>\n    </form>\n  </div>';

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
    _ += '$(SUBROOT).find(\'form\').on(\'submit\', function(){\n';
    _ += '    var name = $(this).find(\'input[name="name"]\').val(),\n';
    _ += '      gender = $(this).find(\'input[name="gender"]\').val(),\n';
    _ += '      age = $(this).find(\'input[name="age"]\').val();\n';
    _ += '    $DATA.name = name;\n';
    _ += '    $DATA.gender = gender;\n';
    _ += '    $DATA.age = age;\n';
    _ += '    var viewHtml = $TPLS[\'view\']($DATA, guid);\n';
    _ += '    $(ROOT).find(\'.content\').html(viewHtml);\n';
    _ += '    return false;\n';
    _ += '  });\n';
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