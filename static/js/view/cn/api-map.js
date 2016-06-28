define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  $('#btn-map-juicer').on('click', function() {
    var data = {
      list: [
        {name:' guokai', show: true},
        {name:' benben', show: false},
        {name:' dierbaby', show: true}
      ],
      blah: [
        {num: 1},
        {num: 2},
        {num: 3, inner:[
          {'time': '15:00'},
          {'time': '16:00'},
          {'time': '17:00'},
          {'time': '18:00'}
        ]},
        {num: 4}
      ]
    };
    var content = [
      '<ul>',
      '  {@each list as it,index}',
      '    <li>${it.name} (index: ${index})</li>',
      '  {@/each}',
      '  {@each blah as it}',
      '    <li>',
      '      num: ${it.num} <br />',
      '      {@if it.num==3}',
      '        {@each it.inner as it2}',
      '          ${it2.time} <br />',
      '        {@/each}',
      '      {@else if it.num==4}',
      '        ${it.num}',
      '      {@/if}',
      '    </li>',
      '  {@/each}',
      '</ul>'
    ].join('\n');
    nodetpl.config({
      strict: false,
      openTag: '{',
      closeTag: '}',
      map: function(str) {
        // {@each} ... {@/each}
        str = str.replace(/@each ([^ ]+) as ([^ ,]+)([, ]?)([^ ]+)?/g, function(all, arr, value, dot, index) {
          return arr + '.forEach(function(' + value + (dot || '') + (index || '') + ') {';
        }).replace(/@\/each/g, '});');
        // {@if} ... {@else if} ... {@else} ... {@/if}
        str = str.replace(/@if (.*)/g, 'if($1){').replace(/@else if (.*)/g, '} else if($1){').replace(/@\/if/g, '}');
        // {#
        str = str.replace(/#.*/g, '');
        return str;
      },
      beforeCompile: function(html) {
        // ${...} => {=...}
        // $${...} => {==...}
        return html.replace(/\${2}\{/g, '{==').replace(/\$\{/g, '{=');
      }
    });
    nodetpl.render(content, data, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400,
        ok: true
      }).showModal();
    });
  });

  $('#btn-map-artTemplate').on('click', function() {
    var data = {
      admin: true,
      list: [{
        user: 'zhangsan'
      }, {
        user: 'lisi'
      }, {
        user: 'wangwu'
      }]
    };
    var content = [
      '{{if admin}}',
      '  <p>admin</p>',
      '{{else if code > 0}}',
      '  <p>master</p>',
      '{{else}}',
      '  <p>error!</p>',
      '{{/if}}',
      '<ul>',
      '  {{each list as value index}}',
      '    <li>{{index}} - {{value.user}}</li>',
      '  {{/each}}',
      '  {{each list}}',
      '    <li>{{$index}} - {{$value.user}}</li>',
      '  {{/each}}',
      '</ul>'
    ].join('\n');
    nodetpl.config({
      strict: false,
      openTag: '{{',
      closeTag: '}}',
      map: function(str) {
        // if
        str = str.replace(/ *else if +(.*)/g, '} else if($1) {').replace(/ *if +(.*)/g, 'if($1) {').replace(/ *else *$/g, '} else {').replace(/ *\/if/g, '}');
        // each list as value index
        str = str.replace(/ *each ([^ ]+) as ([^ ]+) *([^ ]+)?/g, function(all, arr, value, index) {
          return arr + '.forEach(function(' + value + (index ? ',' : '') + (index || '') + ') {';
        }).replace(/ *each ([^ ]+)/g, function(all, arr) {
          return arr + '.forEach(function($value, $index) {';
        }).replace(/\/each/g, '});');
        // {#
        str = str.replace(/^([^\s}]+)$/g, '=$1');
        return str;
      }
    });
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