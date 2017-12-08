module.exports = {
  path: '/pageSection',
  args: {
    page: '/page'
  },
  fn: function(args) {
    console.log('setting pageSection from model');
    return '';
  }
}
