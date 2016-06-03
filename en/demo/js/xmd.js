define(function(require, exports, module) {
  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  var tpl = require('/en/demo/tpls/1');
  var html = tpl.render({
    "title": "Favor",
    "favor": [
      "Football",
      "Basketball",
      "Table tennis",
      "Glass ball"
    ]
  });
  vDialog({
    title: 'Result',
    content: html,
    width: 400,
    okValue: 'Ok'
  }).showModal();
});