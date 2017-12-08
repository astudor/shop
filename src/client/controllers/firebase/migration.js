
module.exports = {
  args: {
    init: '/firebase/init'
  },
  fn: ({ init }) => {

    return [] // stops here ?

    let products = [{
         "_id": "5a12f4f8301ef20004561c11",
         "name": "Xperia XA",
         "price": 299,
         "manufacturer": {
             "_id": "58c158d83239f55b33ce492c",
             "name": "Sony"
         },
         "image": "http://imgur.com/IXOL7Su.jpg",
         "description": "123 Lorem ipsum dolor sit amet, magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
     }, {
         "_id": "5a12f4f8301ef20004561c13",
         "name": "One Plus 3T",
         "price": 455,
         "manufacturer": {
             "_id": "58c19d7d3239f55b33ce4a70",
             "name": "Google"
         },
         "image": "http://imgur.com/C7Vkk0l.jpg",
         "description": "456 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

     }, {
         "_id": "5a12f4f8301ef20004561c12",
         "name": "OnePlus 3",
         "price": 329,
         "manufacturer": {
             "_id": "58c19c873239f55b33ce4a6f",
             "name": "OnePlus"
         },
         "image": "http://imgur.com/C7Vkk0l.jpg",
         "description": "789 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

     }, {
         "_id": "5a12f4f8301ef20004561c14",
         "name": "Nexus 6P",
         "price": 515,
         "manufacturer": {
             "_id": "58c19d7d3239f55b33ce4a70",
             "name": "Google"
         },
         "image": "http://imgur.com/PFLgTPi.jpg",
         "description": "111 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

     }, {
         "_id": "5a133d39e918f200045d0dfa",
         "name": "portable de fou renan",
         "price": 80,
         "manufacturer": {
             "_id": "58c159143239f55b33ce492d",
             "name": "Apple"
         },
         "description": "Une petite description",
         "image": "http://www.gettyimages.fr/gi-resources/images/Embed/new/embed2.jpg",

     }]

     let db = FIREBASE.database().ref('products')

     products.forEach(x => {
       let ref = db.push()
       x._id = ref.key
       ref.set(x)
     })

     return []
  }
}
