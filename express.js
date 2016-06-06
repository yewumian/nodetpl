var fs = require('fs');
var nodetpl = require('./index');
module.exports = function(filepath, data, callback) {
  fs.readFile(filepath, 'utf-8', function(err, content) {
    if (err) {
      callback && callback(err);
    } else {
      nodetpl.render(content, data, function(result) {
        callback && callback(null, result);
      });
    }
  });
};