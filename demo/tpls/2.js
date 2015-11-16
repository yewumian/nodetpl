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
  var PATH = '/demo/tpls/2.js';
  if(!N || !N._tpls) return false;
  N._tpls[PATH] = N._tpls[PATH] ||
{
  "main": function($DATA, guid){
    var _ = '', css = '', dguid = N.dguid();
    guid = guid || N.guid();
    css += '';
    css += '#' + guid + ' .title{    font-size: 14px;    font-weight: bold;  }';
    css += '#' + guid + ' .content{    padding: 10px;  }';
    _ += N.css(css);
    _ += '<div id="'+ guid +'">\n    <div class="title">个人名片 [<a class="link-modify" href="javascript:;">修改</a>]</div>\n    <div class="content"></div>\n  </div>';
    _ += '<script>';
    _ += '(function(window, document, undefined){\n';
    _ += '  var ROOT = document.getElementById("'+ guid +'");\n';
    _ += '  var SUBROOT = document.getElementById("'+ guid + dguid +'");\n';
    _ += '  var $ROOT = '+ N.options.vars.root.replace(/~/, guid) + ';\n';
    _ += '  var $SUBROOT = '+ N.options.vars.root.replace(/~/, guid + dguid) + ';\n';
    _ += '  var $TPLS = NodeTpl._tpls["'+ PATH +'"];\n';
    _ += '  var $DATA = NodeTpl._data["'+ dguid +'"];\n';
    _ += 'var contentBox = $ROOT.find(\'.content\');\n';
    _ += '  var viewHtml = $TPLS[\'view\']($DATA, "'+ guid +'");\n';
    _ += '  contentBox.html(viewHtml);\n';
    _ += '  $ROOT.find(\'.title a.link-modify\').on(\'click\', function(){\n';
    _ += '    var editHtml = $TPLS[\'edit\']($DATA, "'+ guid +'");\n';
    _ += '    contentBox.html(editHtml);\n';
    _ += '  });\n';
    _ += '})(window, document);\n';
    _ += 'delete NodeTpl._data["'+ dguid +'"];\n';
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
    _ += '<div id="'+ guid + dguid +'">\n    <ul>\n      <li>姓名：';
    _ += (($DATA.name) == null ? '' : ($DATA.name));
    _ += '</li>\n      <li>性别：';
    _ += (($DATA.gender) == null ? '' : ($DATA.gender));
    _ += '</li>\n      <li>年龄：';
    _ += (($DATA.age) == null ? '' : ($DATA.age));
    _ += '</li>\n    </ul>\n  </div>';
    $DATA && (N._data[dguid] = $DATA);
    return _;
  },
  "edit": function($DATA, guid){
    var _ = '', css = '', dguid = N.dguid();
    guid = guid || N.guid();
    css += '';
    css += '#' + guid + dguid + ' ul li{    margin: 0 10px;    background-color: #eee;  }';
    _ += N.css(css);
    _ += '<div id="'+ guid + dguid +'">\n    <form action="">\n      <ul>\n        <li>姓名：<input type="text" name="name" value="';
    _ += (($DATA.name) == null ? '' : ($DATA.name));
    _ += '" /></li>\n        <li>性别：<input type="text" name="gender" value="';
    _ += (($DATA.gender) == null ? '' : ($DATA.gender));
    _ += '" /></li>\n        <li>年龄：<input type="text" name="age" value="';
    _ += (($DATA.age) == null ? '' : ($DATA.age));
    _ += '" /></li>\n      </ul>\n      <div class="form-actions">\n        <button type="submit">保存</button>\n      </div>\n    </form>\n  </div>';
    _ += '<script>';
    _ += '(function(window, document, undefined){\n';
    _ += '  var ROOT = document.getElementById("'+ guid +'");\n';
    _ += '  var SUBROOT = document.getElementById("'+ guid + dguid +'");\n';
    _ += '  var $ROOT = '+ N.options.vars.root.replace(/~/, guid) + ';\n';
    _ += '  var $SUBROOT = '+ N.options.vars.root.replace(/~/, guid + dguid) + ';\n';
    _ += '  var $TPLS = NodeTpl._tpls["'+ PATH +'"];\n';
    _ += '  var $DATA = NodeTpl._data["'+ dguid +'"];\n';
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
    _ += '})(window, document);\n';
    _ += 'delete NodeTpl._data["'+ dguid +'"];\n';
    _ += '</script>\n';
    $DATA && (N._data[dguid] = $DATA);
    return _;
  }
};
};
}));