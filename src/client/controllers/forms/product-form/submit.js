
const required = ['name', 'price', 'manufacturer', 'image', 'description'];

module.exports = {
  args: {
    submit: '/product/new/submit'
  },
  fn: function({ submit }, { get }) {

    if (!submit) {
      return
    }

    let data = get('/product/new/data')

    if (!data || !data.name) {
      return [{
          op: 'add',
          path: '/product/new/errors',
          value: {
            name: 'Please add a name'
          }
        }
        // ,{
        //   op: 'remove',
        //   path: '/product/new/submit',
        // }
      ]
    }

    let ref = FIREBASE.database().ref('/products').push();
    data._id = ref.key;
    data.manufacturer = {
      name: data.manufacturer
    }
    return ref.set(data).then(x => { 
      return [{
        op: 'remove',
        path: '/product/new'
      }, {
        op: 'add',
        path: '/router/location',
        value: 'admin-product-list'
      }]
    })

  }
}
