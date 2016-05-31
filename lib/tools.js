'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var fsPath = require('fs-path');
var nodetpl = require('./index');
var argv = require('minimist')(process.argv.slice(2));
var options = {
  mode: 'file',
  extname: '.tpl',
  path: '',
  root: '',
  look: false,
  _index: 0,
  version: nodetpl.version
};

/**
 * 模板预编译
 * 语法：nodetpl <path> ...
 * -o <relativePath>：模板文件相对于项目根路径的路径，以 http 或 / 开头，可以省略
 *             --ext：模板后缀，默认为 .tpl
 *            --look：监控文件变化，当模板文件改变时，自动编译
 */
console.log('\n<? Hello, nodetpl ' + options.version + ' is working... ?>\n');
async.waterfall([
  function(callback) {
    var output = argv.o,
      extname = argv.ext,
      look = argv.look;
    // 模板路径
    if (argv._.length === 0) {
      callback('tpl path cann\'t be empty.');
      return false;
    }
    options.path = argv._[0];
    if (!path.isAbsolute(options.path)) {
      options.path = path.join(process.cwd(), options.path);
    }
    options.path = options.path.replace(/\/$/, '');
    // 输出（根）路径
    if (output && !/^(https?:)?\/{1,2}/.test(output)) {
      callback(new Error('-o must be start with \/ or http.'));
      return false;
    }
    options.root = output || '';
    console.log('>> dist: ' + (options.root || 'auto'));
    // 模板扩展名
    if (extname) {
      options.extname = extname;
    }
    console.log('>> extname: ' + options.extname);
    // 文件监听
    if (look !== undefined) {
      options.look = true;
    }
    console.log('>> look mode: ' + options.look);
    // final
    callback(null);
  },
  function(callback) {
    fs.exists(options.path, function(exists) {
      if (exists) {
        console.log('>> from: ' + options.path);
        callback(null);
      } else {
        callback('path ' + options.path + ' not exists.');
      }
    });
  },
  function(callback) {
    fs.stat(options.path, function(err, stats) {
      if (stats.isDirectory()) {
        options.mode = 'directory';
      }
      callback(null);
    });
  },
  function(callback) {
    if (options.mode === 'directory') {
      fsPath.find(options.path, function(filepath, stats, filename) {
        return !/^\./.test(filename) && (stats === 'directory' || path.extname(filepath) === options.extname);
      }, function(err, list) {
        if (err) {
          callback(err);
        } else {
          callback(null, list.files);
        }
      });
    } else {
      callback(null, [options.path]);
    }
  },
  function(files, callback) {
    async.eachSeries(files, function(filepath, callback) {
      var compile = function(callback) {
        options._index++;
        fs.readFile(filepath, 'utf-8', function(err, data) {
          if (err) {
            callback(err);
          } else {
            var dist, content, extMatch = new RegExp(options.extname.replace(/\./, '\\\.') + '$', 'g');
            if (options.root) {
              if (options.mode === 'directory') {
                dist = options.root + filepath.replace(options.path, '').replace(options.root, '');
              } else {
                dist = options.root;
              }
              dist = dist.replace(/\/+/g, '/').replace(extMatch, '.js');
            } else {
              dist = '';
            }
            content = nodetpl.compile(dist, data);
            console.log('>> [' + options._index + ']\tfile: ' + filepath);
            fs.writeFile(filepath.replace(extMatch, '.js'), content, 'utf-8', callback);
          }
        });
      };
      compile(callback);
      options.look && fs.watchFile(filepath, function(curr, prev) {
        compile(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('\t' + curr.mtime);
          }
        });
      });
    }, function(err) {
      callback(err);
    });
  }
], function(err) {
  if (err) {
    console.log(err);
  }
});