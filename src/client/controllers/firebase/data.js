import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

module.exports = {
  args: {
    init: '/firebase/init'
  },
  fn: stream
    .filter(({ init }) => init) // evalueaza init la true/false?
    .chain((x, lib) => observer(o => {

      FIREBASE.database().ref('/products').on('child_added', saveData('products'))
      FIREBASE.database().ref('/products').on('child_changed', saveData('products'))
      FIREBASE.database().ref('/products').on('child_removed', removeData('products'))

      FIREBASE.database().ref('/cart').on('child_added', saveData('cart/items'))
      FIREBASE.database().ref('/cart').on('child_changed', saveData('cart/items'))

      FIREBASE.database().ref('/cart').on('child_removed', removeData('cart/items'))

      function saveData(location) {
        return function (x) {
          let val = x.val()
          o.next({
            op: 'add',
            path: `/${location}/${x.key}`,
            value: val
          })
        }
      }

      function removeData(location) {
        return function (x) {
          o.next({
            op: 'remove',
            path: `/${location}/${x.key}`
          })
        }
      }

    }))
}
