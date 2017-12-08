module.exports = {
  args: {
    item: '/products/removeItem',
  },
  fn: function({item}) {
    FIREBASE.database().ref('products/' + item).remove()
  }
}
