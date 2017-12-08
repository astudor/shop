module.exports = {
  args: {
    submit: '/product/new/submit',
    data: '/product/new/data'
  },
  fn: function(args, lib) {

    return

    
    let required = ['name', 'price', 'manufacturer', 'image', 'description'];
    /*
       Given a user

    */

    let touched = lib.get('/product/new'); // '/product/new' should contain ONLY values from inputs
    if (touched.manufacturer) touched.manufacturer = touched.manufacturer.name;

    let touchedKeys = Object.keys(touched);
    if (touchedKeys.length < 2) return;

    let completedKeys = touchedKeys.filter(function(key, idx, arr) {
      if (!!args[key]) return true;
    })
    if (completedKeys.length < 2) return;

    let suspectKeys = required.slice();
    let lastCompletedKey = completedKeys.pop();

    //remove some suspects
    suspectKeys.splice(suspectKeys.indexOf(lastCompletedKey))

    let warningKeys = suspectKeys.reduce(function(acc, el, idx, arr) {
      if (completedKeys.indexOf(el) != -1) return acc;
      acc.push(el);
      return acc;
    }, []);

    console.log('warningKeys: ', warningKeys);

    return {
      op: 'add',
      path: '/inputErr',
      value: warningKeys
    }
    function hasValue(x) {
      return !!args[x];
    }

    if (required.every(hasValue)) {
      let newItem = {
        name: args.name,
        price: args.price,
        manufacturer: {
          name: args.manufacturer
        },
        image: args.image,
        description: args.description
      }

      let db = FIREBASE.database().ref('/products');
      let ref = db.push(newItem);
      ref._id = ref.key;
      ref.set(x);

      // return {
      //   op: 'replace',
      //   path: [args.name],
      //   value: ''
      // }

    }





  }

}
