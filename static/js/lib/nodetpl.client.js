/*!
 * nodetpl v3.3.2
 * Best javascript template engine
 * https://www.nodetpl.com
 *
 * Copyright 2012-2015 pillys@163.com
 * Released under the MIT license
 */

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function(root, factory) {
  'use strict';
  /* global define, exports, module */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
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
    root.nodetpl = factory();
  }
}(this, function(require, exports, module) {

  var nodetpl;

  // String.prototype.trim
  if (!String.prototype.trim) String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }

  function NodeTpl() {
    this.version = '3.3.2';
    this.ie6 = window.VBArray && !window.XMLHttpRequest;
    this.guid = function() {
      return 'NTGUID__' + (this.guid._counter++).toString(36);
    };
    this.duid = function() {
      return 'NTDUID__' + (this.duid._counter++).toString(36);
    };
    this.guid._counter = 1;
    this.duid._counter = 1;
    this._data = {};
    this._tpls = {};
    this._cache = {};
    this._docid = '_tpl_';
    this.options = {
      base: '',
      openTag: '<?',
      closeTag: '?>'
    };
    return this;
  }

  NodeTpl.prototype.config = function(options) {
    if (options) {
      this._extend(this.options, options);
      return this;
    } else {
      return this.options;
    }
  };

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
   * 获取文档当前URL
   * @method _getCurrentScript
   * @return {[type]}          [description]
   */
  NodeTpl.prototype._getCurrentScript = function() {
    var doc = document,
      head, nodes;
    //取得正在解析的script节点
    if (doc.currentScript) { //firefox 4+
      return doc.currentScript.src;
    }
    // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
    var stack;
    try {
      a.b.c(); //强制报错,以便捕获e.stack
    } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
      stack = e.stack;
      if (!stack && window.opera) {
        //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
        stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
      }
    }
    if (stack) {
      /**e.stack最后一行在所有支持的浏览器大致如下:
       *chrome23:
       * at http://113.93.50.63/data.js:4:1
       *firefox17:
       *@http://113.93.50.63/query.js:4
       *opera12:
       *@http://113.93.50.63/data.js:4
       *IE10:
       *  at Global code (http://113.93.50.63/data.js:4:1)
       */
      stack = stack.replace(/(at Global code \([^\)]+\))[\s\S]*/i, '$1');
      stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
      stack = stack[0] == "(" ? stack.slice(1, -1) : stack;
      return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
    }
    head = doc.head || doc.getElementsByTagName('head')[0];
    nodes = head.getElementsByTagName("script"); //只在head标签中寻找
    for (var i = 0, node; node = nodes[i++];) {
      if (node.readyState === "interactive") {
        return node.className = node.src;
      }
    }
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
    var path, result;
    if (typeof html !== 'string') {
      throw new TypeError();
    }
    path = this._docid + Math.random().toString();
    if (typeof window !== 'undefined') {
      (new Function(this.compile(path, html)))();
    } else {
      var context = new vm.createContext({
        console: console,
        require: require,
        exports: {},
        module: {
          uri: path
        }
      });
      new vm.Script(that.compile(filepath, content)).runInContext(context);
    }
    return this._getJs(path, data, callback);
  };
  /**
   * exec script code in content
   * @method exec
   * @param  {String} content  html content
   */
  NodeTpl.prototype.exec = function(content) {
    var code, jsExp = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/igm;
    while (code = jsExp.exec(content)) {
      (new Function(code[1]))();
    }
    return this;
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
   * get a template file
   * @method _ajax
   * @param  {Object} options ajax options
   * @return {this}
   */
  NodeTpl.prototype._ajax = function(options) {
    var xmlHttp;
    options = this._extend({
      type: 'get',
      async: true,
      data: '',
      success: function(data) {}
    }, options);
    try {
      xmlHttp = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
        try {
          xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
          return false;
        }
      }
    }
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        options.success.call(xmlHttp, xmlHttp.responseText);
      }
    };
    xmlHttp.open(options.type, options.url, options.async);
    xmlHttp.send(options.data);
    return this;
  };
  /**
   * get template compiled data or template code by url
   * @method get
   * @param  {String}   url      url
   * @param  {Object}   data     data
   * @param  {Function} callback callback
   * @return {Null}              null
   */
  NodeTpl.prototype.get = function(url, data, callback) {
    var that = this;
    if (/\/[^\/\.]+$|\.js$/.test(url.replace(/(\?#).*$/, ''))) {
      // 编译后的 js 文件
      that._getJs(url, data, callback);
    } else {
      // 模板源文件，暂缓渲染
      if (typeof data === 'function') {
        callback = data;
        data = null;
      }
      that._ajax({
        url: url,
        type: 'get',
        success: function(content) {
          that.render(content, data, callback);
        }
      });
    }
  };

  NodeTpl.prototype._getUrl = function(url) {
    url = url.trim();
    if (url.indexOf(this._docid) !== 0) {
      if (typeof location !== 'undefined') {
        if (!/^(https?:|\/{2})/.test(url)) {
          url = this.options.base + url;
        }
        if (/^\/[^\/]/.test(url)) {
          url = '//' + location.host + url;
        }
        if (/^\/{2}/.test(url)) {
          url = location.protocol + url;
        }
        if (!/\.js$/.test(url)) {
          url = url + '.js';
        }
      }
    }
    return url;
  };
  /**
   * get template data by js url
   * @method get
   * @param  {String}   url      url
   * @param  {Object}   data     data
   * @param  {Function} callback callback
   * @return {Null}              null
   */
  NodeTpl.prototype._getJs = function(url, data, callback) {
    var that = this,
      delayData,
      normalCallback,
      moduleCallback,
      _cache = that._cache,
      _tpls = that._tpls,
      _data = that._data;
    url = that._getUrl(url);
    if (data === false) {
      delayData = {
        render: function(_data) {
          return _tpls[url].main(_data || {});
        },
        toString: function() {
          return _cache[url] ? _cache[url].html : this;
        }
      };
    }
    if (typeof data === 'function') {
      callback = data;
      data = {};
    }
    moduleCallback = function(template) {
      if (typeof callback !== 'function') return false;
      if (data === false) {
        callback.call(that, delayData);
      } else {
        callback(template.main(data));
      }
    };
    normalCallback = function() {
      if (typeof callback !== 'function') return false;
      if (data === false) {
        // when data is false, the render is delayed, call d.render(_data) manually.
        callback.call(that, delayData);
      } else {
        callback.call(that, _tpls[url].main(data));
      }
    };
    if (typeof define === 'function') {
      if (define.amd && typeof require === 'function') {
        // requireJs module loader
        require([url], moduleCallback);
      } else if (define.cmd && typeof seajs === 'object') {
        // seaJs module loader
        seajs.use([url], moduleCallback);
      }
    } else {
      if (url.indexOf(that._docid) === 0 || typeof _tpls[url] === 'object' && typeof _tpls[url].main === 'function') {
        normalCallback();
      } else {
        that._load(url, function() {
          if (typeof _tpls[url] === 'object' && typeof _tpls[url].main === 'function') {
            normalCallback();
          }
        });
      }
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
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      jsExp = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/igm,
      cssExp = /<style\b[^>]*>([^<]*(?:(?!<\/style>)<[^<]*)*)<\/style>/igm;
    list = this._template(html);
    for (var tplname in list) {
      if (!hasOwnProperty.call(list, tplname)) {
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
      content = content
        .replace(/'/g, '\\\'')
        .replace(/\/\*(.|\n)*?\*\/|\r?\n/ig, '')
        .replace(/([a-zA-Z0-9_\-#*\.:\s,\(\)'"<>=]*)(\{)/ig, function(a, b, c) {
          var sguid;
          if (tplname === 'main') {
            sguid = 'guid';
          } else {
            sguid = 'guid + duid';
          }
          b = b.trim();
          if (b === '') {
            return '#\' + ' + sguid + ' + \'' + c;
          } else {
            var _b = b.split(',');
            for (var i = 0; i < _b.length; i++) {
              _b[i] = _b[i].trim();
              _b[i] = '\\n#\' + ' + sguid + ' + \'' + (_b[i].indexOf(':') === 0 ? '' : ' ') + _b[i];
            }
            return _b.join(',') + c;
          }
        });
      if (content !== '') {
        content = '    css += \'' + content + '\';';
      }
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
      content = content.replace(/\$SUBROOT/igm, '\'+ guid + duid +\'');
    }
    content = 'try{\n' +
      'with($DATA || {}){\n' + content + '\n}' +
      '} catch(e){ console.log(e.stack); }\n';
    return content;
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
   * compile template using path
   * @method _compile
   * @param  {[String]} path  template path
   * @param  {Object}   cache template object
   * @return {String}         string compiled
   */
  NodeTpl.prototype._compile = function(path, cache) {
    var temp, html = '',
      list = [],
      hasOwnProperty = Object.prototype.hasOwnProperty;
    for (var i in cache) {
      if (!hasOwnProperty.call(cache, i)) {
        continue;
      }
      temp = '';
      temp += '  "' + i + '": function($DATA, guid){\n';
      temp += "    var _ = '';\n";
      temp += "    var css = '';\n";
      temp += "    var duid = nodetpl.duid();\n";
      temp += "    guid = guid || nodetpl.guid();\n";
      if (cache[i].css) {
        temp += cache[i].css + "\n";
        temp += "    _ += nodetpl.css(css);";
      }
      if (cache[i].html) {
        temp += cache[i].html;
      }
      if (cache[i].js) {
        temp += "    _ += '\\n<script>\\n';\n";
        temp += "    _ += '(function(window, document, undefined){\\n';\n";
        temp += "    _ += '  var _module_id = Math.random().toString();\\n';\n";
        temp += "    _ += '  var _factory = function(require, exports, module){\\n';\n";
        temp += "    _ += '    var nodetpl = typeof require === \\'function\\' ? require(\\'nodetpl\\') : window.nodetpl;\\n';\n";
        temp += "    _ += '    var ROOT, $ROOT, SUBROOT, $SUBROOT, $TPLS, $DATA;\\n';\n";
        temp += "    _ += '    var guid = \\''+ guid + '\\', duid = \\''+ duid + '\\';\\n';\n";
        temp += "    _ += '    ROOT = document.getElementById(guid);\\n';\n";
        temp += "    _ += '    SUBROOT = document.getElementById(guid + duid);\\n';\n";
        temp += "    _ += '    $TPLS = nodetpl._tpls[\"\'+ tpl_id +\'\"];\\n';\n";
        temp += "    _ += '    $DATA = nodetpl._data[duid];\\n';\n";
        temp += cache[i].js;
        temp += "    _ += '  }\\n';\n";
        temp += "    _ += '  if(typeof define === \\'function\\'){\\n';\n";
        temp += "    _ += '    define(_module_id, _factory);\\n';\n";
        temp += "    _ += '    if (define.amd && typeof require === \\'function\\') {\\n';\n";
        temp += "    _ += '      require([_module_id]);\\n';\n";
        temp += "    _ += '    } else if (define.cmd && typeof seajs === \\'object\\') {\\n';\n";
        temp += "    _ += '      seajs.use([_module_id]);\\n';\n";
        temp += "    _ += '    }\\n';\n";
        temp += "    _ += '  } else {\\n';\n";
        temp += "    _ += '    _factory();\\n';\n";
        temp += "    _ += '  }\\n';\n";
        temp += "    _ += '})(window, document);';\n";
        temp += "    _ += '</script>\\n';\n";
      }
      temp += "    $DATA && (nodetpl._data[duid] = $DATA);\n";
      temp += "    return _;\n";
      temp += "  }";
      list.push(temp);
    }

    html += "(function(root, factory) {\n";
    html += " if (typeof define === 'function') {\n";
    if (path.indexOf(this._docid) === 0) {
      // 非预编译模板，需要传递一个 id 给模块
      html += "   define('" + path + "', factory);\n";
    } else {
      // 预编译模板，无需传递 id
      html += "   define(factory);\n";
    }
    html += " } else if (typeof require === 'function' && typeof exports === 'object') {\n";
    html += "   factory(require, exports, module);\n";
    html += " } else {\n";
    html += "   factory();\n";
    html += " }\n";
    html += "}(this, function(require, exports, module) {\n";
    html += "  var nodetpl = typeof require === 'function' ? require('nodetpl') : window.nodetpl;\n";
    if (path.indexOf(this._docid) === 0) {
      html += "  var tpl_id = '" + path + "';\n";
    } else {
      html += "  var tpl_id = module && module.uri ? module.uri : nodetpl._getCurrentScript();\n";
    }
    html += "  nodetpl._tpls[tpl_id] = {\n";
    html += list.join(',\n');
    html += "\n};\n";
    html += "  return nodetpl._tpls[tpl_id];\n";
    html += "}));";
    return html;
  };

  nodetpl = new NodeTpl();
  return nodetpl;
}));