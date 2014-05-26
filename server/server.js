Maps = new Meteor.Collection('maps')
Locations = new Meteor.Collection('locations')

Meteor.publish('maps', function () {
  return Maps.find()
})

Meteor.publish('locations-for-map', function(mapName) {
  return Locations.find({ mapName: mapName })
})