Router.map(function() {
  this.route('maps', {
    path: '/',
    controller: MapsController
  })
  this.route('map.detail', {
    path: '/maps/:name',
    controller: MapDetailController
  })
})