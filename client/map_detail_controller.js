var mapDetailService
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
    Template.map.rendered = function() {
      Session.set('template', 'rendered')
      mapDetailService = new MapDetailService()
    }
    setTemplateBindings()
    setTemplateEventHandlers()
  },
  waitOn: function() {
    return Meteor.subscribe('maps') &&
           Meteor.subscribe('locations-for-map', this.params.name)
  },
  data: function() {
    var maps = Maps.find()
    var currentMap = Maps.findOne({name: this.params.name})
    var locations = Locations.find().fetch()
    Session.set('currentMap', currentMap)
    Session.set('locations', locations)
    return {
      maps: maps,
      map: currentMap,
      locations: locations
    }
  },
  onData: function() {
    if(Session.get('template') == 'rendered') {
      mapDetailService.drawMap(function(mapImage) {
        mapDetailService.drawExistingLocations()
        mapDetailService.setCanvasSize(mapImage)
      })
    }
  }
})

function setTemplateBindings() {
  Template.map.location = function() {
    return Session.get('location')
  }
}

function setTemplateEventHandlers() {
  Template.map.events = {
    //for chrome
    'mousewheel #map-detail-canvas': function(event) {
      var direction = event.originalEvent.deltaY > 0 ? 'down' : 'up'
      mapDetailService.zoom(direction)
    },
    //for FF
    'MozMousePixelScroll #map-detail-canvas': function(event) {
      var delta = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail);
      var direction = delta < 0 ? 'down' : 'up'
      mapDetailService.zoom(direction)
    },
    'click .location-detail .delete-from-db': function() {
      var location = Session.get('location')
      Locations.remove({_id: location._id})
      Session.set('location', null)
    }
  }
}