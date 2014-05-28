
LocationService = function(canvas) {
  //we make it a function so we can init it when template is rendered (so canvas actually exists)
  window.stage = new createjs.Stage('map-detail-canvas')
  var canvasService = new CanvasService()

  this.handleCreateClick = (function() {
    var state = 'waitForRectangleFirstClick'
    var rectangleFirstPos
    var currentRectangleData
    return function(){
      if(state == 'waitForRectangleFirstClick') {
        rectangleFirstPos = canvasService.getMousePos(stage)
        state = 'waitForRectangleSecondClick'
      } else if(state == 'waitForRectangleSecondClick') {
        var location = Locations.insert({})
        currentRectangleData = canvasService.drawRectangle(stage, rectangleFirstPos, canvasService.getMousePos(stage), location.id)
        state = 'waitForArrowClick'
      } else if(state == 'waitForArrowClick') {
        var from = canvasService.getRectangleCenter(currentRectangleData)
        var lineCoords = canvasService.drawLine(stage, from, canvasService.getMousePos(stage))

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

        Locations.insert(location)
        state = 'waitForRectangleFirstClick'
      }
    }

    this.handleDeleteClick = function() {

    }
  })()

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