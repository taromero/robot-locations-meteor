Maps = new Meteor.Collection('maps')
Locations = new Meteor.Collection('locations')

var locationService
MapDetailController = RouteController.extend({
  action: function() {
    this.render('map')
    Template.map.rendered = function() {
      window.canvas = $('#map-detail-canvas')[0]
      setCanvasSize()
      locationService = new LocationService(canvas)
    }
    Template.map.events = {
      'click #map-detail-canvas': function($click) {
        locationService.handleClick()
      },
      'mousewheel #map-detail-canvas': function(event) {
        var direction = event.originalEvent.deltaY > 0 ? 'down' : 'up'
        locationService.zoom(direction)
      }
    }

    function setCanvasSize() {
      var ctx = canvas.getContext('2d');
      ctx.canvas.width  = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
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

    function drawMap() {
      var image = new createjs.Bitmap(Session.get('currentMap').imagePath);
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