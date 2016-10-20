Template.editCar.helpers({
  modelText: function(){
    return Session.get('editingCarObj').model;
  },
  numberText: function(){
    return Session.get('editingCarObj').number;
  },
  backPath: function(){
    if(Router.current().params.query.back == 'selectCar'){
      return 'selectCar'
    } else {
      return 'myGarage'
    }
  }
});

Template.editCar.events({
  'click .delete-car-button': function(event, template){
    var r = confirm("Confirm delete this car?")
    if(r){
      Meteor.call('deleteCar', Meteor.userId(), Session.get('editingCarObj'))
      if(Router.current().params.query.back == 'selectCar'){
        Router.go('selectCar')
      } else {
        Router.go('/myGarage')
      }
    }
  }
});

Template.editCar.onCreated(function(){
});

Template.editCar.onRendered(function(){
})
