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
    var tpl = require('/cn/demo/tpls/2.js');
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