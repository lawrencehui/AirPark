Template.floorView.onCreated(function(){
  // this.floorInput = new ReactiveVar();
});

Template.floorView.onRendered(function(){
  deferFocus($('#spacefloor'));
  if(Session.get('spaceFloor_value')){
    $('#spacefloor').val(Session.get('spaceFloor_value'));
  }
});



Template.floorView.events({
  // 'click #navDoneBtn': function(event, template) {
  //   //do checking on
  //
  //   template.floorInput.set($('#spacefloor').val());
  //   console.log('floorInput: ' + template.floorInput.get());
  //   //Router.go('');
  // },
  'blur #spacefloor': function(event, template) {
    Session.set("spaceFloor_value", $('#spacefloor').val());
    // console.log(Session.get("spaceFloor_value"));
  }
});
