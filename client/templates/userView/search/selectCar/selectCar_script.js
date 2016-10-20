Template.selectCar.helpers({
});

Template.selectCar.events({
  'click .garage-content': function(event, template){
    Session.set('selectedCarObj', this);
    Router.go('bookingConfirmation');
  },
  'click .garage-edit-button': function(event, template){
    Session.set('editingCarObj', this)
    Router.go('/editCar?back=selectCar');
  }
});

Template.selectCar.onCreated(function(){
});

Template.selectCar.onRendered(function(){
})
