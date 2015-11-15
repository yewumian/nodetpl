$(function() {
  var tplList = $('#tpl-list');
  (function() {
    var js = $('#js').text() || '{}';
    var list = /nodetpl\.get\(['"]([^'"]+)/g.exec(js);
    if (list.length > 1) {
      var tplpath = list[1].replace(/\.js$/, '.tpl');
      tplList.append('<a href="' + tplpath + '">' + tplpath + '</a>');
    }
  })();

  $('a.btnrun').on('click', function() {
    var js = $('#js').text() || '{}';
    js = js.replace(/\/\/输出数据d/g, '$("#result").text(d);$("#result-show").html(d);');
    eval(js);
  });

  tplList.on('click', 'a', function() {
    var url = $(this).attr('href');
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'html',
      success: function(data) {
        $("#result").text(data);
      }
    });
    return false;
  });

});