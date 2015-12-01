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
    css += '#' + guid + ' .title{    font-size: 14px;    font-weight: bold;  }';
    css += '#' + guid + ' .content{    padding: 10px;  }';
    _ += N.css(css);
with($DATA || {}){

    _ += '<div id="'+ guid +'">\n    <div class="title">个人名片 [<a class="link-modify" href="javascript:;">修改</a>]</div>\n    <div class="content"></div>\n  </div>';

}
    _ += '<script>';
    _ += '(function(window, document, undefined){\n';
    _ += '  var __module_id = "_main";\n';
    _ += '  var __callback = function(nodetpl){\n';
    _ += '    var ROOT, $ROOT, SUBROOT, $SUBROOT, $TPLS, $DATA;\n';
    _ += '    ROOT = document.getElementById("'+ guid +'");\n';
    _ += '    SUBROOT = document.getElementById("'+ guid + dguid +'");\n';
    _ += '    $TPLS = nodetpl._tpls["'+ PATH +'"];\n';
    _ += '    $DATA = nodetpl._data["'+ dguid +'"];\n';
    _ += '    try{\n';
    _ += '      $ROOT = '+ N.options.vars.root.replace(/~/, guid) + ';\n';
    _ += '      $SUBROOT = '+ N.options.vars.root.replace(/~/, guid + dguid) + ';\n';
    _ += '    } catch(e) { }\n';
    _ += 'var contentBox = $ROOT.find(\'.content\');\n';
    _ += '  var viewHtml = $TPLS[\'view\']($DATA, "'+ guid +'");\n';
    _ += '  contentBox.html(viewHtml);\n';
    _ += '  $ROOT.find(\'.title a.link-modify\').on(\'click\', function(){\n';
    _ += '    var editHtml = $TPLS[\'edit\']($DATA, "'+ guid +'");\n';
    _ += '    contentBox.html(editHtml);\n';
    _ += '  });\n';
    _ += '    delete nodetpl._data["'+ dguid +'"];\n';
    _ += '  };\n';
if (typeof define === 'function' && define.cmd && typeof seajs === 'object') {
  // CMD seaJs
    _ += '  define(__module_id, function(require, exports, module){\n';
    _ += '    var nodetpl = require(\'nodetpl\');\n';
    _ += '    __callback(nodetpl);\n';
    _ += '  });\n';
    _ += '  seajs.use(__module_id);\n';
} else if (typeof define === 'function' && define.amd && typeof require === 'function') {
  // AMD requireJs
    _ += '  require(\'nodetpl\', function(nodetpl){\n';
    _ += '    __callback(nodetpl);\n';
    _ += '  });\n';
} else {
    _ += '__callback(window.nodetpl);\n';
}
    _ += '})(window, document);\n';
    _ += '</script>\n';
    $DATA && (N._data[dguid] = $DATA);
    return _;
  },
  "view": function($DATA, guid){
    var _ = '', css = '', dguid = N.dguid();
    guid = guid || N.guid();
    css += '';
    css += '#' + guid + dguid + ' ul li{    border: 1px solid #ccc;  }';
    _ += N.css(css);
with($DATA || {}){

    _ += '<div id="'+ guid + dguid +'">\n    <ul>\n      <li>姓名：';
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
    $DATA && (N._data[dguid] = $DATA);
    return _;
  },
  "edit": function($DATA, guid){
    var _ = '', css = '', dguid = N.dguid();
    guid = guid || N.guid();
    css += '';
    css += '#' + guid + dguid + ' ul li{    margin: 0 10px;    background-color: #eee;  }';
    _ += N.css(css);
with($DATA || {}){

    _ += '<div id="'+ guid + dguid +'">\n    <form action="">\n      <ul>\n        <li>姓名：<input type="text" name="name" value="';
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
    _ += '<script>';
    _ += '(function(window, document, undefined){\n';
    _ += '  var __module_id = "_edit";\n';
    _ += '  var __callback = function(nodetpl){\n';
    _ += '    var ROOT, $ROOT, SUBROOT, $SUBROOT, $TPLS, $DATA;\n';
    _ += '    ROOT = document.getElementById("'+ guid +'");\n';
    _ += '    SUBROOT = document.getElementById("'+ guid + dguid +'");\n';
    _ += '    $TPLS = nodetpl._tpls["'+ PATH +'"];\n';
    _ += '    $DATA = nodetpl._data["'+ dguid +'"];\n';
    _ += '    try{\n';
    _ += '      $ROOT = '+ N.options.vars.root.replace(/~/, guid) + ';\n';
    _ += '      $SUBROOT = '+ N.options.vars.root.replace(/~/, guid + dguid) + ';\n';
    _ += '    } catch(e) { }\n';
    _ += '$SUBROOT.find(\'form\').on(\'submit\', function(){\n';
    _ += '    var name = $(this).find(\'input[name="name"]\').val(),\n';
    _ += '      gender = $(this).find(\'input[name="gender"]\').val(),\n';
    _ += '      age = $(this).find(\'input[name="age"]\').val();\n';
    _ += '    $DATA.name = name;\n';
    _ += '    $DATA.gender = gender;\n';
    _ += '    $DATA.age = age;\n';
    _ += '    var viewHtml = $TPLS[\'view\']($DATA, "'+ guid +'");\n';
    _ += '    $ROOT.find(\'.content\').html(viewHtml);\n';
    _ += '    return false;\n';
    _ += '  });\n';
    _ += '    delete nodetpl._data["'+ dguid +'"];\n';
    _ += '  };\n';
if (typeof define === 'function' && define.cmd && typeof seajs === 'object') {
  // CMD seaJs
    _ += '  define(__module_id, function(require, exports, module){\n';
    _ += '    var nodetpl = require(\'nodetpl\');\n';
    _ += '    __callback(nodetpl);\n';
    _ += '  });\n';
    _ += '  seajs.use(__module_id);\n';
} else if (typeof define === 'function' && define.amd && typeof require === 'function') {
  // AMD requireJs
    _ += '  require(\'nodetpl\', function(nodetpl){\n';
    _ += '    __callback(nodetpl);\n';
    _ += '  });\n';
} else {
    _ += '__callback(window.nodetpl);\n';
}
    _ += '})(window, document);\n';
    _ += '</script>\n';
    $DATA && (N._data[dguid] = $DATA);
    return _;
  }
};
};
}));