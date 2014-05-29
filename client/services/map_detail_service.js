var canvas
var locationService
MapDetailService = function() {
  canvas = $('#map-detail-canvas')[0]
  locationService = new LocationService(canvas)
  this.drawMap = drawMap
  this.drawExistingLocations = drawExistingLocations
  this.setCanvasSize = setCanvasSize
  this.handleCreateClick = locationService.handleCreateClick
  this.zoom = locationService.zoom
}

function drawMap(cb) {
  var mapImage = new createjs.Bitmap(Session.get('currentMap').imagePath);
  mapImage.image.onload = function() {
    stage.addChild(mapImage)
    stage.update()
    cb(mapImage)
  }
}

function drawExistingLocations() {
  Session.get('locations').forEach(function(location) {
    locationService.drawLocation(location)
  })
}

function setCanvasSize(mapImage) {
  var ctx = canvas.getContext('2d')
  var imageBounds = mapImage.getBounds()
  ctx.canvas.width  = imageBounds.width
  ctx.canvas.height = imageBounds.height
  stage.update()
}
