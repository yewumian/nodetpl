define(function(require, exports, module) {
  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  nodetpl.get('/en/demo/tpls/1', {
    "title": "Favor",
    "favor": [
      "Football",
      "Basketball",
      "Table tennis",
      "Glass ball"
    ]
  }, function(d) {
    vDialog({
      title: 'Result',
      content: d,
      width: 400,
      okValue: 'Ok'
    }).showModal();
  });
});