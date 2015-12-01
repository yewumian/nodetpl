'use strict';

var nodetpl;

function NodeTpl() {
  this.version = '2.2.9';
  this.guid = function() {
    return 'NTGUID__' + (this.guid._counter++).toString(36);
  };
  this.dguid = function() {
    return 'NTDGUID__' + (this.dguid._counter++).toString(36);
  };
  this.rguid = function() {
    return 'NTRGUID__' + (this.rguid._counter++).toString(36);
  };
  this.guid._counter = 1;
  this.dguid._counter = 1;
  this.rguid._counter = 1;
  this._data = {};
  this._tpls = {};
  this._cache = {};
  this._docid = '_tpl_';
  this.options = {
    openTag: '<?',
    closeTag: '?>'
  };
  return this;
}
/**
 * ie split bug
 * @method _split
 * @param  {String} str       input string
 * @param  {String | RegExp}  separator spliter
 * @param  {Number} limit     limit
 * @return {Array}            result
 */
NodeTpl.prototype._split = function(str, separator, limit) {
  return str.split(separator, limit);
};
/**
 * matching template file
 * @method _template
 * @param  {String}  html template code
 * @return {Object}       template object
 */
NodeTpl.prototype._template = function(html) {
  var temp, list = {},
    regExp = /<template(.*name=['"]([^'"]+)*)?\b[^>]*>([^<]*(?:(?!<\/template>)<[^<]*)*)<\/template>/igm;
  while (temp = regExp.exec(html)) {
    if (temp[2]) {
      list[temp[2]] = temp[3]
    }
  }
  list['main'] = list['main'] || html;
  return list;
};
/**
 * render a template with data and callback
 * @method render
 * @param  {String}             html       template content
 * @param  {[Object | false]}   data       data
 * @param  {Function}           callback   the callback function
 * @return {String}                        result
 */
NodeTpl.prototype.render = function(html, data, callback) {
  var that = this,
    hasCache = false,
    result, path, setCache = function() {
      that._cache[path] = {
        html: html,
        result: result
      };
    },
    doFinal = function() {
      if (typeof that._tpls[path] === 'object' && typeof that._tpls[path].main === 'function') {
        result = that._tpls[path].main(data);
        typeof callback === 'function' && callback.call(that, result);
        return result;
      } else {
        return null;
      }
    },
    moduleIniter = function(init) {
      init(that);
      setCache();
      doFinal();
    };
  if (typeof html !== 'string') {
    throw new TypeError();
  }
  if (typeof data === 'function') {
    callback = data, data = {};
  }
  for (var i in that._cache) {
    if (that._cache.hasOwnProperty(i) && that._cache[i].html === html) {
      path = i;
      result = that._cache[i].result;
      hasCache = true;
      break;
    }
  }
  if (!hasCache) {
    // 如果非预编译模板，path 为 _docid 开头的字符串（固定）
    path = that._docid + Math.random().toString();
    result = that.compile(path, html);

    // global eval or define a module.
    (new Function(result))();

    if (typeof define === 'function' && define.amd && typeof require === 'function') {
      // requireJs module loader
      require(path, moduleIniter);
      return that;
    } else if (typeof define === 'function' && define.cmd && typeof seajs === 'object') {
      // seaJs module loader
      seajs.use(path, moduleIniter);
      return that;
    } else {
      setCache();
    }
  }
  doFinal();
  return that;
};
// todo
NodeTpl.prototype._update = function() {
  return this;
};
/**
 * Compile a template file
 * @method compile
 * @param  {String} path  pre compile path
 * @param  {String} html  the tpl content
 * @return {String}       content compiled
 */
NodeTpl.prototype.compile = function(path, html) {
  if (typeof path !== 'string' || typeof html !== 'string') {
    throw new TypeError();
  }
  return this._compile(path, this._fetch(html));
};

/**
 * resort the content of template
 * @method _fetch
 * @param  {String} html template content
 * @return {Object}      an object resorted
 */
NodeTpl.prototype._fetch = function(html) {
  var that = this,
    list, htmlCode = '',
    jsCode = '',
    cssCode = '',
    cache = {};
  var jsExp = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/igm,
    cssExp = /<style\b[^>]*>([^<]*(?:(?!<\/style>)<[^<]*)*)<\/style>/igm;
  list = this._template(html);
  for (var tplname in list) {
    if (!list.hasOwnProperty(tplname)) {
      continue;
    }
    cssCode = '';
    jsCode = '';
    htmlCode = list[tplname];
    if (!htmlCode) {
      continue;
    }
    htmlCode = htmlCode.replace(cssExp, function($, $1) {
      return cssCode += '\n' + $1, '';
    }).replace(jsExp, function($, $1) {
      return jsCode += '\n' + $1, '';
    });
    cache[tplname] = {
      css: that._css(cssCode.trim(), tplname),
      html: that._html(htmlCode.trim(), tplname),
      js: that._js(jsCode.trim(), tplname)
    };
  }
  return cache;
};
/**
 * resort css code
 * @method _css
 * @param  {String} content css code
 * @param  {String} tplname template name
 * @return {String}         css code resorted
 */
NodeTpl.prototype._css = function(content, tplname) {
  if (content) {
    content = content.replace(/'/g, '\\\'');
    content = '    css += \'' + content
      .replace(/\/\*(.|\n)*?\*\/|\r?\n/ig, '')
      .replace(/([a-zA-Z0-9_\-#*\.:\s,\(\)'"<>=]*)(\{)/ig, function(a, b, c) {
        var sguid;
        if (tplname === 'main') {
          sguid = 'guid';
        } else {
          sguid = 'guid + dguid';
        }
        b = b.trim();
        if (b === '') {
          return '#\' + ' + sguid + ' + \'' + c;
        } else {
          var _b = b.split(',');
          for (var i = 0; i < _b.length; i++) {
            _b[i] = _b[i].trim();
            _b[i] = '\';\r\n    css += \'#\' + ' + sguid + ' + \'' + (_b[i].indexOf(':') === 0 ? '' : ' ') + _b[i];
          }
          return _b.join(',') + c;
        }
      });
    content += '\';';
  }
  return content;
};
/**
 * resort js code
 * @method _js
 * @param  {String} content js code
 * @param  {String} tplname template name
 * @return {String}         js code resorted
 */
NodeTpl.prototype._js = function(content, tplname) {
  var jsarr;
  if (content) {
    jsarr = this._split(content, /\r?\n/g);
    for (var i = 0; i < jsarr.length; i++) {
      if (!jsarr[i]) continue;
      jsarr[i] = '    _ += \'' + jsarr[i]
        .replace(/\\/g, '\\\\')
        .replace(/\'/g, '\\\'')
        .replace(/\r\n/g, '\n')
        .replace(/\n/g, '\\n')
        .replace(/(^|[^\.])include\(([^\)]*)\)/ig, function(a, b, c) {
          var _c = (c || '').split(',');
          _c.map(function(value, index) {
            _c[index] = _c[index].trim();
          });
          return b + '$TPLS[' + _c[0] + '](' + (_c.length > 1 ? _c[1] : '$DATA') + ', guid)';
        }) + '\\n\';\n';
    }
    content = jsarr.join('');
  }
  return content;
};
/**
 * resort html code
 * @method _html
 * @param  {String} content html code
 * @param  {String} tplname template name
 * @return {String}         html code resorted
 */
NodeTpl.prototype._html = function(content, tplname) {
  var that = this,
    html, vars, tagExp, openTag, closeTag, getTag;
  if (content) {
    getTag = function(tag) {
      return tag.replace(/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|])/g, '\\$1');
    };
    openTag = getTag(that.options.openTag);
    closeTag = getTag(that.options.closeTag);
    html = this._split(content, new RegExp('(' + openTag + '[\\s\\S]*?' + closeTag + ')'));
    for (var i = 0; i < html.length; i++) {
      if (!html[i]) continue;
      tagExp = new RegExp(openTag + '([\\s\\S]*?)' + closeTag, 'igm');
      if (tagExp.test(html[i])) {
        html[i] = html[i].replace(tagExp, '$1');
        html[i] = html[i].replace(/@([a-zA-Z\$_]+)/igm, '$DATA.$1');
        html[i] = html[i].replace(/print\((.*?)\);/igm, '    template.push(($1) || \'\');\n');
        if (html[i].indexOf('=') === 0) {
          // 提取变量，判断是否 undefined
          html[i] = html[i].substring(1).trim();
          if (!/^\d/.test(html[i])) {
            vars = (/^(\(*)([a-zA-Z\d_\$\s\.]+)/.exec(html[i]) || [0, 0, ''])[2];
            if (vars !== '') {
              html[i] = '    if (typeof ' + vars + ' !== "undefined") {\n' +
                '      _ += (' + html[i] + ');\n' +
                '    }\n';
            } else {
              html[i] = '    _ += (' + html[i] + ');\n';
            }
          } else {
            html[i] = '    _ += (' + html[i] + ');\n';
          }
        }
      } else {
        html[i] = '\n    _ += \'' + html[i]
          .replace(/\\/g, '\\\\')
          .replace(/\'/g, '\\\'')
          .replace(/\r\n/g, '\n')
          .replace(/\n/g, '\\n') + '\';\n';
      }
    }
    content = html.join('');
    content = content.replace(/\$ROOT/igm, '\'+ guid +\'');
    content = content.replace(/\$SUBROOT/igm, '\'+ guid + dguid +\'');
  }
  content = '\nwith($DATA || {}){\n' + content + '\n}\n';
  return content;
};
/**
 * compile template using path
 * @method _compile
 * @param  {[String]} path  template path
 * @param  {Object}   cache template object
 * @return {String}         string compiled
 */
NodeTpl.prototype._compile = function(path, cache) {
  var temp, html = '',
    list = [];
  for (var i in cache) {
    if (!cache.hasOwnProperty(i)) {
      continue;
    }
    temp = '';
    temp += '  "' + i + '": function($DATA, guid){\n';
    temp += "    var _ = '', css = '', dguid = N.dguid();\n";
    temp += "    guid = guid || N.guid();\n";
    if (cache[i].css) {
      temp += cache[i].css + "\n";
      temp += "    _ += N.css(css);";
    }
    if (cache[i].html) {
      temp += cache[i].html;
    }
    if (cache[i].js) {
      temp += "    _ += '<script>';\n";
      temp += "    _ += '(function(window, document, undefined){\\n';\n";
      temp += "    _ += '  var __module_id = \"'+ PATH + '_" + i + "\";\\n';\n";
      temp += "    _ += '  var __callback = function(nodetpl, guid, dguid){\\n';\n";
      temp += "    _ += '    var ROOT, $ROOT, SUBROOT, $SUBROOT, $TPLS, $DATA;\\n';\n";
      temp += "    _ += '    ROOT = document.getElementById(guid);\\n';\n";
      temp += "    _ += '    SUBROOT = document.getElementById(guid + dguid);\\n';\n";
      temp += "    _ += '    $TPLS = nodetpl._tpls[\"\'+ PATH +\'\"];\\n';\n";
      temp += "    _ += '    $DATA = nodetpl._data[dguid];\\n';\n";
      temp += "    _ += '    try{\\n';\n";
      temp += "    _ += '      $ROOT = '+ N.options.vars.root.replace(/~/, '\"+ guid + \"') + ';\\n';\n";
      temp += "    _ += '      $SUBROOT = '+ N.options.vars.root.replace(/~/, '\"+ guid + dguid + \"') + ';\\n';\n";
      temp += "    _ += '    } catch(e) { }\\n';\n";
      temp += cache[i].js;
      temp += "    _ += '    delete nodetpl._data[dguid];\\n';\n";
      temp += "    _ += '  };\\n';\n";
      temp += "    if (typeof define === 'function' && define.cmd && typeof seajs === 'object') {\n";
      temp += "      // CMD seaJs\n";
      temp += "      _ += '  define(__module_id, function(require, exports, module){\\n';\n";
      temp += "      _ += '    var nodetpl = require(\\'nodetpl\\');\\n';\n";
      temp += "      _ += '    return function(guid, dguid){\\n';\n";
      temp += "      _ += '      __callback(nodetpl, guid, dguid);\\n';\n";
      temp += "      _ += '    };\\n';\n";
      temp += "      _ += '  });\\n';\n";
      temp += "      _ += '  seajs.use(__module_id, function(fn){\\n';\n";
      temp += "      _ += '    fn && fn(\"'+ guid + '\", \"'+ dguid + '\");\\n';\n";
      temp += "      _ += '  });\\n';\n";
      temp += "    } else if (typeof define === 'function' && define.amd && typeof require === 'function') {\n";
      temp += "      // AMD requireJs\n";
      temp += "      _ += '  require(\\'nodetpl\\', function(nodetpl){\\n';\n";
      temp += "      _ += '    __callback(nodetpl, \"'+ guid + '\", \"'+ dguid + '\");\\n';\n";
      temp += "      _ += '  });\\n';\n";
      temp += "    } else {\n";
      temp += "      _ += '__callback(window.nodetpl, \"'+ guid + '\", \"'+ dguid + '\");\\n';\n";
      temp += "    }\n";
      temp += "    _ += '})(window, document);\\n';\n";
      temp += "    _ += '</script>\\n';\n";
    }
    temp += '    $DATA && (N._data[dguid] = $DATA);\n';
    temp += "    return _;\n";
    temp += '  }';
    list.push(temp);
  }
  html += "(function(root, factory) {\n";
  html += " if (typeof define === 'function') {\n";
  html += "   if (define.amd){\n";
  html += "     define(factory);\n";
  html += "   } else if (define.cmd){\n";
  if (path.indexOf(this._docid) === 0) {
    // 非预编译模板，需要传递一个 id 给模块
    html += "     define('" + path + "', function(require, exports, module) {\n";
    html += "       return factory(require, exports, module);\n";
    html += "     });\n";
  } else {
    // 预编译模板，无需传递 id
    html += "     define(function(require, exports, module) {\n";
    html += "       return factory(require, exports, module);\n";
    html += "     });\n";
  }
  html += "   }\n";
  html += " } else if (typeof exports === 'object') {\n";
  html += "   module.exports = factory();\n";
  html += " } else {\n";
  html += "   factory()(window.nodetpl);\n";
  html += " }\n";
  html += "}(this, function(require, exports, module) {\n";
  html += "return function(N, undefined){\n";
  html += "  var PATH = '" + path + "';\n";
  html += "  if(!N || !N._tpls) return false;\n";
  html += "  if (PATH === '') {\n";
  html += "    if (module && module.uri) {\n";
  html += "      PATH = module.uri;\n";
  html += "    } else if (N._getCurrentScript) {\n";
  html += "      PATH = N._getCurrentScript();\n";
  html += "    }\n";
  html += "  }\n";
  html += "  N._tpls[PATH] = N._tpls[PATH] ||\n{\n";
  html += list.join(',\n');
  html += "\n};";
  html += "\n};\n";
  html += "}));";
  return html;
};

NodeTpl.prototype.express = {
  cache: {},
  render: function(filepath, data, callback) {
    var content, cache;
    if (typeof data === 'function') {
      callback = data, data = {};
    }
    callback = callback || function() {};
    cache = this.cache[filepath];
    if (!cache) {
      fs.readFile(filepath, 'utf-8', function(err, data) {
        if (err) {
          callback(err);
        } else {
          content = data;
          this.cache[filepath] = content;
          content = nodetpl.render(content, data);
          callback(null, content);
        }
      });
    } else {
      content = nodetpl.render(cache, data);
      callback(null, content);
    }
  }
};

nodetpl = new NodeTpl();
module.exports = nodetpl;