Maps = new Meteor.Collection('maps')
Locations = new Meteor.Collection('locations')

var locationService
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
    Template.map.rendered = function() {
      window.canvas = $('#map-detail-canvas')[0]
      locationService = new LocationService(canvas)
    }
    Template.map.mode = function() {
      return Session.get('mode')
    }
    Template.map.location = function() {
      return Session.get('location')
    }
    Session.set('mode', 'delete')
    Template.map.events = {
      'click #map-detail-canvas': function($click) {
        if(Session.get('mode') == 'create') {
          locationService.handleCreateClick()
        }
      },
      'mousewheel #map-detail-canvas': function(event) {
        var direction = event.originalEvent.deltaY > 0 ? 'down' : 'up'
        locationService.zoom(direction)
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

      }
    }

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
    drawMap()
    drawExistingLocations()
    setCanvasSize()

    function setCanvasSize() {
      var ctx = canvas.getContext('2d');
      var imageBounds = Session.get('imageBounds')
      ctx.canvas.width  = imageBounds.width;
      ctx.canvas.height = imageBounds.height;
      stage.update()
    }

    function drawMap() {
      var image = new createjs.Bitmap(Session.get('currentMap').imagePath);
      Session.set('imageBounds', image.getBounds())
      stage.addChild(image)
      stage.update()
    }

    function drawExistingLocations() {
      Session.get('locations').forEach(function(location) {
        locationService.drawLocation(location)
      })
    }
  }
})