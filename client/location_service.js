LocationService = {
  getRectangleCenter: function(currentRectangleData) {
    var crd = currentRectangleData
    return { x: crd.x + crd.width/2, y: crd.y + crd.height/2 }
  },
  drawRectangle: function (stage, from, to) {
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
  },
  drawLine: function(stage, from, to) {
    var shape = new createjs.Shape();
    shape.graphics.beginStroke('red')
    shape.graphics.mt(from.x, from.y).lineTo(to.x, to.y)
    stage.addChild(shape)
    stage.update()
  },
  getMousePos: function(canvas, $click) {
    var rect = canvas.getBoundingClientRect();
    return {x: $click.clientX - rect.left, y: $click.clientY - rect.top};
  }
}