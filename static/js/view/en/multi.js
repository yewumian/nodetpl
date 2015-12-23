define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  $('#btn-01').on('click', function() {
    var data = {
      "name": "Tom",
      "gender": "Male",
      "age": 108
    };
    nodetpl.get('/en/demo/tpls/2.js', data, function(d) {
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