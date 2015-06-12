var fs = require('fs');
var renderTools = {
  trim: function (str) {
    // Compatible with browser
    return str.trim();
  },
  split: function (str, separator, limit) {
    // Compatible with browser
    return str.split(separator, limit);
  },
  precompile: function (tpl) {
    if (!tpl) return false;
    var tplTemp, tplList = {},
      compileList = {};
    var tplExp = /<template(.*name=['"]([^'"]+)*)?\b[^>]*>([^<]*(?:(?!<\/template>)<[^<]*)*)<\/template>/igm;
    while (tplTemp = tplExp.exec(tpl)) tplTemp[2] && (tplList[tplTemp[2]] = tplTemp[3]);
    tplList["main"] = tplList["main"] || tpl;
    this.compile(tplList, compileList);
    return compileList;
  },
  compile: function (tplList, compileList) {
    var that = this;
    if (typeof tplList !== 'object') return false;
    for (var tplname in tplList) {
      var html = tplList[tplname];
      if (!html) continue;
      var jsExp = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/igm,
        cssExp = /<style\b[^>]*>([^<]*(?:(?!<\/style>)<[^<]*)*)<\/style>/igm;
      var jsTemp, cssTemp, jscode = '',
        csscode = '';
      html = html.replace(cssExp, function ($, $1) {
          csscode += "\r\n" + $1;
          return "";
        })
        .replace(jsExp, function ($, $1) {
          jscode += "\r\n" + $1;
          return "";
        });
      /*while(jsTemp = jsExp.exec(html)) jscode += "\r\n"+ jsTemp[1];
      while(cssTemp = cssExp.exec(html)) csscode += "\r\n"+ cssTemp[1];
      html = html.replace(cssExp, "").replace(jsExp, "");*/
      jscode = that.trim(jscode);
      csscode = that.trim(csscode);
      html = that.trim(html);
      // compile css
      if (csscode) {
        csscode = csscode.replace(/'/g, '\\\'');
        csscode = '    css += \'' +
          csscode
          .replace(/\/\*(.|\n)*?\*\//ig, '')
          .replace(/\r?\n/ig, '')
          .replace(/([a-zA-Z0-9_\-#*\.:\s,\(\)'"<>=]*)(\{)/ig, function (a, b, c) {
            b = that.trim(b);
            if (b === '') {
              return '#\' + guid + \'' + c;
            } else {
              var _b = b.split(',');
              for (var i = 0; i < _b.length; i++) {
                _b[i] = that.trim(_b[i]);
                _b[i] = '\';\r\n    css += \'#\' + guid + \'' + (_b[i].indexOf(':') === 0 ? '' : ' ') + _b[i];
              }
              return _b.join(',') + c;
            }
          });
        csscode += '\';';
      }
      // compile js
      if (jscode) {
        var _jscode;
        _jscode = that.split(jscode, /\r?\n/g);
        for (var i = 0; i < _jscode.length; i++) {
          if (!_jscode[i]) continue;
          _jscode[i] = '    template.push(\'' + _jscode[i]
            .replace(/\\/g, '\\\\')
            .replace(/\'/g, '\\\'')
            .replace(/\r\n/g, '\n')
            .replace(/\n/g, '\\n')
            .replace(/\$SUBROOT/g, '$(\\\'#\'+ guid + dguid + \'\\\')')
            .replace(/(^|[^\.])require\(([^\)]*)\)/ig, function (a, b, c) {
              var _c = (c || '')
                .split(',');
              _c.map(function (value, index) {
                _c[index] = that.trim(_c[index]);
              });
              return b + '$TPLS[' + _c[0] + '](' + (_c.length > 1 ? _c[1] : '$DATA') + ', "\'+ guid +\'")';
            }) + '\\n\');\n';
        }
        jscode = _jscode.join('');
      }
      // compile html
      if (html) {
        var _html;
        _html = that.split(html, /(<\?[\s\S]*?\?>)/g);
        for (var i = 0; i < _html.length; i++) {
          if (!_html[i]) continue;
          if (new RegExp('<\\?[\\s\\S]*?\\?>', 'igm')
            .test(_html[i])) {
            _html[i] = _html[i].replace(/<\?([\s\S]*?)\?>/igm, '$1');
            _html[i] = _html[i].replace(/@([a-zA-Z\$_]+)/igm, '$DATA.$1');
            _html[i] = _html[i].replace(/print\((.*?)\);/igm, '    template.push(($1) || \'\');\n');
            if (_html[i].indexOf('=') === 0) {
              _html[i] = '    template.push(((' + _html[i].substring(1) + ') == null ? \'\' : (' + _html[i].substring(1) + ')));';
            }
          } else {
            _html[i] = '\n    template.push(\'' + _html[i]
              .replace(/\\/g, '\\\\')
              .replace(/\'/g, '\\\'')
              .replace(/\r\n/g, '\n')
              .replace(/\n/g, '\\n') + '\');\n';
          }
        }
        html = _html.join('');
        html = html.replace(/\$ROOT/igm, '\'+ guid +\'');
        html = html.replace(/\$SUBROOT/igm, '\'+ guid + dguid +\'');
      }
      compileList[tplname] = {
        css: csscode,
        js: jscode,
        html: html
      };
    }
  },
  templete: function (path, tpl) {
    var html = "",
      tpls = [];
    for (var i in tpl) {
      var _html = "";
      _html += '  "' + i + '": function($DATA, guid){\n';
      _html += "    var css = '', dguid = N.dguid();\n";
      _html += "    var template = {\n";
      _html += "      init: function(){\n";
      _html += "        this.v8 = !!''.trim;\n";
      _html += "        this.result = this.v8 ? '' : [];\n";
      _html += "      },\n";
      _html += "      push: function(str){\n";
      _html += "        this.v8 ? (this.result += str) : this.result.push(str);\n";
      _html += "      },\n";
      _html += "      html: function(){\n";
      _html += "        return this.v8 ? this.result : this.result.join('');\n";
      _html += "      }\n";
      _html += "    };\n";
      _html += "    guid = guid || N.guid();\n";
      _html += "    template.init();\n";
      if (tpl[i].css) {
        _html += tpl[i].css + "\n";
        _html += "    if(N.ie6){\n";
        _html += "      N._fixcss(css);\n";
        _html += "    } else {\n";
        _html += "      template.push('<style>' + css + '</style>');\n";
        _html += "    }";
      }
      if (tpl[i].html) {
        _html += tpl[i].html;
      }
      if (tpl[i].js) {
        _html += "    template.push('<script>');\n";
        _html += "    template.push('(function(window, document, undefined){\\n');\n";
        _html += "    template.push('  var $ROOT = $(\"#'+ guid +'\");\\n');\n";
        _html += "    template.push('  var $TPLS = NodeTpl._tpls[\"\'+ PATH +\'\"];\\n');\n";
        _html += "    template.push('  var $DATA = NodeTpl._data[\"\'+ dguid +\'\"];\\n');\n";
        _html += tpl[i].js;
        _html += "    template.push('})(window, document);\\n');\n";
        _html += "    template.push('delete NodeTpl._data[\"\'+ dguid +\'\"];\\n');\n";
        _html += "    template.push('</script>\\n');\n";
      }
      _html += '    $DATA && (N._data[dguid] = $DATA);\n';
      _html += "    return template.html();\n";
      _html += '  }';
      tpls.push(_html);
    }
    html += "(function(N, undefined){\n";
    html += "  var PATH = '" + path + "';\n";
    html += "  if(!N || !N._tpls) return false;\n";
    html += "  N._tpls[PATH] = N._tpls[PATH] ||\n{\n";
    html += tpls.join(',\n');
    html += '\n};';
    html += "\n})(window.NodeTpl);";
    return html;
  },
  tplcompile: function (html, data) {
    html = html.trim();
    data = data || {};
    // compile html
    if (html) {
      var _html;
      _html = html.split(/(<\?[\s\S]*?\?>)/g);
      for (var i = 0; i < _html.length; i++) {
        if (!_html[i]) continue;
        if (new RegExp('<\\?[\\s\\S]*?\\?>', 'igm')
          .test(_html[i])) {
          _html[i] = _html[i].replace(/<\?([\s\S]*?)\?>/igm, '$1');
          _html[i] = _html[i].replace(/@([a-zA-Z\$_]+)/igm, '$DATA.$1');
          _html[i] = _html[i].replace(/print\((.*?)\);/igm, 'template.push(($1) || \'\');\n');
          if (_html[i].indexOf('=') === 0) {
            _html[i] = 'template.push(((' + _html[i].substring(1) + ') == null ? \'\' : (' + _html[i].substring(1) + ')));';
          }
        } else {
          _html[i] = '\ntemplate.push(\'' + _html[i]
            .replace(/\\/g, '\\\\')
            .replace(/\'/g, '\\\'')
            .replace(/\r\n/g, '\n')
            .replace(/\n/g, '\\n') + '\');\n';
        }
      }
      html = _html.join('');
      html = 'var template=[];' + html + 'return template.join("");';
      try {
        html = new Function('$DATA', html)(data);
      } catch (e) {
        console.error(e);
        html = e.toString();
      }
    }
    return html;
  }
};

renderTools.express = {
  cache: {},
  render: function (path, data, callback) {
    if (typeof data === 'function') {
      callback = data, data = {};
    }
    if (!renderTools.express.cache[path]) {
      renderTools.express.cache[path] = fs.readFileSync(path, 'utf8');
    }
    var html = renderTools.tplcompile(renderTools.express.cache[path], data);
    callback && callback(null, html);
  }
};

module.exports = renderTools;