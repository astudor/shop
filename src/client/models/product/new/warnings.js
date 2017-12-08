
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

    let touchedKeys = Object.keys(data);
    if (touchedKeys.length < 2) return;

    let completedKeys = touchedKeys.filter(function(key, idx, arr) {
      if (!!data[key]) return true;
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

    return warningKeys
  }
}
