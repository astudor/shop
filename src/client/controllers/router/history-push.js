module.exports = {
  args: {
    page: '/router/location'
  },
  fn: ({ page }, lib) => {
    // let ignore = lib.get('/router/ignore') // why is 'home' ignored?
    // let location = lib.get('/router/location')

    if (!page) {
      return []
    }

    // if (ignore.indexOf(location) !== -1) {
    //   return []
    // }
    history.pushState({page: page}, '', window.location.origin + '/' + page)

    // cum fac sa functioneze history.back() history.forward() history.go(n) ?

    return []
  }
}
