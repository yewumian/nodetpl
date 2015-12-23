define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  $('#btn-01,#btn-02').on('click', function() {
    var data = {
      "title": "Favor",
      "favor": [
        "Football",
        "Basketball",
        "Table tennis",
        "Glass ball"
      ]
    };
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
        ok: true,
        okValue: 'Ok'
      }).showModal();
    });
  });
});