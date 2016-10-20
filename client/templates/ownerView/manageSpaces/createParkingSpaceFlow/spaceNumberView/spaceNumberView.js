Template.spaceNumberView.onCreated(function(){
  // this.spaceNumberInput = new ReactiveVar();
});

Template.spaceNumberView.onRendered(function(){
  deferFocus($('#spaceNumber'));
  if(Session.get('spaceNumber_value')){
    $('#spaceNumber').val(Session.get('spaceNumber_value'));
  }

});



Template.spaceNumberView.events({
  'blur #spaceNumber': function(event, template) {
    Session.set("spaceNumber_value", $('#spaceNumber').val().toUpperCase());
  }
})
