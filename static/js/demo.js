$('a.btnrun').on('click', function() {
  var data = $('#data').text() || '{}';
  var template = $('#template').text() || '';
  var result;
  data = JSON.parse(data);
  result = nodetpl.render(template, data);
  $('#result').text(result);
  $('#result-show').html(result);
  console.log(result);
});