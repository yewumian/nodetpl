# Read me

  Fast, easy use javascript template engine based on [node](http://nodejs.org).

```js
var nodetpl = require('nodetpl');

var output, input;
input = '<?if(true){?>Now is <?=new Date()?>.<?}?>';
output = nodetpl.precompile(input);

console.log(nodetpl.templete('/hello-world.js', output);
```

## Installation

    $ npm install nodetpl

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