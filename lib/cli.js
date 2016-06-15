var fs = require('fs');
var path = require('path');
var async = require('async');
var fsPath = require('fs-path');
var iconv = require('iconv-lite');
var nodetpl = require('./nodetpl');
var beautify = require('js-beautify').js_beautify;
var argv = require('minimist')(process.argv.slice(2));
var index = 0;
var version = nodetpl.version;
var filemode = 'file';
var options = {
  extname: '.tpl',
  path: '',
  root: '',
  watch: false,
  strict: true,
  encoding: 'utf-8'
};

/**
 * precompile
 * grammer: nodetpl <path> ...
 *  --ext: extentions, by default: .tpl
 *  --watch: watch file changes
 *  --no-strict: no strict mode
 *  --encoding: file encoding, default utf-8
 */
console.log('\n<? Hello, nodetpl ' + version + ' is working... ?>\n');
async.waterfall([
  function(callback) {
    var output = argv.o,
      extname = argv.ext || argv.extname,
      watch = argv.watch,
      noStrict = argv.nostrict,
      encoding = argv.encoding;
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
    if (watch !== undefined) {
      options.watch = true;
    }
    console.log('>> watch mode: ' + options.watch);
    // strict mode
    if (noStrict !== undefined) {
      options.strict = false;
      nodetpl.config({
        strict: false
      });
    }
    console.log('>> strict mode: ' + options.strict);
    // encoding
    if (encoding) {
      options.encoding = encoding;
    }
    console.log('>> encoding: ' + options.encoding);
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
        filemode = 'directory';
      }
      callback(null);
    });
  },
  function(callback) {
    if (filemode === 'directory') {
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
        index++;
        fs.readFile(filepath, function(err, data) {
          if (err) {
            callback(err);
          } else {
            var content, distPath, distName;
            distPath = filepath.replace(/\.[a-zA-Z\d-]+$/, '.js');
            distName = path.basename(distPath);
            data = iconv.decode(data, options.encoding);
            content = nodetpl.compile(data);
            content = beautify(content, {
              indent_size: 2
            });
            content = iconv.encode(content, options.encoding);
            console.log('>> [' + index + ']\tfile: ' + filepath + ' -> ' + distName);
            fs.writeFile(distPath, content, null, callback);
          }
        });
      };
      compile(callback);
      options.watch && fs.watchFile(filepath, function(curr, prev) {
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