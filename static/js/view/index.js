define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  var wrap = $('.quick-look');
  var data = {
    "title": "个人爱好",
    "favor": [
      "足球",
      "篮球",
      "乒乓球",
      "琉璃球"
    ]
  };
  var template = '\
    <div>\n\
      <div><?=title?></div>\n\
      <ul>\n\
        <?for(var i=0; i<favor.length; i++){?>\n\
          <li><?=i?>：<?=favor[i]?></li>\n\
        <?}?>\n\
      </ul>\n\
    </div>';

  wrap.find('.code-data').text(JSON.stringify(data, null, 2));
  wrap.find('.code-template').text(template);
  nodetpl.render(template, data, function(d) {
    wrap.find('.code-result').html(d);
  });
  wrap.find('a.btn-try').on('click', function() {
    nodetpl.render(template, data, function(d) {
      vDialog({
        title: '运行结果',
        content: d,
        width: 400
      }).showModal();
    });
  });
});