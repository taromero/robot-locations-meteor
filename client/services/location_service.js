LocationService = function(canvas) {
  //we make it a function so we can init it when template is rendered (so canvas actually exists)
  var handleClick = (function() {
    var state = 'waitForRectangleFirstClick'
    var rectangleFirstPos
    var stage = new createjs.Stage('map-detail-canvas')
    var currentRectangleData
    var cs = CanvasService
    return function($click){
      if(state == 'waitForRectangleFirstClick') {
        rectangleFirstPos = cs.getMousePos(canvas, $click)
        state = 'waitForRectangleSecondClick'
      } else if(state == 'waitForRectangleSecondClick') {
        currentRectangleData = cs.drawRectangle(stage, rectangleFirstPos, cs.getMousePos(canvas, $click))
        state = 'waitForArrowClick'
      } else if(state == 'waitForArrowClick') {
        var from = cs.getRectangleCenter(currentRectangleData)
        cs.drawLine(stage, from, cs.getMousePos(canvas, $click))
        state = 'waitForRectangleFirstClick'
      }
    }
  })()
  return {
    handleClick: handleClick
  }
}