define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  $('section.faq-list dl dt a').on('click', function() {
    $(this).closest('dl').toggleClass('active');
  });
});