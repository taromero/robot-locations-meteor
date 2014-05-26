Router.map(function() {
  this.route('maps', {path: '/'})
  this.route('map.detail', {
      path: '/map',
      controller: MapDetailContoller
    });
});