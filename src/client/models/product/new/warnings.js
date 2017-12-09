
module.exports = {
  path: '/product/new/warnings',
  args: {
    data: '/product/new/data'
  },
  fn: ({ data }) => {
    if (!data) {
      return
    }
    let required = ['name', 'price', 'manufacturer', 'image', 'description'];

    let keysOfTouchedInputs = Object.keys(data);
    if (keysOfTouchedInputs.length < 2) return;

    let keysOfCompletedInputs = keysOfTouchedInputs.filter(function(key, idx, arr) {
      if (!!data[key]) return true;
    })
    if (keysOfCompletedInputs.length < 2) return;

    let keysOfSuspectInputs = required.slice(); // make copy of required array-object
    let lastCompletedKey = keysOfCompletedInputs.pop();

    //remove some suspects
    keysOfSuspectInputs.splice(keysOfSuspectInputs.indexOf(lastCompletedKey));

    let warningKeys = keysOfSuspectInputs.reduce(function(acc, el, idx, arr) {
      if (keysOfCompletedInputs.indexOf(el) != -1) return acc;
      acc.push(el);
      return acc;
    }, []);

    return warningKeys
  }
}
