CanvasService = function() {
  this.getRectangleCenter = function(currentRectangleData) {
    var crd = currentRectangleData
    return { x: crd.x + crd.width/2, y: crd.y + crd.height/2 }
  }
  this.drawRectangle = function (stage, from, to) {
    var shape = new createjs.Shape();
    shape.graphics.beginStroke("black");
    var currentRectangleData = {
      x: from.x,
      y: from.y,
      width: to.x-from.x,
      height: to.y-from.y
    }
    var crd = currentRectangleData
    shape.graphics.drawRect(crd.x, crd.y, crd.width, crd.height);
    stage.addChild(shape)
    stage.update()
    return currentRectangleData
  }
  this.drawLine = function(stage, from, to) {
    var shape = new createjs.Shape();
    shape.graphics.beginStroke('red')
    shape.graphics.mt(from.x, from.y).lineTo(to.x, to.y)
    stage.addChild(shape)
    stage.update()
    return { from: from, to: to }
  }
  this.getMousePos = function(stage) {
    return {x: stage.mouseX, y: stage.mouseY}
  }
  this.getCanvasCoordinates = function(canvas) {
    return canvas.getBoundingClientRect()
  }
}