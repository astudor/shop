module.exports = {
  args: {
    item: '/cart/removeItem'
  },
  fn: function({item}) {
      FIREBASE.database().ref('cart/' + item).remove()
  }
}
