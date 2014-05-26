LocationService = function(canvas) {
  //we make it a function so we can init it when template is rendered (so canvas actually exists)
  var stage = new createjs.Stage('map-detail-canvas')
  var canvasService = new CanvasService()

  this.handleClick = (function() {
    var state = 'waitForRectangleFirstClick'
    var rectangleFirstPos
    var currentRectangleData
    return function($click){
      if(state == 'waitForRectangleFirstClick') {
        rectangleFirstPos = canvasService.getMousePos(stage)
        state = 'waitForRectangleSecondClick'
      } else if(state == 'waitForRectangleSecondClick') {
        currentRectangleData = canvasService.drawRectangle(stage, rectangleFirstPos, canvasService.getMousePos(stage))
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
  })()

  this.drawLocation = function(location) {
    var from = { x: location.rectangle.x, y: location.rectangle.y }
    var to = { x: from.x + location.rectangle.width, y: from.y + location.rectangle.height }
    canvasService.drawRectangle(stage, from, to)
    canvasService.drawLine(stage, location.arrow.from, location.arrow.to)
  }
}