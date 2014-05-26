Maps = new Meteor.Collection('maps')
Locations = new Meteor.Collection('locations')

var locationService
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
    Template.map.rendered = function() {
      canvas = $('#map-detail-canvas')[0]
      locationService = new LocationService(canvas)
    }
    Template.map.events = {
      'click #map-detail-canvas': function($click){
          locationService.handleClick($click)
      }
    }
  },
  waitOn: function() {
    Meteor.subscribe('maps')
    return Meteor.subscribe('locations-for-map', this.params.name)
  },
  data: function() {
    var currentMap = Maps.findOne({name: this.params.name})
    var locations = Locations.find().fetch()
    Session.set('currentMap', currentMap)
    drawExistingLocations()

    function drawExistingLocations() {
      locations.forEach(function(location) {
        locationService.drawLocation(location)
      })
    }
    return {
      map: currentMap,
      locations: locations
    }
  }
})