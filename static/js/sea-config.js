seajs.config({
  alias: {
    'es5-safe': 'lib/es5-sham.min',
    'jquery': 'lib/jquery-1.10.2',
    'vDialog': 'lib/vDialog.min',
    'nodetpl': 'lib/nodetpl.client'
  },
  preload: [
    Function.prototype.bind ? '' : 'es5-safe'
  ]
});