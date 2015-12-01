define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  $('#btn-01').on('click', function() {
    var template = '\
      <?for(var i=0; i<10; i++){?>\
        <p>hello, world</p>\
      <?}?>';
    nodetpl.render(template, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400
      }).showModal();
    });
  });

  $('#btn-02').on('click', function() {
    var template = '\
      <?for(var i=0; i<10; i++){?>\
        <p>hello, world, 第 <?=i?> 次</p>\
      <?}?>';
    nodetpl.render(template, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400
      }).showModal();
    });
  });

  $('#btn-03').on('click', function() {
    var data = {
      "title": "我是传入的标题",
      "favor": ["足球", "篮球", "乒乓球", "琉璃球"]
    };
    var template = '\
      <h1><?=title?></h1>\
      <ul>\
        <?for(var i=0; i<favor.length; i++){?>\
          <li><?=i?>：<?=favor[i]?></li>\
        <?}?>\
      </ul>';
    nodetpl.render(template, data, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400
      }).showModal();
    });
  });

  $('#btn-04').on('click', function() {
    var data = {
      "title": "我是传入的标题",
      "favor": ["足球", "篮球", "乒乓球", "琉璃球"]
    };
    var template = '\
      <style>\
        h1 {\
          font-size: 20px;\
          color: #f00;\
        }\
        p {\
          text-indent: 2em;\
        }\
      </style>\
      <div id="$ROOT">\
        <h1><?=title?></h1>\
        <?for(var i=0; i<10; i++){?>\
          <p>hello, world, 第 <?=i?> 次</p>\
        <?}?>\
      </div>';
    nodetpl.render(template, data, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400
      }).showModal();
    });
  });

  $('#btn-05').on('click', function() {
    var data = {
      "title": "我是传入的标题",
      "favor": ["足球", "篮球", "乒乓球", "琉璃球"]
    };
    var template = '\
      <div id="$ROOT">\n\
        <h1><?=title?></h1>\n\
        <?for(var i=0; i<10; i++){?>\n\
          <p>hello, world, 第 <?=i?> 次</p>\n\
        <?}?>\n\
      </div>\n\
      <script>\n\
      var padding = \'20\';\n\
      ROOT.style.padding = padding + \'px\';\n\
      // OR\n\
      $ROOT.css(\'color\', \'#f00\');\n\
      alert($DATA.title);\n\
      </script>';
    nodetpl.render(template, data, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400
      }).showModal();
    });
  });
});