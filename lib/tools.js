var fs = require('fs');
var path = require('path');
var async = require('async');
var fsPath = require('fs-path');
var nodetpl = require('./index');
var argv = require('minimist')(process.argv.slice(2));
var mode = 'file';
var userPath;
var compileRoot;

console.log('Hello, nodetpl.');
// nodetpl /usr/local/tpls/a/b/c.tpl -r /tpls/a/b/c.js
// nodetpl /user/local/tpls          -r /tpls/
async.waterfall([
  function(callback) {
    if (!argv.r) {
      callback(new Error('-r cann\'t be empty.'));
    } else if (!/^(https?:)?\/{1,2}/.test(argv.r)) {
      callback(new Error('-r must be start with \/ or http.'));
    } else {
      compileRoot = argv.r;
      console.log('>> dist: ' + compileRoot);
      callback(null);
    }
  },
  function(callback) {
    if (argv._.length === 0) {
      callback('tpl path cann\'t be empty.');
    } else {
      userPath = argv._[0];
      if (!path.isAbsolute(userPath)) {
        userPath = path.join(process.cwd(), userPath);
      }
      userPath = userPath.replace(/\/$/, '');
      callback(null);
    }
  },
  function(callback) {
    fs.exists(userPath, function(exists) {
      if (exists) {
        console.log('>> from: ' + userPath);
        callback(null);
      } else {
        callback('path ' + userPath + ' not exists.');
      }
    });
  },
  function(callback) {
    fs.stat(userPath, function(err, stats) {
      if (stats.isDirectory()) {
        mode = 'directory';
      }
      callback(null);
    });
  },
  function(callback) {
    if (mode === 'directory') {
      fsPath.find(userPath, function(filepath, stats, filename) {
        return !/^\./.test(filename) && (stats === 'directory' || /\.tpl$/.test(filename));
      }, function(err, list) {
        if (err) {
          callback(err);
        } else {
          callback(null, list.files);
        }
      });
    } else {
      callback(null, [userPath]);
    }
  },
  function(files, callback) {
    async.eachSeries(files, function(filepath, callback) {
      fs.readFile(filepath, 'utf-8', function(err, data) {
        if (err) {
          callback(err);
        } else {
          var dist, content;
          if (mode === 'directory') {
            dist = compileRoot + filepath.replace(userPath, '').replace(compileRoot, '');
          } else {
            dist = compileRoot;
          }
          dist = dist.replace(/tpl$/, 'js');
          content = nodetpl.compile(dist, data);
          console.log('>> file: ' + filepath);
          fs.writeFile(filepath.replace(/tpl$/, 'js'), content, 'utf-8', callback);
        }
      });
    }, function(err) {
      callback(err);
    });
  }
], function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('done.');
  }
});