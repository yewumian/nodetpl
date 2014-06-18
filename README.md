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

Save it as server.js, then run it with node, it will auto create a hello-wold.js in dir tpls/:

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