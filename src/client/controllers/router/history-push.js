module.exports = {
  args: {
    location: '/router/location'  //should listen to router/page and be careful about admin index case
  },
  fn: ({ location }, lib) => {

    if (!location) {
      return []
    }

    let parts = location.split('-')

    if (!parts || !parts[0]) {
      return
    }

    if (parts[1] == 'index') {
      parts = parts[0] == 'admin' ? 'admin' : ''
    } else {
      parts.shift()
      parts = parts.join('-')
    }


    console.log('parts: ', parts);

    history.pushState({ page: parts }, '', window.location.origin + '/' + parts)

    // cum fac sa functioneze history.back() history.forward() history.go(n) ?

    return []
  }
}
