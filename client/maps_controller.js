MapsController = RouteController.extend({
  action: function() {
    this.render('maps')
  },
  waitOn: function() {
    return Meteor.subscribe('maps')
  },
  data: { maps: Maps.find({}) }
})