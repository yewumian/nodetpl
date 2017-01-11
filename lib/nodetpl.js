/**
 * author : pillys@163.com
 * site   : http://www.nodetpl.com
 * license: MIT
 */
(function(root, factory) {
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(factory);
  } else if (typeof require === 'function' && typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.nodetpl = root.nodetpl || factory();
  }
}(this, function(require, exports, module) {
  'use strict';

  var version = '4.8.5';

  function NodeTpl(options) {
    return new NodeTpl.fn.init(options);
  }

  NodeTpl.fn = NodeTpl.prototype = {
    constructor: NodeTpl,
    init: function(options) {
      this.cache = {};
      this.version = version;
      this.options = this._extend({
        base: '',
        openTag: '<?',
        closeTag: '?>',
        library: 'umd', // umd | amd | cmd | commonjs | node | var | es
        strict: true,
        map: function(statements) {
          return statements;
        },
        beforeCompile: function(html) {
          return html;
        },
        afterCompile: function(html) {
          return html;
        }
      }, options);
      return this;
    }
  };

  NodeTpl.fn.init.prototype = NodeTpl.fn;

  /**
   * es5 shims
   */
  // jshint ignore: start
  if (!String.prototype.trim) String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
  if (!Array.isArray) Array.isArray = function(vArg) {
    return Object.prototype.toString.call(vArg) === '[object Array]';
  };
  if (!Array.prototype.indexOf) Array.prototype.indexOf = function(match, fromIndex) {
    var len = this.length;
    fromIndex |= 0;
    if (fromIndex < 0) {
      fromIndex = Math.max(0, len + fromIndex);
    }
    for (; fromIndex < len; fromIndex++) {
      if (fromIndex in this && this[fromIndex] === match) {
        return fromIndex;
      }
    }
    return -1;
  };
  // jshint ignore: end

  /**
   * set or get nodetpl config options
   * @method config
   * @param  {object} options nodetpl config data
   * @return {all}            config option
   */
  NodeTpl.prototype.config = function(options) {
    if (options) {
      this._extend(this.options, options);
      return this;
    } else {
      return this.options;
    }
  };
  /**
   * extend the option
   * @method _extend
   * @param  {object} obj     source object
   * @param  {object} options other object
   * @return {object}         result
   */
  NodeTpl.prototype._extend = function(obj, options) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    options = options || {};
    for (var i in options) {
      if (!hasOwnProperty.call(options, i)) continue;
      obj[i] = options[i];
    }
    return obj;
  };

  /**
   * the template when output
   * @method _template
   * @param  {object}  tpls    tpls data
   * @param  {object}  scripts scripts data
   * @param  {object}  libs    libs data
   * @return {string}          output
   */
  NodeTpl.prototype._template = function(tpls, scripts, libs) {
    var output = '';
    if (['umd', 'amd', 'cmd', 'commonjs', 'node', 'var', 'es'].indexOf(this.options.library) === -1) {
      throw new Error('library option invalid: ' + this.options.library);
    }
    if (libs) {
      output += libs + '\n';
    }
    output += '' +
      '(function(root, factory) {\n' +
      '  if (typeof define === \'function\' && (define.amd || define.cmd)) {\n' +
      '    if(typeof callback === \'function\' && typeof iife !== \'undefined\' && iife === true) {\n' +
      '      var module_id = \'nodetpl_\' + Math.random();\n' +
      '      define(module_id, factory);\n' +
      '      if(define.amd) {\n' +
      '        require([module_id], callback);\n' +
      '      } else if(define.cmd) {\n' +
      '        seajs.use([module_id], callback);\n' +
      '      } else {\n' +
      '        throw new Error(\'nodetpl cannot guess what the define means.\');\n' +
      '      }\n' +
      '    } else {\n' +
      '      define(factory);\n' +
      '    }\n' +
      '  } else if(typeof require === \'function\' && typeof exports === \'object\') {\n' +
      '    module.exports = factory(require, exports, module);\n' +
      '  } else {\n' +
      '    if(root.nodetpl) {\n' +
      '      var result = factory();\n' +
      '      if(typeof callback === \'function\' && typeof iife !== \'undefined\' && iife === true) {' +
      '        callback(result);\n' +
      '      } else {\n' +
      '        var url = root.nodetpl.getCurrentScript();\n' +
      '        if(url) {\n' +
      '          root.nodetpl.cache[url] = result;\n' +
      '        }\n' +
      '      }\n' +
      '      return result;\n' +
      '    } else {\n' +
      '      throw new Error(\'nodetpl not found.\');\n' +
      '    }\n' +
      '  }\n' +
      '}(this, function (require, exports, module) {\n' +
      (this.options.strict ? '  \'use strict\';\n' : '') +
      '  function NodeTpl() {\n' +
      '    this.version = \'' + version + '\';\n' +
      '    this.tpls = {};\n' +
      '    this.scripts = {};\n' +
      '    this.datas = {};\n' +
      '    this._initTpls()._initScripts();\n' +
      '    return this;\n' +
      '  }\n' +
      '  NodeTpl.prototype._generate = function() {\n' +
      '    return Math.random().toString().replace(\'.\', \'\');\n' +
      '  };\n' +
      '  NodeTpl.prototype._initTpls = function() {\n' +
      '    var $NODETPL = this;\n' +
      '    this.tpls = {\n' +
      '      ' + tpls.join(',') + '\n' +
      '    };\n' +
      '    return $NODETPL;\n' +
      '  };\n' +
      '  NodeTpl.prototype._initScripts = function() {\n' +
      '    var $NODETPL = this;\n' +
      '    this.scripts = {\n' +
      '      ' + scripts.join(',') + '\n' +
      '    };\n' +
      '    return $NODETPL;\n' +
      '  };\n' +
      '  NodeTpl.prototype.duid = function() {\n' +
      '    return \'nodetpl_d_\' + this._generate();\n' +
      '  };\n' +
      '  NodeTpl.prototype.guid = function() {\n' +
      '    return \'nodetpl_g_\' + this._generate();\n' +
      '  };\n' +
      '  NodeTpl.prototype.escapeHtml = function(html) {\n' +
      '    return html ? html.toString().replace(/&/g, \'&amp;\').replace(/</g, \'&lt;\').replace(/>/g, \'&gt;\').replace(/"/g, \'&quot;\').replace(/\'/g, \'&#39;\') : html;\n' +
      '  };\n' +
      '  NodeTpl.prototype.render = function(data, guid) {\n' +
      '    return this.tpls.main(data, guid || this.guid());\n' +
      '  };\n' +
      '  return {\n' +
      '    render: function(data) {\n' +
      '      return new NodeTpl().render(data);\n' +
      '    }\n' +
      '  };\n' +
      '}));\n';
    return output;
  };

  /**
   * ie split bug fixer
   * @method _split
   * @param  {String} str       input string
   * @param  {String | RegExp}  separator spliter
   * @param  {Number} limit     limit
   * @return {Array}            result
   */
  NodeTpl.prototype._split = function(str, separator, limit) {
    // see: http://blog.stevenlevithan.com/archives/cross-browser-split
    if (Object.prototype.toString.call(separator) !== '[object RegExp]') {
      return str.split(separator, limit);
    }
    var output = [],
      lastLastIndex = 0,
      flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.sticky ? 'y' : ''),
      _compliantExecNpcg = /()??/.exec('')[1] === undefined,
      separator2, match, lastIndex, lastLength;
    separator = new RegExp(separator.source, flags + 'g');
    str = str + '';
    if (!_compliantExecNpcg) separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
    if (limit === undefined || +limit < 0) {
      limit = Infinity;
    } else {
      limit = Math.floor(+limit);
      if (!limit) return [];
    }
    while (match = separator.exec(str), match) {
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        if (!_compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
        }
        if (match.length > 1 && match.index < str.length) Array.prototype.push.apply(output, match.slice(1));
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) break;
      }
      if (separator.lastIndex === match.index) separator.lastIndex++;
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test('')) output.push('');
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  /**
   * resort the content of template
   * @method _fetch
   * @param  {String} html template content
   * @return {Object}      an object resorted
   */
  NodeTpl.prototype._fetch = function(html) {
    var cache = {};
    var jsExp = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/igm;
    var cssExp = /<style\b[^>]*>([^<]*(?:(?!<\/style>)<[^<]*)*)<\/style>/igm;
    var getTemplate = function(html) {
      var list = {};
      var regExp = /<template(?:.*name=['"]([^'"]+)*)?\b[^>]*>([^<]*(?:(?!<\/template>)<[^<]*)*)<\/template>/igm;
      var temp = html.replace(regExp, function(all, name, code) {
        if (name) {
          list[name] = code;
        }
        return '';
      });
      if (list.main) {
        cache.__libs = temp.trim();
      } else {
        list.main = html;
      }
      return list;
    };
    html = html.replace(/<!--[\w\W\r\n]*?-->/g, ''); // annotation
    var list = getTemplate(html);
    for (var tplname in list) {
      if (!Object.prototype.hasOwnProperty.call(list, tplname)) {
        continue;
      }
      var cssCode = '';
      var jsCode = '';
      var htmlCode = list[tplname];
      if (!htmlCode) {
        continue;
      }
      if (this.options.library !== 'node') {
        htmlCode = htmlCode.replace(cssExp, function(all, code) {
          cssCode += '\n' + code;
          return '';
        }).replace(jsExp, function(all, code) {
          jsCode += '\n' + code;
          return '';
        });
      }
      cache[tplname] = {
        css: this._css(cssCode.trim(), tplname),
        html: this._html(htmlCode.trim(), tplname),
        js: this._js(jsCode.trim(), tplname)
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
      var sguid;
      var idname = '####SGUID####';
      var idnameexpt = new RegExp(idname, 'g');
      var rootexp = new RegExp('\\\$ROOT', 'g');
      if (tplname === 'main') {
        sguid = 'guid';
      } else {
        sguid = 'guid + duid';
      }
      content = content
        .replace(/\/\*(.|\n)*?\*\/|\r?\n/ig, '')
        .replace(/(^|\}|\s+)([a-zA-Z0-9_\-#*\.:\s,\(\)'"<>=\$@]*)(\{)/g, function(all, $1, $2, $3) {
          if($2 === '' || /^\s*[0-9@\-]/.test($2)) {
            return all;
          } else if (rootexp.test($2)) {
            $2 = $2.replace(rootexp, '');
            return $1 + idname + $2 + $3;
          } else {
            return $1 + idname + ' ' + $2 + $3;
          }
        }).replace(/\r?\n/g, '').replace(/'/g, '\\\'').replace(idnameexpt, '#\' + ' + sguid + ' + \'');
      return content;
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
    if (content) {
      var jsarr = this._split(content, /\r?\n/g);
      for (var i = 0; i < jsarr.length; i++) {
        if (!jsarr[i]) continue;
        jsarr[i] = jsarr[i].replace(/(^|[^\.])include\(([^\)]*)\)/ig, function(a, b, c) {
          var _c = (c || '').split(',').map(function(v) {
            return v.trim();
          });
          return b + '$TPLS[' + _c[0] + '](' + (_c.length > 1 ? _c[1] : '$DATA') + ', guid)';
        });
      }
      content = jsarr.join('\n');
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
    if (content) {
      var getTag = function(tag) {
        return tag.replace(/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|])/g, '\\$1');
      };
      var openTag = getTag(this.options.openTag);
      var closeTag = getTag(this.options.closeTag);
      var html;
      html = this._split(content, new RegExp('(' + openTag + '[\\s\\S]*?' + closeTag + ')'));
      for (var i = 0; i < html.length; i++) {
        if (!html[i]) continue;
        var tagExp = new RegExp(openTag + '([\\s\\S]*?)' + closeTag, 'igm');
        if (tagExp.test(html[i])) {
          html[i] = html[i].replace(tagExp, '$1');
          html[i] = this.options.map(html[i]); // use user map rules
          html[i] = html[i].replace(/@([a-zA-Z\$_]+)/igm, '$DATA.$1');
          html[i] = html[i].replace(/echo\s+(.*?);/igm, '    _ += $1 || \'\';\n');
          if (html[i].indexOf('=') === 0) {
            var eqhtml, safeeq = true;
            // undefined or not
            html[i] = html[i].substring(1).trim();
            if (html[i].indexOf('=') === 0) {
              // safeeq, safe html
              safeeq = false;
              html[i] = html[i].substring(1).trim();
            }
            eqhtml = safeeq ? '$NODETPL.escapeHtml(' + html[i] + ')' : '(' + html[i] + ')';
            html[i] = '    _eqstring = ' + eqhtml + ';\n' +
              '    if (typeof _eqstring === \'undefined\') {\n' +
              '      _ += \'\';\n' +
              '    } else {\n' +
              '      _ += _eqstring;\n' +
              '    }\n';
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
      content = content.replace(/\$SUBROOT/igm, '\'+ guid + duid +\'');
    }
    if (this.options.strict) {
      content = 'try {\nvar _eqstring;\n' + content.trim() + '\n} catch(e){ console.log(e, e.stack); }\n';
    } else {
      content = 'try {\nvar _eqstring;\nwith($DATA) {\n' + content.trim() + '\n}\n} catch(e){ console.log(e, e.stack); }\n';
    }
    return content;
  };

  /**
   * Compile a template
   * @method compile
   * @param  {String} html  template html
   * @return {String}       content compiled
   */
  NodeTpl.prototype.compile = function(html) {
    var result;
    html = this.options.beforeCompile(html);
    result = this._compile(this._fetch(html));
    result = this.options.afterCompile(result);
    return result;
  };

  /**
   * compile template
   * @method _compile
   * @param  {Object}   cache template object
   * @return {String}         string compiled
   */
  NodeTpl.prototype._compile = function(cache) {
    var html = '',
      tpls = [],
      scripts = [],
      libs;
    for (var i in cache) {
      var temp;
      if (!Object.prototype.hasOwnProperty.call(cache, i) || i === '__libs') {
        continue;
      }
      temp = '';
      temp += '  "' + i + '": function($DATA, guid){\n';
      temp += '    var _ = \'\';\n';
      temp += '    var duid = $NODETPL.duid();\n';
      temp += '    guid = guid || $NODETPL.guid();\n';
      if (cache[i].css) {
        temp += '    _ += \'<style>' + cache[i].css + '</style>\';\n';
      }
      if (cache[i].html) {
        temp += cache[i].html;
      }
      temp += '    if($DATA){\n';
      temp += '     $NODETPL.datas[duid] = $DATA;\n';
      temp += '    }\n';
      if (cache[i].js) {
        temp += '    (function(scripts){\n';
        temp += '      var cache = typeof window !== \'undefined\' ? window : typeof global !== \'undefined\' ? global : {};\n';
        temp += '      cache._nodetpl_ = cache._nodetpl_ || {};\n';
        temp += '      cache._nodetpl_[guid + \'-\'+ duid] = scripts[\'' + i + '\'];\n';
        temp += '    })($NODETPL.scripts);\n';
        temp += '    _ += \'<script>\\n\';\n';
        temp += '    _ += \'(function(){\\n\';\n';
        temp += '    _ += \'  var cache = typeof window !== \\\'undefined\\\' ? window : typeof global !== \\\'undefined\\\' ? global : {};\\n\';\n';
        temp += '    _ += \'  cache._nodetpl_[\\\'\' + guid + \'-\' + duid + \'\\\'](\\\'\' + guid + \'\\\', \\\'\' + duid + \'\\\');\\n\';\n';
        temp += '    _ += \'  delete cache._nodetpl_[\\\'\' + guid + \'-\' + duid + \'\\\'];\\n\';\n';
        temp += '    _ += \'})();\\n\';\n';
        temp += '    _ += \'</script>\\n\';\n';
      }
      temp += '    return _;\n';
      temp += '  }';
      tpls.push(temp);
      if (cache[i].js) {
        temp = '';
        temp += '  "' + i + '": function(guid, duid){\n';
        temp += 'var ROOT = document.getElementById(guid);\n';
        temp += 'var SUBROOT = document.getElementById(guid + duid);\n';
        temp += 'var $TPLS = $NODETPL.tpls;\n';
        temp += 'var $DATA = $NODETPL.datas[duid];\n';
        temp += cache[i].js;
        temp += '  }';
        scripts.push(temp);
      }
    }
    libs = cache.__libs || '';
    html = this._template(tpls, scripts, libs);
    return html;
  };

  /**
   * render html template by data
   * @method render
   * @param  {string} html template html
   * @param  {object} data input data
   */
  NodeTpl.prototype.render = function(html, data, callback) {
    if (typeof data === 'function') {
      callback = data;
      data = {};
    }
    // jshint ignore: start
    var result = 'return ' + this.compile(html);
    new Function('iife', 'callback', result)(true, function(tpl) {
      callback && (data === false ? callback(tpl) : callback(tpl.render(data)));
    });
    // jshint ignore: end
  };

  /**
   * get js current script url when loading
   * @method getCurrentScript
   * @return {string}         script url
   */
  NodeTpl.prototype.getCurrentScript = function() {
    if (typeof document === 'undefined') {
      return '';
    }
    if (document.currentScript) {
      return document.currentScript.src;
    }
    var stack;
    try {
      a.b.c(); // jshint ignore: line
    } catch (e) {
      stack = e.stack;
      if (!stack && window.opera) {
        stack = (String(e).match(/of linked script \S+/g) || []).join(' ');
      }
    }
    if (stack) {
      stack = stack.replace(/(at Global code \([^\)]+\))[\s\S]*/i, '$1');
      stack = stack.split(/[@ ]/g).pop();
      stack = stack[0] === '(' ? stack.slice(1, -1) : stack;
      return stack.replace(/(:\d+)?:\d+\s*$/i, '');
    }
    var nodes = document.getElementsByTagName('script');
    for (var i = 0, node; node = nodes[i++], node;) {
      if (node.readyState === 'interactive') {
        return node.className = node.src, node.className;
      }
    }
  };

  /**
   * load a url
   * @method _load
   * @param  {string}   url      url
   * @param  {function} callback callback function
   */
  NodeTpl.prototype._load = function(url, callback) {
    var that = this,
      s = document.getElementsByTagName('script')[0],
      ele = document.createElement('script');
    ele.type = 'text/javascript';
    if (ele.readyState) {
      ele.onreadystatechange = function() {
        if (this.readyState === 'loaded' || this.readyState === 'complete') {
          this.onreadystatechange = null;
          callback && callback.call(that);
        }
      };
    } else {
      ele.onload = function() {
        callback && callback.call(that);
      };
    }
    ele.src = url;
    s.parentNode.insertBefore(ele, s);
    return this;
  };

  /**
   * ajax
   * @method _ajax
   * @param  {string}   url      url
   * @param  {function} callback callback
   */
  NodeTpl.prototype._ajax = function(url, callback) {
    var xmlHttp;
    var options = {
      url: url,
      type: 'get',
      async: true,
      data: '',
      success: callback
    };
    try {
      xmlHttp = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP'); // jshint ignore: line
      } catch (e) {
        try {
          xmlHttp = new ActiveXObject('Microsoft.XMLHTTP'); // jshint ignore: line
        } catch (e) {
          return false;
        }
      }
    }
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        options.success.call(xmlHttp, xmlHttp.responseText);
      }
    };
    xmlHttp.open(options.type, options.url, options.async);
    xmlHttp.send(options.data);
    return this;
  };

  /**
   * get a template file or js file
   * @method get
   * @param  {string}   url      url
   * @param  {object}   data     input data
   * @param  {function} callback callback
   */
  NodeTpl.prototype.get = function(url, data, callback) {
    var that = this;
    var compiled = false;
    var a = document.createElement('a');
    if (!/^(http|\/{2})/.test(url)) {
      url = that.options.base + url;
    }
    a.href = url;
    url = a.href;
    if (typeof data === 'function') {
      callback = data;
      data = {};
    }
    url = url.replace(/([^\?#]+)/, function(all, $1) {
      if (!/(\.[a-zA-Z\d]{2,4}|\/)$/.test($1)) {
        $1 = $1 + '.js';
      }
      if (/\.js$/.test($1)) {
        compiled = true;
      }
      return $1;
    });
    if (compiled) {
      var fn = function(cache) {
        var obj;
        that.cache[url] = that.cache[url] || cache;
        obj = that.cache[url];
        typeof callback === 'function' && obj && callback(data === false ? obj : obj.render(data));
      };
      if (that.cache[url]) {
        fn();
      } else {
        if (typeof define === 'function') {
          if (define.amd) {
            require([url], fn);
          } else if (define.cmd && typeof seajs === 'object') {
            seajs.use([url], fn); // jshint ignore: line
          } else {
            throw new Error('[nodetpl] cannot guess what the define means.');
          }
        } else {
          that._load(url, fn);
        }
      }
    } else {
      that._ajax(url, function(html) {
        typeof callback === 'function' && that.render(html, data, callback);
      });
    }
  };

  /**
   * exec script code in content
   * @method exec
   * @param  {String} content  html content
   */
  NodeTpl.prototype.exec = function(content) {
    var code, jsExp = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/igm;
    while (code = jsExp.exec(content), code) {
      (new Function(code[1]))(); // jshint ignore: line
    }
    return this;
  };

  return new NodeTpl();
}));