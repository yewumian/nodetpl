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