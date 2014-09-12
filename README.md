# Read me

  Fast, easy use javascript template engine based on [node.js](http://nodejs.org).

```js
var nodetpl = require('nodetpl');

var output, input;
input = '<?if(true){?>Now is <?=new Date()?>.<?}?>';
output = nodetpl.precompile(input);

console.log(nodetpl.templete('/hello-world.js', output);
```

## Installation

    $ npm install nodetpl

## method

  * precompile(tpl)
  * templete(path, tpl)
  * tplcompile(html[, data])

## Quick start

```js
var nodetpl = require('nodetpl');

var output, input;
input = '<?if(@username){?>' +
          '<p>Hello <?=@username?>, now is <?=new Date()?>.</p>' +
        '<?}?>';
output = nodetpl.tplcompile(input, {
  username: "Tom"
});
console.log(output);
```

It will output this log:
```
<p>Hello Tom, now is Wed Jun 18 2014 11:57:23.</p>
```

## In Browser
```
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<script type="text/javascript" src="../nodetpl.client.js"></script>
</head>
<body>
<script id="clientcode" type="text/nodetpl">
<p>Hello, <?=@user?>.</p>
<ul>
  <?for(var i=0; i<@favor.length; i++){?>
    <li><?=@favor[i]?></li>
  <?}?>
</ul>
</script>
<div id="clienthtml">

</div>
<script type="text/javascript">
var code = document.getElementById('clientcode');
var html = document.getElementById('clienthtml');
var data = {
  "user": "Tom",
  "favor": [ "Apple", "Orange", "Bananer" ]
};
NodeTpl.render(code.innerHTML, data, function(d){
  html.innerHTML = d;
});
</script>
</body>
</html>
```
The result is:

Hello, Tom.
  * Apple
  * Orange
  * Bananer

## Local compile demo
### Write a nodetpl template file
```html
<style>
{width:500px;}
.title{font-size:14px;}
.content{border: 1px solid #ccc;padding:10px;}
.content a{text-decoration:underline;}
</style>
<div id="$ROOT">
  <div class="title">This is a test.</div>
  <div class="content">
    Welcome back, this is my first <a href="https://github.com/pillys/nodetpl">nodetpl</a> template
  </div>
</div>
<script>
$ROOT.find('.title').css({
  "font-weight": "bold"
});
</script>
```
Save it as tpls/hello-world.tpl

### Compile tpl file with node
```js
var fs = require('fs'),
    path = require('path'),
    nodetpl = require('nodetpl');

var tplpath = __dirname + '/tpls/hello-world.tpl',
    jspath = tplpath.replace('.tpl', '.js');
fs.readFile(tplpath, "utf-8", function (err, text) {
  var nspath = jspath.replace(__dirname + '/tpls', '').replace(/\\/g, '/');
  !err && fs.writeFile(jspath, nodetpl.templete(nspath, nodetpl.precompile(text)), 'utf-8');
});
```

Save it as test.js, then run it with node, it will auto create a hello-wold.js in dir tpls/:

```js
(function(N, undefined){
  var PATH = '/hello-world.js';
  if(!N || !N._tpls) return false;
  N._tpls[PATH] = N._tpls[PATH] ||
{
  "main": function($DATA, guid){
    var css = '', dguid = N.dguid();
    var template = {
      init: function(){
        this.v8 = !!''.trim;
        this.result = this.v8 ? '' : [];
      },
      push: function(str){
        this.v8 ? (this.result += str) : this.result.push(str);
      },
      html: function(){
        return this.v8 ? this.result : this.result.join('');
      }
    };
    guid = guid || N.guid();
    template.init();
    css += '#' + guid + '{width:500px;}';
    css += '#' + guid + ' .title{font-size:14px;}';
    css += '#' + guid + ' .content{border: 1px solid #ccc;padding:10px;}';
    css += '#' + guid + ' .content a{text-decoration:underline;}';
    if(N.ie6){
      N._fixcss(css);
    } else {
      template.push('<style>' + css + '</style>');
    }
    template.push('<div id="'+ guid +'">\n  <div class="title">This is a test.</div>\n  <div class="content">\n    Welcome back, this is my first <a href="https://github.com/pillys/nodetpl">nodetpl</a> template\n  </div>\n</div>');
    template.push('<script>');
    template.push('(function(window, document, undefined){\n');
    template.push('  var $ROOT = $("#'+ guid +'");\n');
    template.push('  var $TPLS = NodeTpl._tpls["'+ PATH +'"];\n');
    template.push('  var $DATA = NodeTpl._data["'+ dguid +'"];\n');
    template.push('$ROOT.find(\'.title\').css({\n');
    template.push('  "font-weight": "bold"\n');
    template.push('});\n');
    template.push('})(window, document);\n');
    template.push('delete NodeTpl._data["'+ dguid +'"];\n');
    template.push('</script>\n');
    $DATA && (N._data[dguid] = $DATA);
    return template.html();
  }
};
})(window.NodeTpl);
```

### Used for Express.js
```js
app.set('view engine', 'tpl');
app.set('views', __dirname + '/views');
app.engine('tpl', require('nodetpl').express.render);

app.get('/', function(req, res){
  res.render('index', {
    "user": "Tom",
    "favor": [ "Apple", "Orange", "Bananer" ]
  }, function(err, html){
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
});
```