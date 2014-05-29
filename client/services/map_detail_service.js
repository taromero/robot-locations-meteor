MapDetailService = function() {
  this.drawMap = drawMap
  this.drawExistingLocations = drawExistingLocations
  this.setCanvasSize = setCanvasSize
  this.setTemplateBindings = setTemplateBindings
  this.setTemplateEventHandlers = setTemplateEventHandlers
}

function drawMap(cb) {
  var mapImage = new createjs.Bitmap(Session.get('currentMap').imagePath);
  mapImage.image.onload = function() {
    stage.addChild(mapImage)
    stage.update()
    cb(mapImage)
  }
}

function drawExistingLocations() {
  Session.get('locations').forEach(function(location) {
    locationService.drawLocation(location)
  })
}

function setCanvasSize(mapImage) {
  var ctx = canvas.getContext('2d')
  var imageBounds = mapImage.getBounds()
  ctx.canvas.width  = imageBounds.width
  ctx.canvas.height = imageBounds.height
  stage.update()
}

function setTemplateBindings() {
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
  Session.set('mode', 'Choose!')
}

function setTemplateEventHandlers() {
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
      Session.set('location', null)
    }
  }
}