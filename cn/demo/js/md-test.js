define(function(require, exports, module) {
  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  nodetpl.get('/cn/demo/tpls/1', {
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