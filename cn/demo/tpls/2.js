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
        _ += '<style>#' + guid + ' .title {    font-size: 14px;    font-weight: bold;  }#' + guid + '   .content {    padding: 10px;  }</style>';
        try {
          _ += '<div id="' + guid + '">\n    <div class="title">个人名片 [<a class="link-modify" href="javascript:;">修改</a>]</div>\n    <div class="content"></div>\n  </div>';
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
      },
      "view": function($DATA, guid) {
        var _ = '';
        var duid = $NODETPL.duid();
        guid = guid || $NODETPL.guid();
        _ += '<style>#' + guid + duid + ' ul li{    border: 1px solid #ccc;  }</style>';
        try {
          _ += '<div id="' + guid + duid + '">\n    <ul>\n      <li>姓名：';
          if (typeof $DATA.name !== 'undefined') {
            _ += $NODETPL.escapeHtml($DATA.name);
          }

          _ += '</li>\n      <li>性别：';
          if (typeof $DATA.gender !== 'undefined') {
            _ += $NODETPL.escapeHtml($DATA.gender);
          }

          _ += '</li>\n      <li>年龄：';
          if (typeof $DATA.age !== 'undefined') {
            _ += $NODETPL.escapeHtml($DATA.age);
          }

          _ += '</li>\n    </ul>\n  </div>';
        } catch (e) {
          console.log(e, e.stack);
        }
        if ($DATA) {
          $NODETPL.datas[duid] = $DATA;
        }
        return _;
      },
      "edit": function($DATA, guid) {
        var _ = '';
        var duid = $NODETPL.duid();
        guid = guid || $NODETPL.guid();
        _ += '<style>#' + guid + duid + ' ul li{    margin: 0 10px;    background-color: #eee;  }</style>';
        try {
          _ += '<div id="' + guid + duid + '">\n    <form action="">\n      <ul>\n        <li>姓名：<input type="text" name="name" value="';
          if (typeof $DATA.name !== 'undefined') {
            _ += $NODETPL.escapeHtml($DATA.name);
          }

          _ += '" /></li>\n        <li>性别：<input type="text" name="gender" value="';
          if (typeof $DATA.gender !== 'undefined') {
            _ += $NODETPL.escapeHtml($DATA.gender);
          }

          _ += '" /></li>\n        <li>年龄：<input type="text" name="age" value="';
          if (typeof $DATA.age !== 'undefined') {
            _ += $NODETPL.escapeHtml($DATA.age);
          }

          _ += '" /></li>\n      </ul>\n      <div class="form-actions">\n        <button type="submit">保存</button>\n      </div>\n    </form>\n  </div>';
        } catch (e) {
          console.log(e, e.stack);
        }
        if ($DATA) {
          $NODETPL.datas[duid] = $DATA;
        }
        (function(scripts) {
          var cache = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
          cache._nodetpl_ = cache._nodetpl_ || {};
          cache._nodetpl_[guid + '-' + duid] = scripts['edit'];
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
        var contentBox = $(ROOT).find('.content');
        var viewHtml = $TPLS['view']($DATA, guid);
        contentBox.html(viewHtml);
        $(ROOT).find('.title a.link-modify').on('click', function() {
          var editHtml = $TPLS['edit']($DATA, guid);
          contentBox.html(editHtml);
        });
      },
      "edit": function(guid, duid) {
        var ROOT = document.getElementById(guid);
        var SUBROOT = document.getElementById(guid + duid);
        var $TPLS = $NODETPL.tpls;
        var $DATA = $NODETPL.datas[duid];
        $(SUBROOT).find('form').on('submit', function() {
          var name = $(this).find('input[name="name"]').val(),
            gender = $(this).find('input[name="gender"]').val(),
            age = $(this).find('input[name="age"]').val();
          $DATA.name = name;
          $DATA.gender = gender;
          $DATA.age = age;
          var viewHtml = $TPLS['view']($DATA, guid);
          $(ROOT).find('.content').html(viewHtml);
          return false;
        });
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