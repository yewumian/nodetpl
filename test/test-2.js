var app = require('express')(),
    nodetpl = require('../nodetpl');

app.set('view engine', 'tpl');
app.set('views', __dirname + '/views');
app.engine('tpl', nodetpl.express.render);

app.get('/', function(req, res){
  res.render('index', {
    "user": "Tom",
    "favor": [ "Apple", "Orange", "Bananer" ]
  }, function(err, html){
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
});

app.listen(1234);

console.log('http://127.0.0.1:1234')