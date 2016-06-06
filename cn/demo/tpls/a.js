(function(root, factory) {
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    if (typeof callback === 'function' && typeof iife !== 'undefined' && iife === true) {
      var module_id = 'nodetpl_' + Math.random();
      define(module_id, factory);
      if (define.amd) {
        require([module_id], callback);
      } else if (define.cmd) {
        seajs.use([module_id], callback);
      } else {
        throw new Error('nodetpl cannot guess what the define means.');
      }
    } else {
      define(factory);
    }
  } else if (typeof require === 'function' && typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    if (root.nodetpl) {
      var result = factory();
      if (typeof callback === 'function' && typeof iife !== 'undefined' && iife === true) {
        callback(result);
      } else {
        var url = root.nodetpl.getCurrentScript();
        if (url) {
          root.nodetpl.cache[url] = result;
        }
      }
      return result;
    } else {
      throw new Error('nodetpl not found.');
    }
  }
}(this, function(require, exports, module) {
  'use strict';

  function NodeTpl() {
    this.version = '4.2.1';
    this.tpls = {};
    this.scripts = {};
    this.datas = {};
    this._initTpls()._initScripts();
    return this;
  }
  NodeTpl.prototype._generate = function() {
    return Math.random().toString().replace('.', '');
  };
  NodeTpl.prototype._initTpls = function() {
    var $NODETPL = this;
    this.tpls = {
      "main": function($DATA, guid) {
        var _ = '';
        var duid = $NODETPL.duid();
        guid = guid || $NODETPL.guid();
        _ += '<style>#' + guid + ' a{  font-size: 12px;}</style>';
        try {
          _ += '<div id="' + guid + '">\n  <h1>';
          if (typeof $DATA.title !== 'undefined') {
            _ += $NODETPL.escapeHtml($DATA.title);
          }

          _ += '</h1>\n  <ul>\n    ';
          for (var i = 0; i < $DATA.favor.length; i++) {
            _ += '\n      <li>';
            if (typeof i !== 'undefined') {
              _ += $NODETPL.escapeHtml(i);
            }

            _ += '：';
            if (typeof $DATA.favor !== 'undefined') {
              _ += $NODETPL.escapeHtml($DATA.favor[i]);
            }

            _ += '</li>\n    ';
          }
          _ += '\n  </ul>\n</div>';
        } catch (e) {
          console.log(e, e.stack);
        }
        if ($DATA) {
          $NODETPL.datas[duid] = $DATA;
        }
        (function(scripts) {
          var cache = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
          cache._nodetpl_ = cache._nodetpl_ || {};
          cache._nodetpl_[guid + '-' + duid] = scripts['main'];
        })($NODETPL.scripts);
        _ += '<script>\n';
        _ += '(function(){\n';
        _ += '  var cache = typeof window !== \'undefined\' ? window : typeof global !== \'undefined\' ? global : {};\n';
        _ += '  cache._nodetpl_[\'' + guid + '-' + duid + '\'](\'' + guid + '\', \'' + duid + '\');\n';
        _ += '  delete cache._nodetpl_[\'' + guid + '-' + duid + '\'];\n';
        _ += '})();\n';
        _ += '</script>\n';
        return _;
      }
    };
    return $NODETPL;
  };
  NodeTpl.prototype._initScripts = function() {
    var $NODETPL = this;
    this.scripts = {
      "main": function(guid, duid) {
        var ROOT = document.getElementById(guid);
        var SUBROOT = document.getElementById(guid + duid);
        var $TPLS = $NODETPL.tpls;
        var $DATA = $NODETPL.datas[duid];
        console.log($(ROOT));
      }
    };
    return $NODETPL;
  };
  NodeTpl.prototype.duid = function() {
    return 'nodetpl_d_' + this._generate();
  };
  NodeTpl.prototype.guid = function() {
    return 'nodetpl_g_' + this._generate();
  };
  NodeTpl.prototype.escapeHtml = function(html) {
    return html.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  NodeTpl.prototype.render = function(data, guid) {
    return this.tpls.main(data, guid || this.guid());
  };
  return {
    render: function(data) {
      return new NodeTpl().render(data);
    }
  };
}));