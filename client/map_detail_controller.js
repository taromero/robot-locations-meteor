Maps = new Meteor.Collection("maps")
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
    var ls
    Template.map.rendered = function() {
      canvas = $('#map-detail-canvas')[0]
      ls = LocationService(canvas)
    }
    Template.map.events = {
      'click #map-detail-canvas': function($click){
          ls.handleClick($click)
      }
    }
  },
  data: function() {
    return Maps.findOne({name: this.params.name})
  }
})