Maps = new Meteor.Collection('maps')
Locations = new Meteor.Collection('locations')

var locationService
var mapDetailService = new MapDetailService()
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
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
    mapDetailService.drawMap(function(mapImage) {
      mapDetailService.drawExistingLocations()
      mapDetailService.setCanvasSize(mapImage)
    })
  }
})