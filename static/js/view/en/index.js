define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var nodetpl = require('nodetpl');
  var vDialog = require('vDialog');

  var wrap = $('.quick-look');
  var data = {
    "title": "Favor",
    "favor": [
      "Football",
      "Basketball",
      "Table tennis",
      "Glass ball"
    ]
  };
  var template = '\
    <div>\n\
      <div><?=@title?></div>\n\
      <ul>\n\
        <?for(var i=0; i<@favor.length; i++){?>\n\
          <li><?=i?>：<?=@favor[i]?></li>\n\
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
        title: 'Result',
        content: d,
        width: 400,
        ok: true,
        okValue: 'Ok'
      }).showModal();
    });
  });
});