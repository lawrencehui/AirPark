Template.myGarage.helpers({

});

Template.myGarage.events({
  'click .garage-edit-button': function(event, template){
    console.log(this)
    Session.set('editingCarObj', this)
    Router.go('/editCar');
  },
  'click .add-car-button': function(){
    Router.go('/addCar');
  }
});

Template.myGarage.onCreated(function(){

});

Template.myGarage.onRendered(function(){

});
