define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  nodetpl.config({
    strict: false,
    map: function(str) {
      // foreach => arr.forEach
      str = str
        .replace(/foreach\s*\(\s*(\$array)\s+as\s+(\$key)\s*=>\s*(\$value)\s*\):/g, function(all, arr, key, value) {
          return arr.replace(/^\$/g, '') + '.forEach(function(' + value.replace(/^\$/g, '') + ', ' + key.replace(/^\$/g, '') + ') {';
        })
        .replace(/endforeach/g, '});');
      // for
      str = str
        .replace(/for\s*\(\s*([^;]+)(.*)\):/g, function(all, vars, conditions) {
          return 'for(var ' + vars.replace(/\$/g, '') + conditions.replace(/\$/g, '') + ') {';
        })
        .replace(/endfor/g, '}');
      // if
      str = str
        .replace(/((?:else\s+)?if)\s*\((.*)\):/g, function(all, elseif, conditions) {
          return elseif + '(' + conditions.replace(/\$/g, '') + ') {';
        })
        .replace(/endif/g, '}');
      // $name => name
      str = str.replace(/^\s*=\s*\$/g, '=');
      return str;
    }
  });

  $('#btn-01').on('click', function() {
    var data = {
      array: ['Tom', 'Lily', 'John'],
      age: 18
    };
    var content = '<div>\n' +
      '  <?foreach ($array as $key => $value):?>\n' +
      '    hello, <?=$key?> <?=$value?>\n' +
      '  <?endforeach?>\n' +
      '  <?for($i=0; $i<=10; $i++):?>\n' +
      '    hello, <?=$i?>\n' +
      '  <?endfor?>\n' +
      '  <?if($age < 20):?>\n' +
      '    hello, young man.\n' +
      '  <?endfor?>\n' +
      '</div>';
    nodetpl.render(content, data, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400,
        ok: true
      }).showModal();
    });
  });
});