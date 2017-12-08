
module.exports = {
  args: {
    location: '/router/location'
  },
  fn: ({ location }) => {
    if (!location) {
      return
    }

    let parts = location.split('-')

    if (!parts || !parts[0]) {
      return
    }

    return parts[0]
  }
}
