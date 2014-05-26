if (Meteor.isClient) {
  var canvas;

  var LocationService = {
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

  var ls = LocationService
  var handleClick;

  MapContoller = RouteController.extend({
    action: function() {
      this.render('map')
      Template.map.rendered = function() {
        canvas = canvas = $('#map-detail-canvas')[0]
        console.log('canvas ' , canvas);
        setCanvasDimensions()
        function setCanvasDimensions() {
          canvas.height = 542
          canvas.width = 425
        }
        handleClick = (function() {
            var state = 'waitForRectangleFirstClick'
            var rectangleFirstPos
            var stage = new createjs.Stage('map-detail-canvas')
            var currentRectangleData
            return function($click){
              console.log('$click ' , $click);
              if(state == 'waitForRectangleFirstClick') {
                rectangleFirstPos = ls.getMousePos(canvas, $click)
                state = 'waitForRectangleSecondClick'
              } else if(state == 'waitForRectangleSecondClick') {
                currentRectangleData = ls.drawRectangle(stage, rectangleFirstPos, ls.getMousePos(canvas, $click))
                state = 'waitForArrowClick'
              } else if(state == 'waitForArrowClick') {
                var from = ls.getRectangleCenter(currentRectangleData)
                ls.drawLine(stage, from, ls.getMousePos(canvas, $click))
                state = 'waitForRectangleFirstClick'
              }
            }
          })()
      }
      Template.map.events = {
        'click #map-detail-canvas': function($click){
            handleClick($click)
        }
      }
    }
  })

  Router.map(function() {
    this.route('maps', {path: '/'})
    this.route('map', {
        path: '/map',
        controller: MapContoller
      });
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
