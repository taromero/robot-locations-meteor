Maps = new Meteor.Collection('maps')
Locations = new Meteor.Collection('locations')

var ls
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
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
    var locations = Locations.find({}).fetch()
    Session.set('currentMap', currentMap)
    locations.forEach(function(location) {
      ls.drawLocation(location)
    })
    return {
      map: currentMap,
      locations: locations
    }
  }
})