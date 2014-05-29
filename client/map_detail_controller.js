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
    if(Session.get('template') == 'rendered') {
      mapDetailService.drawMap(function(mapImage) {
        mapDetailService.drawExistingLocations()
        mapDetailService.setCanvasSize(mapImage)
      })
    }
  }
})

function setTemplateBindings() {
  Template.map.mode = function() {
    return Session.get('mode')
  }
  Template.map.location = function() {
    return Session.get('location')
  }
  Session.set('mode', 'Choose!')
}

function setTemplateEventHandlers() {
  Template.map.events = {
    'click #map-detail-canvas': function($click) {
      if(Session.get('mode') == 'create') {
        mapDetailService.handleCreateClick()
      }
    },
    'mousewheel #map-detail-canvas': function(event) {
      var direction = event.originalEvent.deltaY > 0 ? 'down' : 'up'
      mapDetailService.zoom(direction)
    },
    'click .side-actions .create': function() {
      Session.set('mode', 'create')
    },
    'click .side-actions .delete': function() {
      Session.set('mode', 'delete')
    },
    'click .location-detail .delete-from-db': function() {
      var location = Session.get('location')
      Locations.remove({_id: location._id})
      Session.set('location', null)
    }
  }
}