define(function(require, exports, module) {
  var nodetpl = require('nodetpl.client');
  nodetpl.get('/demo/tpls/1', {
    title: '个人爱好',
    favor: ['足球', '篮球', '乒乓球', '琉璃球']
  }, function(d) {
    alert(d);
  });
});