LocationService = function(canvas) {
  //we make it a function so we can init it when template is rendered (so canvas actually exists)
  var canvasService = new CanvasService()
  window.stage = new createjs.Stage('map-detail-canvas')
  var firstClick, shape, currentClick, crd
  stage.on('pressmove', function() {
    if(firstClick == undefined) {
      firstClick = canvasService.getMousePos(stage)
    } else {
      var currentClick = canvasService.getMousePos(stage)
      if(shape) {
        stage.removeChild(shape)
        rectangle = canvasService.drawRectangle(stage, firstClick, currentClick)
        shape = rectangle.shape
        crd = rectangle.data
      } else {
        shape = canvasService.drawRectangle(stage, firstClick, currentClick)
      }
    }
  })

  stage.on('click', function() {
    if(userHasJustDrawnARegion()) {
      var lineOrigin = canvasService.getRectangleCenter(crd)
      var lineDest = canvasService.getMousePos(stage)
      var lineCoords = canvasService.drawLine(stage, lineOrigin, lineDest)
      var locationId = insertLocation(crd, lineCoords)
      var location = Locations.findOne({ _id: locationId })
      Session.set('location', location)
      shape = null
    }

    function userHasJustDrawnARegion() {
      return shape
    }

    function insertLocation(currentRectangleData, lineCoords) {
      var cc = canvasService.getCanvasCoordinates(canvas)
      var location = {
        canvas: {
          x: cc.left,
          y: cc.top
        },
        rectangle: currentRectangleData,
        arrow: lineCoords,
        mapName: Session.get('currentMap').name
      }
      return Locations.insert(location)
    }

  })

  stage.on('pressup', function() {
    firstClick = undefined
  })

  this.drawLocation = function(location) {
    if(location.rectangle) {
      var from = { x: location.rectangle.x, y: location.rectangle.y }
      var to = { x: from.x + location.rectangle.width, y: from.y + location.rectangle.height }
      canvasService.drawRectangle(stage, from, to, location._id)
      canvasService.drawLine(stage, location.arrow.from, location.arrow.to)
    }
  }

  this.zoom = function(direction) {
    var mouseCoords = canvasService.getMousePos(stage)
    var zoomFactor = 0.2
    if(direction == 'down') { zoomFactor = -zoomFactor }
    var xZoom = stage.scaleX + zoomFactor
    var yZoom = stage.scaleY + zoomFactor
    stage.setTransform(mouseCoords.x, mouseCoords.y, xZoom, yZoom, 0, 0, 0, mouseCoords.x, mouseCoords.y)
    stage.update()
  }
}