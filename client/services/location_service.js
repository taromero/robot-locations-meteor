LocationService = function(canvas) {
  //we make it a function so we can init it when template is rendered (so canvas actually exists)
  var stage = new createjs.Stage('map-detail-canvas')
  var cs = CanvasService
  var handleClick = (function() {
    var state = 'waitForRectangleFirstClick'
    var rectangleFirstPos
    var currentRectangleData
    return function($click){
      if(state == 'waitForRectangleFirstClick') {
        rectangleFirstPos = cs.getMousePos(canvas, $click)
        state = 'waitForRectangleSecondClick'
      } else if(state == 'waitForRectangleSecondClick') {
        currentRectangleData = cs.drawRectangle(stage, rectangleFirstPos, cs.getMousePos(canvas, $click))
        state = 'waitForArrowClick'
      } else if(state == 'waitForArrowClick') {
        var from = cs.getRectangleCenter(currentRectangleData)
        var lineCoords = cs.drawLine(stage, from, cs.getMousePos(canvas, $click))

        var cc = cs.getCanvasCoordinates(canvas)
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
  var drawLocation = function(location) {
    var from = { x: location.rectangle.x, y: location.rectangle.y }
    var to = { x: from.x + location.rectangle.width, y: from.y + location.rectangle.height }
    cs.drawRectangle(stage, from, to)
    cs.drawLine(stage, location.arrow.from, location.arrow.to)
  }
  return {
    handleClick: handleClick,
    drawLocation: drawLocation
  }
}