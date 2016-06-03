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
    var that = this;
    this.tpls = {
      "main": function($DATA, guid) {
        var _ = '';
        var duid = that.duid();
        guid = guid || that.guid();
        try {
          _ += '<h1>';
          if (typeof $DATA.title !== 'undefined') {
            _ += ($DATA.title);
          }

          _ += '</h1>\n<ul>\n  ';
          for (var i = 0; i < $DATA.favor.length; i++) {
            _ += '\n    <li>';
            if (typeof i !== 'undefined') {
              _ += (i);
            }

            _ += '：';
            if (typeof $DATA.favor !== 'undefined') {
              _ += ($DATA.favor[i]);
            }

            _ += '</li>\n  ';
          }
          _ += '\n</ul>';
        } catch (e) {
          console.log(e, e.stack);
        }
        if ($DATA) {
          that.datas[duid] = $DATA;
        }
        return _;
      }
    };
    return that;
  };
  NodeTpl.prototype._initScripts = function() {
    var that = this;
    this.scripts = {

    };
    return that;
  };
  NodeTpl.prototype.duid = function() {
    return 'nodetpl_d_' + this._generate();
  };
  NodeTpl.prototype.guid = function() {
    return 'nodetpl_g_' + this._generate();
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