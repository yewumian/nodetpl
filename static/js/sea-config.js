seajs.config({
  base: '/static/js/',
  alias: {
    'es5-safe': 'lib/es5-sham.min',
    'jquery': 'lib/jquery-1.10.2',
    'vDialog': 'lib/vDialog.min',
    'nodetpl': 'lib/nodetpl'
  },
  preload: [
    Function.prototype.bind ? '' : 'es5-safe'
  ]
});