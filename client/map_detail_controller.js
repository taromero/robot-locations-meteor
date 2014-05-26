Maps = new Meteor.Collection('maps')
Locations = new Meteor.Collection('locations')

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
  waitOn: function() {
    return Meteor.subscribe('locations-for-map', this.params.name)
  },
  data: function() {
    var currentMap = Maps.findOne({name: this.params.name})
    Session.set('currentMap', currentMap)
    return currentMap
  }
})