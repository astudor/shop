
module.exports = {
  args: {
    defaultLocation: '/router/default/guest'
  },
  fn: ({ defaultLocation }, lib) => {

    let location = lib.get('/router/location')

    if (!location) {
      return {
        op: 'add',
        path: '/router/location',
        value: defaultLocation
      }
    }

  }
}
