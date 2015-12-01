define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  $('#btn-01').on('click', function() {
    var data = {
      "title": "个人爱好",
      "favor": ["足球", "篮球", "乒乓球", "琉璃球"]
    };
    nodetpl.get('/demo/tpls/1.js', data, function(d) {
      console.log(d);
    });
  });

  $('#btn-02').on('click', function() {
    var data = {
      "title": "个人爱好",
      "favor": ["足球", "篮球", "乒乓球", "琉璃球"]
    };
    var content = document.getElementById('favor-tpl').innerHTML;
    nodetpl.render(content, data, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400
      }).showModal();
    });
  });

  $('#btn-03').on('click', function() {
    var data = {
      "title": "个人爱好",
      "favor": ["足球", "篮球", "乒乓球", "琉璃球"]
    };
    nodetpl.get('/demo/tpls/1', {
      title: '个人爱好',
      favor: ['足球', '篮球', '乒乓球', '琉璃球']
    }, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400
      }).showModal();
    });
  });
});