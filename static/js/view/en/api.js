define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  $('#btn-01').on('click', function() {
    var data = {
      "title": "Favor",
      "favor": [
        "Football",
        "Basketball",
        "Table tennis",
        "Glass ball"
      ]
    };
    nodetpl.get('/en/demo/tpls/1.js', data, function(d) {
      vDialog({
        title: 'Result',
        content: d,
        width: 400,
        ok: true,
        okValue: 'Ok'
      }).showModal();
    });
  });

  $('#btn-02').on('click', function() {
    var data = {
      "title": "Favor",
      "favor": [
        "Football",
        "Basketball",
        "Table tennis",
        "Glass ball"
      ]
    };
    nodetpl.get('http://www.nodetpl.com/en/demo/tpls/1.tpl', data, function(d) {
      vDialog({
        title: 'Result',
        content: d,
        width: 400,
        ok: true,
        okValue: 'Ok'
      }).showModal();
    });
  });

  $('#btn-03').on('click', function() {
    var data = {
      "title": "Favor",
      "favor": [
        "Football",
        "Basketball",
        "Table tennis",
        "Glass ball"
      ]
    };
    var content = document.getElementById('favor-tpl').innerHTML;
    nodetpl.render(content, data, function(d) {
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