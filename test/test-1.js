var fs = require('fs'),
    path = require('path'),
    nodetpl = require('../nodetpl');

var tplpath = __dirname + '/tpls/hello-world.tpl',
    jspath = tplpath.replace('.tpl', '.js');
fs.readFile(tplpath, "utf-8", function (err, text) {
  var nspath = jspath.replace(__dirname + '/tpls', '').replace(/\\/g, '/');
  !err && fs.writeFile(jspath, nodetpl.templete(nspath, nodetpl.precompile(text)), 'utf-8');
});