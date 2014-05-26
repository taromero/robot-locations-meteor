Maps = new Meteor.Collection("maps")
Meteor.publish("maps", function () {
  return Maps.find()
});