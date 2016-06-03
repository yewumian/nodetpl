define(function(require, exports, module) {
  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  var tpl = require('/en/demo/tpls/1');
  var html = tpl.render({
    title: '个人爱好',
    favor: ['足球', '篮球', '乒乓球', '琉璃球']
  });
  vDialog({
    title: '运行结果',
    content: html,
    width: 400
  }).showModal();
});