$('a.btnrun').on('click', function() {
  var data = $('#data').text() || '{}';
  var template = $('#template').text() || '';
  var result;
  data = JSON.parse(data);
  result = nodetpl.render(template, data);

  $('#result').text(result);

  vDialog({
    title: '运行结果',
    content: result,
    ok: true
  }).showModal();

  console.log(result);
});