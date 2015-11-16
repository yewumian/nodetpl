// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function(root, factory) {
  'use strict';
  /* global define, exports, module */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('NodeTpl', [], factory);
  } else if (typeof define === 'function' && define.cmd) {
    // CMD.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.NodeTpl = root.nodetpl = factory();
  }
}(this, function(require, exports, module) {
  // String.prototype.trim
  if (!String.prototype.trim) String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }

  function NodeTpl() {
    this.version = '2.0.3';
    this.ie6 = window.VBArray && !window.XMLHttpRequest;
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
    this.options = {
      base: '',
      vars: {
        'root': '$("#~")' // like jQuery
      },
      openTag: '<?',
      closeTag: '?>'
    };
    return this;
  }

  NodeTpl.prototype.config = function(options) {
    if (options) {
      this.extend(this.options, options);
      return this;
    } else {
      return this.options;
    }
  };

  NodeTpl.prototype.extend = function() {
    var that = this,
      options, name, src, copy, copyIsArray, clone,
      target = arguments[0],
      i = 1,
      length = arguments.length,
      deep = false;
    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;

    var isArray = function isArray(arr) {
      if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
      }

      return toStr.call(arr) === '[object Array]';
    };
    var isPlainObject = function isPlainObject(obj) {
      if (!obj || toStr.call(obj) !== '[object Object]') {
        return false;
      }

      var hasOwnConstructor = hasOwn.call(obj, 'constructor');
      var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
      // Not own constructor property must be Object
      if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
      }

      // Own properties are enumerated firstly, so to speed up,
      // if last one is own, then all properties are own.
      var key;
      for (key in obj) { /**/ }

      return typeof key === 'undefined' || hasOwn.call(obj, key);
    };
    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    } else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
      target = {};
    }
    for (; i < length; ++i) {
      options = arguments[i];
      // Only deal with non-null/undefined values
      if (options != null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];
          // Prevent never-ending loop
          if (target !== copy) {
            // Recurse if we're merging plain objects or arrays
            if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && isArray(src) ? src : [];
              } else {
                clone = src && isPlainObject(src) ? src : {};
              }
              // Never move original objects, clone them
              target[name] = that.extend(deep, clone, copy);
              // Don't bring in undefined values
            } else if (typeof copy !== 'undefined') {
              target[name] = copy;
            }
          }
        }
      }
    }
    // Return the modified object
    return target;
  };

  /**
   * ie split bug
   * @method _split
   * @param  {String} str       input string
   * @param  {String | RegExp}  separator spliter
   * @param  {Number} limit     limit
   * @return {Array}            result
   */
  NodeTpl.prototype._split = function(str, separator, limit) {
    // Compatible with browser
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return str.split(separator, limit);
    }
    var output = [],
      lastLastIndex = 0,
      flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.sticky ? 'y' : ''),
      separator = RegExp(separator.source, flags + "g"),
      _compliantExecNpcg = /()??/.exec("")[1] === undefined,
      separator2, match, lastIndex, lastLength;
    str = str + '';
    if (!_compliantExecNpcg) separator2 = RegExp('^' + separator.source + '$(?!\\s)', flags);
    if (limit === undefined || +limit < 0) {
      limit = Infinity;
    } else {
      limit = Math.floor(+limit);
      if (!limit) return [];
    }
    while (match = separator.exec(str)) {
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
   * It will be droped in the future
   * @method _fixcss
   * @param  {String} css css
   */
  NodeTpl.prototype._fixcss = function(css) {
    var style = document.getElementById('nodetpl_css');
    if (!style) {
      style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.setAttribute('id', 'nodetpl_css');
      document.getElementsByTagName('head')[0].appendChild(style);
    }
    if (style.styleSheet) {
      style.styleSheet.cssText += css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  };
  /**
   * fix ie6 css bug
   * @method css
   * @param  {String} css css code
   * @return {String}     css code
   */
  NodeTpl.prototype.css = function(css) {
    if (!css) {
      return '';
    }
    if (this.ie6) {
      // ie6 supported max css count is 31, here combo the css.
      var style = document.getElementById('nodetpl_css');
      if (!style) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('id', 'nodetpl_css');
        document.getElementsByTagName('head')[0].appendChild(style);
      }
      if (style.styleSheet) {
        style.styleSheet.cssText += css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      return '';
    } else {
      return '<style>' + css + '</style>\n';
    }
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
      result, path;
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
      path = Math.random().toString();
      result = this.compile(path, html);
      (new Function(result))();
      that._cache[path] = {
        html: html,
        result: result
      };
    }
    if (typeof this._tpls[path] === 'object' && typeof this._tpls[path].main === 'function') {
      result = this._tpls[path].main(data);
      typeof callback === 'function' && callback.call(this, result);
      return result;
    } else {
      return null;
    }
  };
  // todo
  NodeTpl.prototype.update = function() {
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

  NodeTpl.prototype._load = function(url, callback) {
    var that = this,
      d = document.createElement('script');
    d.type = 'text/javascript';
    if (d.readyState) {
      d.onreadystatechange = function() {
        if (that.ie6 && !this.getAttribute('initialized')) {
          document.getElementsByTagName('head')[0].appendChild(d);
          this.setAttribute('initialized', true);
        }
        if (this.readyState == 'loaded' || this.readyState == 'complete') {
          this.onreadystatechange = null;
          callback && callback.call(that);
        }
      };
      d.src = url;
      !this.ie6 && document.getElementsByTagName('head')[0].appendChild(d);
    } else {
      d.src = url;
      d.onload = function() {
        callback && callback.call(that);
      };
      document.getElementsByTagName('head')[0].appendChild(d);
    }
    return this;
  };
  /**
   * get template data by url
   * @method get
   * @param  {String}   url      url
   * @param  {Object}   data     data
   * @param  {Function} callback callback
   * @return {Null}              null
   */
  NodeTpl.prototype.get = function(url, data, callback) {
    var that = this,
      path,
      cache = that._tpls,
      store,
      doCallback;
    url = url.trim();
    if (!/^(https?:|\/{2})/.test(url)) {
      url = that.options.base + url;
    }
    if (!/\.js$/.test(url)) {
      url = url + '.js';
    }
    if (require && require.async) {
      require.async(url, function(init) {
        init(that);
        callback(that._tpls[url].main(data));
      });
      return this;
    }
    path = url.replace(/^((https?:)?\/{2}[^\/]+)/, '');
    if (!path) {
      return false;
    }
    store = cache[url] || cache[path];
    if (typeof data === 'function') {
      callback = data;
      data = {};
    }
    doCallback = function() {
      if (typeof callback === 'function') {
        if (data === false) {
          // when data is false, the render is delayed, call d.render(_data) manually.
          callback.call(that, {
            render: function(_data) {
              return store.main(_data || {});
            }
          });
        } else {
          callback.call(that, store.main(data));
        }
      }
    };
    if (typeof store === 'object' && typeof store.main === 'function') {
      doCallback();
    } else {
      that._load(url, function() {
        store = cache[url] || cache[path];
        //path = path.replace(/(http:\/\/)i\.s/, '$1s').replace(/(http:\/\/[^\.]+)\.ipc/, '$1.pc');
        if (typeof store === 'object' && typeof store.main === 'function') {
          doCallback();
        }
      });
    }
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
            return b + '$TPLS[' + _c[0] + '](' + (_c.length > 1 ? _c[1] : '$DATA') + ', "\'+ guid +\'")';
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
      html, tagExp, openTag, closeTag, getTag;
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
            html[i] = '    _ += ((' + html[i].substring(1) + ') == null ? \'\' : (' + html[i].substring(1) + '));';
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
        temp += "    _ += '  var ROOT, $ROOT, SUBROOT, $SUBROOT, $TPLS, $DATA;\\n';\n";
        temp += "    _ += '  ROOT = document.getElementById(\"\'+ guid +\'\");\\n';\n";
        temp += "    _ += '  SUBROOT = document.getElementById(\"\'+ guid + dguid +\'\");\\n';\n";
        temp += "    _ += '  $TPLS = NodeTpl._tpls[\"\'+ PATH +\'\"];\\n';\n";
        temp += "    _ += '  $DATA = NodeTpl._data[\"\'+ dguid +\'\"];\\n';\n";
        temp += "    _ += '  try{\\n';\n";
        temp += "    _ += '    $ROOT = '+ N.options.vars.root.replace(/~/, guid) + ';\\n';\n";
        temp += "    _ += '    $SUBROOT = '+ N.options.vars.root.replace(/~/, guid + dguid) + ';\\n';\n";
        temp += "    _ += '  } catch(e) { }\\n';\n";
        temp += cache[i].js;
        temp += "    _ += '})(window, document);\\n';\n";
        temp += "    _ += 'delete NodeTpl._data[\"\'+ dguid +\'\"];\\n';\n";
        temp += "    _ += '</script>\\n';\n";
      }
      temp += '    $DATA && (N._data[dguid] = $DATA);\n';
      temp += "    return _;\n";
      temp += '  }';
      list.push(temp);
    }
    html += "(function(root, factory) {\n";
    html += " if (typeof define === 'function' && (define.amd || define.cmd)) {\n";
    html += "   define(factory);\n";
    html += " } else if (typeof exports === 'object') {\n";
    html += "   module.exports = factory();\n";
    html += " } else {\n";
    html += "   factory()(window.NodeTpl);\n";
    html += " }\n";
    html += "}(this, function() {\n";
    html += "return function(N, undefined){\n";
    html += "  var PATH = '" + path + "';\n";
    html += "  if(!N || !N._tpls) return false;\n";
    html += "  N._tpls[PATH] = N._tpls[PATH] ||\n{\n";
    html += list.join(',\n');
    html += '\n};';
    html += "\n};\n";
    html += "}));";
    return html;
  };
  return new NodeTpl();
}));