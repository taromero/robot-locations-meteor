Maps = new Meteor.Collection('maps')
Locations = new Meteor.Collection('locations')

var mapDetailService = new MapDetailService()
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
    Template.map.rendered = function() {
      window.canvas = $('#map-detail-canvas')[0]
      locationService = new LocationService(canvas)
      Session.set('rendered', true)
    }
    mapDetailService.setTemplateBindings()
    mapDetailService.setTemplateEventHandlers()
  },
  waitOn: function() {
    return Meteor.subscribe('maps') &&
           Meteor.subscribe('locations-for-map', this.params.name)
  },
  data: function() {
    var currentMap = Maps.findOne({name: this.params.name})
    var locations = Locations.find().fetch()
    Session.set('currentMap', currentMap)
    Session.set('locations', locations)
    return {
      map: currentMap,
      locations: locations
    }
  },
  onData: function() {
    if(Session.get('rendered')) {
      mapDetailService.drawMap(function(mapImage) {
        mapDetailService.drawExistingLocations()
        mapDetailService.setCanvasSize(mapImage)
      })
    }
  }
})