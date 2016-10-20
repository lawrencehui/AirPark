Template.addCar.helpers({
  backPath: function(){
    if(Router.current().params.query.back == 'selectCar'){
      return 'selectCar'
    } else {
      return 'myGarage'
    }
  }
});

Template.addCar.events({
});

Template.addCar.onCreated(function(){
});

Template.addCar.onRendered(function(){
})
