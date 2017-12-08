

module.exports = {
  args: {
    item: '/cart/addItem'
  },
  fn: ({ item }, lib) => {

      /*
    let ajax from '@fdckih/ajax'
    ajax({
      url: 'mydomain/addItem',
      method: 'POST',
      data: {
        productId: item
      }
    }).then(x => ())
    */

    FIREBASE.database().ref('cart/' + item).set({
      addedOn: Date.now() // is it recommended to put the timestamp? why?
    })

    return []
  }
}
