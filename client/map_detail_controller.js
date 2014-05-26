Maps = new Meteor.Collection("maps")
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
    Template.map.rendered = function() {
      canvas = $('#map-detail-canvas')[0]
      handleClick = (function() {
        var state = 'waitForRectangleFirstClick'
        var rectangleFirstPos
        var stage = new createjs.Stage('map-detail-canvas')
        var currentRectangleData
        var ls = LocationService
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
  },
  data: function() {
    return Maps.findOne({name: this.params.name})
  }
})