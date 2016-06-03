define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  $('#btn-01,#btn-02').on('click', function() {
    var tpl = require('/en/demo/tpls/1.js');
    var data = {
      "title": "Favor",
      "favor": [
        "Football",
        "Basketball",
        "Table tennis",
        "Glass ball"
      ]
    };
    var html = tpl.render(data);
    vDialog({
      title: 'Result',
      content: html,
      width: 400,
      ok: true,
      okValue: 'Ok'
    }).showModal();
  });
});