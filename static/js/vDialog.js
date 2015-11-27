/*!
 * vDialog v1.1.0
 * HTML5 based javascript dialog plugin
 * https://www.qque.com/vDialog
 *
 * Copyright 2012-2015 pillys@163.com
 * Released under the MIT license
 */

(function(window, undefined) {
  'use strict';

  var vDialog, zIndex = 1000,
    cache = [],
    template = '\
    <div class="vdialog">\
      <div class="vd-header">\
        <div class="vd-title"></div>\
        <a class="vd-close" href="javascript:;">&times;</a>\
      </div>\
      <div class="vd-main">\
        <div class="vd-icon"></div>\
        <div class="vd-content"></div>\
      </div>\
      <div class="vd-footer"></div>\
    </div>';

  function VDialog(options) {
    this.version = '1.1.0';
    this.options = $.extend({
      id: '',
      type: '',
      title: '提示信息',
      content: '',
      init: null,
      ok: null,
      okValue: '确定',
      cancel: null,
      cancelValue: '取消',
      modal: false,
      fixed: false,
      close: null,
      esc: true,
      width: 'auto',
      height: 'auto',
      left: 'auto',
      top: 'auto'
    }, options);
    this._eventQueue = {};
    this._visible = true;
    return this._init();
  }

  /**
   * 初始化对话框
   * @method _init
   * @return {this}
   */
  VDialog.prototype._init = function() {
    var html = $(template);
    // 缓存 DOM
    this.DOM = {
      wrap: html,
      header: html.find('.vd-header'),
      title: html.find('.vd-header .vd-title'),
      close: html.find('.vd-header .vd-close'),
      main: html.find('.vd-main'),
      icon: html.find('.vd-main .vd-icon'),
      content: html.find('.vd-main .vd-content'),
      footer: html.find('.vd-footer'),
      modal: null
    };
    // 设置 ID
    if (!this.options.id) {
      this.options.id = Math.random();
    }
    // 标题
    this.title(this.options.title);
    // 图标
    this.type(this.options.type);
    // 确定按钮
    this.ok(this.options.ok);
    // 取消按钮
    this.cancel(this.options.cancel);
    // 关闭按钮
    this.close(this.options.close);
    // 尺寸
    this.width(this.options.width);
    this.height(this.options.height);
    // 随屏滚动
    this.fixed(this.options.fixed);
    // ESC 退出
    this._esc();
    // 创建 DOM
    this._build();
    // 内容，因为涉及到位置、尺寸计算，所以需要放到创建 DOM 之后
    this.content(this.options.content);
    // init
    this.init(this.options.init);
    // 模态窗口
    if (this.options.modal) {
      this.showModal();
    }
    return this;
  };
  VDialog.prototype.init = function(fn) {
    this.options.init = fn;
    if (typeof fn === 'function') {
      this.options.init.call(this);
    }
    return this;
  };
  /**
   * 将对话框添加到当前页面 DOM 中
   * @method _build
   * @return {this}
   */
  VDialog.prototype._build = function() {
    var that = this,
      wrap = this.DOM.wrap;
    // 关闭事件
    this.DOM.close.on('click', function() {
      that.close();
    });
    // 外层
    wrap.css({
      zIndex: ++zIndex
    });
    wrap.appendTo('body');
    cache.push({
      id: this.options.id,
      dialog: this
    });
    this._top();
    return this;
  };
  /**
   * 设置对话框类型（图标）
   * @method type
   * @param  {string|boolean} name 类型名称：alert / success / confirm / error
   * @return {this|string}
   */
  VDialog.prototype.type = function(name) {
    var toggleName = 'vd-main-with-icon';
    if (name === '') {
      // 隐藏图标
      this.DOM.main.removeClass(toggleName);
      return this;
    } else if (typeof name === 'string') {
      // 设置图标
      this.options.type = name;
      this.DOM.main.addClass(toggleName);
      this.DOM.icon.removeClass().addClass('vd-icon icon-vd-' + this.options.type);
      return this;
    } else if (name === undefined) {
      // 读取图标
      return this.options.type;
    }
    return this;
  };
  /**
   * 读取、设置、隐藏对话框标题
   * @method title
   * @param  {string|boolean} title 对话框标题
   * @return {this|string}
   */
  VDialog.prototype.title = function(title) {
    var toggleName = 'vdialog-no-title';
    if (title === true) {
      // 显示标题
      this.DOM.wrap.removeClass(toggleName);
      return this;
    } else if (title === false) {
      // 隐藏标题
      this.DOM.wrap.addClass(toggleName);
      return this;
    } else if (typeof title === 'string') {
      // 设置标题
      this.options.title = title;
      this.DOM.title.html(this.options.title);
      return this;
    } else if (title === undefined) {
      // 读取标题
      return this.options.title;
    }
    return this;
  };
  /**
   * 读取或设置对话框内容
   * @method content
   * @param  {string} content       对话框内容
   * @return {this|jQueryElement}
   */
  VDialog.prototype.content = function(content) {
    if (content === undefined) {
      // 读取内容
      return this.DOM.content;
    } else {
      // 设置内容
      this.options.content = content;
      this.DOM.content.html(this.options.content);
      this.position();
      return this;
    }
  };
  /**
   * 默认按钮创建代理
   * @method _button
   * @param  {string}   name 按钮类型，ok / cancel
   * @param  {Function} fn   回调
   * @return {this}
   */
  VDialog.prototype._button = function(name, fn) {
    var that = this,
      button, buttonValue;
    button = that.button(name);
    if (name === 'ok') {
      buttonValue = 'okValue';
    } else if (name === 'cancel') {
      buttonValue = 'cancelValue';
    } else {
      return this;
    }
    if (fn === undefined) {
      // 执行 ok 方法，等同于点击确定按钮
      button.trigger('click');
      return this;
    }
    if (fn === null || fn === false) {
      // 不显示确定按钮
      return this;
    }
    if (button.length === 0) {
      // 没有确定按钮，添加
      that.button({
        name: name,
        className: name,
        text: that.options[buttonValue]
      });
    }
    // 设置确定按钮回调
    that.button(name, function() {
      that.options[name] = fn;
      if (that.options[name] === true || that.options[name] && that.options[name].call(that) !== false) {
        that.close();
      }
    });
    return this;
  };
  /**
   * 点击确定按钮执行的回调
   * @method ok
   * @param  {Function} fn 回调函数
   * @return {this}
   */
  VDialog.prototype.ok = function(fn) {
    return this._button('ok', fn);
  };
  /**
   * 点击取消按钮执行的回调
   * @method cancel
   * @param  {Function} fn 回调函数
   * @return {this}
   */
  VDialog.prototype.cancel = function(fn) {
    return this._button('cancel', fn);
  };
  /**
   * 按钮创建方法
   * @method button
   * @param  {string|object}   button 按钮
   * @param  {Function} fn     点击按钮时执行的回调
   * @return {this}
   */
  VDialog.prototype.button = function(button, fn) {
    var that = this,
      footer, buttonDom, newButtonDom;
    footer = this.DOM.footer;
    if (fn === true) {
      fn = function() {};
    } else if (fn === false) {
      fn = function() {
        return false;
      };
    }
    if (typeof button === 'string') {
      // 获取按钮 DOM
      buttonDom = footer.find('a.vd-btn[data-name="' + button + '"]');
      if (fn === undefined) {
        return buttonDom;
      } else {
        // 设置指定按钮回调
        fn && buttonDom.off('click.vDialog').on('click.vDialog', fn);
        return this;
      }
    } else if (typeof button === 'object') {
      // 添加按钮
      button = $.extend({
        name: '',
        className: 'ok',
        text: '确定'
      }, button);
      if (button.name === '') {
        // 分配一个随机的 name
        button.name = Math.random().toString();
      }
      buttonDom = footer.find('a.vd-btn[data-name="' + button.name + '"]');
      newButtonDom = $('<a data-name="' + button.name + '" class="vd-btn vd-btn-' + button.className + '" href="javascript:;">' + button.text + '</a>');
      if (buttonDom.length === 0) {
        footer.prepend(newButtonDom);
      } else {
        buttonDom.replaceWith(newButtonDom);
      }
      fn && newButtonDom.on('click.vDialog', fn);
      footer.show();
      return this;
    }
  };
  /**
   * 关闭对话框
   * @method close
   * @param  {Function} fn 关闭时执行的回调
   * @return {this}
   */
  VDialog.prototype.close = function(fn) {
    var returnValue = null,
      returnDom;
    if (fn !== undefined) {
      this.options.close = fn;
      if (this.options.close === false) {
        this.DOM.close.hide();
      } else {
        this.DOM.close.show();
      }
    } else {
      returnDom = this.DOM.wrap.find('[data-returnable="true"]');
      if (returnDom.length > 0) {
        returnValue = returnDom.data('returnValue') || returnDom.val();
        this.returnValue = returnValue;
      }
      this.DOM.wrap.remove();
      this.DOM.modal && this.DOM.modal.remove();
      for (var i = 0; i < cache.length; i++) {
        if (cache[i].dialog === this) {
          cache.splice(i, 1);
          this._top();
          break;
        }
      }
      if (typeof this.options.close === 'function') {
        this.options.close.call(this);
      }
    }
    return this;
  };
  /**
   * 设置对话框的宽度
   * @method width
   * @param  {Number|String} width 宽度值
   * @return {this}
   */
  VDialog.prototype.width = function(width) {
    if (width === undefined) {
      return this.options.width;
    } else {
      this.options.width = width;
      this.DOM.content.width(this.options.width);
      this.position();
      return this;
    }
  };
  /**
   * 设置对话框的高度
   * @method height
   * @param  {Number|String} height 高度值
   * @return {this}
   */
  VDialog.prototype.height = function(height) {
    if (height === undefined) {
      return this.options.height;
    } else {
      this.options.height = height;
      this.DOM.content.height(this.options.height);
      this.position();
      return this;
    }
  };
  /**
   * 重新设置对话框位置
   * @method position
   * @return {this}
   */
  VDialog.prototype.position = function() {
    var left, top, scrollSize, screenSize, dialogSize, el = document.documentElement || document.body;
    if (this.options.fixed) {
      scrollSize = {
        left: 0,
        top: 0
      };
    } else {
      if (window.pageYOffset !== undefined) {
        scrollSize = {
          left: window.pageXOffset,
          top: window.pageYOffset
        };
      } else {
        scrollSize = {
          left: el.scrollLeft,
          top: el.scrollTop
        }
      }
    }
    screenSize = {
      width: el.clientWidth,
      height: el.clientHeight
    };
    dialogSize = {
      width: this.DOM.wrap.outerWidth(),
      height: this.DOM.wrap.outerHeight()
    };
    if (this.options.left === 'auto') {
      left = scrollSize.left + Math.max(0, (screenSize.width - dialogSize.width) / 2);
    } else {
      left = this.options.left;
    }
    if (this.options.top === 'auto') {
      top = scrollSize.top + Math.max(10, (screenSize.height - dialogSize.height) / 3);
    } else {
      top = this.options.top;
    }
    this.DOM.wrap.css({
      left: isNaN(left) ? left : (left + 'px'),
      top: isNaN(top) ? top : (top + 'px')
    });
    return this;
  };
  /**
   * 随屏滚动
   * @method fixed
   * @param  {Boolean} fixed 是否随屏幕滚动
   * @return {this}
   */
  VDialog.prototype.fixed = function(fixed) {
    if (fixed === undefined) {
      return this.options.fixed;
    } else {
      this.options.fixed = !!fixed;
      // IE6 不支持 fixed
      if ((/msie\s*(\d+)\.\d+/g.exec(navigator.userAgent.toLowerCase()) || [0, '0'])[1] == '6') {
        fixed = false;
      }
      if (fixed) {
        this.DOM.wrap.addClass('vdialog-fixed');
      } else {
        this.DOM.wrap.removeClass('vdialog-fixed');
      }
      this.position();
    }
    return this;
  };
  /**
   * 显示对话框
   * @method show
   * @param  {HTMLElement}  anchor 页面跟随 DOM
   * @return {this}
   */
  VDialog.prototype.show = function(anchor) {
    this._visible = true;
    this.DOM.wrap.show();
    if (anchor) {
      var anchor = $(anchor),
        offset = anchor.offset(),
        height = anchor.outerHeight(true);
      this.options.left = offset.left;
      this.options.top = offset.top + height;
      this.position();
    }
    this._top();
    return this;
  };
  /**
   * 显示模态对话框
   * @method showModal
   * @param  {HTMLElement}  anchor 页面跟随 DOM
   * @return {this}
   */
  VDialog.prototype.showModal = function(anchor) {
    var el = document.documentElement,
      height = Math.max(el.clientHeight, el.scrollHeight);
    this.DOM.modal = $('<div />').addClass('vdialog-modal').css({
      zIndex: zIndex,
      height: height
    }).insertBefore(this.DOM.wrap);
    this.show(anchor);
    return this;
  };
  /**
   * 隐藏对话框
   * @method hide
   * @return {this}
   */
  VDialog.prototype.hide = function() {
    this._visible = false;
    this.DOM.wrap.hide();
    this.DOM.modal && this.DOM.modal.remove();
    this._top();
    return this;
  };
  /**
   * 重新整理顶层对话框
   * @method _top
   * @return {this}
   */
  VDialog.prototype._top = function() {
    vDialog.top = null;
    for (var i = cache.length - 1; i >= 0; i--) {
      if (cache[i].dialog._visible) {
        vDialog.top = cache[i].dialog;
        break;
      }
    }
    return this;
  };
  /**
   * ESC 键控制
   * @method _esc
   * @return {this}
   */
  VDialog.prototype._esc = function() {
    $(document).off('keydown.vDailog').on('keydown.vDailog', function(event) {
      var dialog = vDialog.top,
        target = event.target;
      if (!dialog || /^input|textarea$/i.test(target.nodeName) && target.type !== 'button') {
        return;
      }
      if (event.keyCode === 27 && dialog.options.esc) {
        dialog.close();
      }
    });
    return this;
  };
  /**
   * 事件监听
   * @method on
   * @param  {String}   name 事件名称
   * @param  {Function} fn   回调函数
   * @return {this}
   */
  VDialog.prototype.on = function(name, fn) {
    if (fn) {
      if (this[name]) {
        this[name].call(this, fn);
      } else {
        // 自定义事件
        this._eventQueue[name] = fn;
      }
    }
    return this;
  };
  /**
   * 执行自定义事件
   * @method emit
   * @return {this}
   */
  VDialog.prototype.emit = function() {
    var name, args = Array.prototype.slice.call(arguments);
    if (args.length === 0) {
      return this;
    }
    name = args.shift();
    if (this._eventQueue[name]) {
      this._eventQueue[name].apply(this, args);
    }
    return this;
  };
  /**
   * --------------------------- vDialog --------------------------
   */
  /**
   * vDialog 实例
   * @method vDialog
   * @param  {Object} options 参数
   * @return {vDialog}
   */
  vDialog = function(options) {
    return new VDialog(options);
  };
  vDialog.top = null;
  vDialog._proxy = vDialog;

  /**
   * vDialog.alert
   * @method alert
   * @param  {String}   content 提示内容
   * @param  {Object}   options 对话框配置信息
   * @param  {Function} fn      关闭对话框时，执行的回调
   * @return {this}
   */
  vDialog.alert = function(content, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    options = $.extend({
      type: 'alert',
      title: '提示信息',
      content: content,
      modal: true,
      fixed: true,
      ok: function() {
        fn && fn.call(this);
      },
      close: function() {
        fn && fn.call(this);
      }
    }, options);
    return this._proxy(options);
  };

  /**
   * vDialog.success
   * @method success
   * @param  {String}   content 成功提示内容
   * @param  {Object}   options 对话框配置信息
   * @param  {Function} fn      关闭对话框时，执行的回调
   * @return {this}
   */
  vDialog.success = function(content, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    options = $.extend({
      type: 'success',
      title: '成功提示',
      content: content,
      modal: true,
      fixed: true,
      ok: function() {
        fn && fn.call(this);
      },
      close: function() {
        fn && fn.call(this);
      }
    }, options);
    return this._proxy(options);
  };

  /**
   * vDialog.error
   * @method error
   * @param  {String}   content 错误提示内容
   * @param  {Object}   options 对话框配置信息
   * @param  {Function} fn      关闭对话框时，执行的回调
   * @return {this}
   */
  vDialog.error = function(content, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    options = $.extend({
      type: 'error',
      title: '错误提示',
      content: content,
      modal: true,
      fixed: true,
      ok: function() {
        fn && fn.call(this);
      },
      close: function() {
        fn && fn.call(this);
      }
    }, options);
    return this._proxy(options);
  };

  /**
   * vDialog.confirm
   * @method confirm
   * @param  {String}   content 确认提示内容
   * @param  {Object}   options 对话框配置信息
   * @param  {Function} okFn      点击确定按钮时，执行的回调
   * @param  {Function} cancelFn      点击取消按钮时，执行的回调
   * @return {this}
   */
  vDialog.confirm = function(content, options, okFn, cancelFn) {
    if (typeof options === 'function') {
      cancelFn = okFn;
      okFn = options;
      options = {};
    }
    options = $.extend({
      type: 'confirm',
      title: '确认信息',
      content: content,
      modal: true,
      fixed: true,
      ok: function() {
        okFn && okFn.call(this);
      },
      cancel: function() {
        cancelFn && cancelFn.call(this);
      }
    }, options);
    return this._proxy(options);
  };
  window.vDialog = vDialog;
})(window);