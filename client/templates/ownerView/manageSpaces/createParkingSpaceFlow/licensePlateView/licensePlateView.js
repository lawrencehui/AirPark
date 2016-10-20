Template.licensePlateView.onCreated(function(){
  // this.licensePlateInput = new ReactiveVar();
});

Template.licensePlateView.onRendered(function(){
  deferFocus($('#licensePlate'));
  if(Session.get('licensePlate_value')){
    $('#licensePlate').val(Session.get('licensePlate_value'));
  }
});


Template.licensePlateView.events({
  'blur #licensePlate': function(event, template) {
    Session.set("licensePlate_value", $('#licensePlate').val().toUpperCase());
  }
});
