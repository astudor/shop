
module.exports = {
  // path: '/cart/count'   -- nu e nevoie sa pun pt ca il face automat din structura fisierelor
  // puteam sa scriu, daca vroiam unul custom, diferit de '/cart/count'
  args: {
    items: '/cart/items'
  },
  fn: ({ items }) => items ? Object.keys(items).length : 0
}
