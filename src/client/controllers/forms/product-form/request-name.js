module.exports = {
  args: {
    description: '/product/new/description'
  },
  fn: function(args, lib) {

    if (!args.price) return;

    if (!lib.get('/product/new/name')) return {
      op: 'add',
      path: '/product/new/hasErr/name',
      value: 'required field'
    }
  }
}
