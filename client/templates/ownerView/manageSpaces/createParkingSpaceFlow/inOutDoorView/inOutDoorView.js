Template.inOutDoorView.helpers({
  Next: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Next';
    }
  }
});

Template.inOutDoorView.onRendered(function(){
  if(Router.current().params.query.spaceId){
		var currentSpace = ParkingSpaces.findOne({_id: Router.current().params.query.spaceId});
    $('input[type="radio"][value=' + currentSpace.parkingAreaType + ']').prop('checked', true);
	} else {
    $('input[type="radio"][value=0]').prop('checked', true);
  }
});

Template.inOutDoorView.events({
  // 'change input[type="radio"]': function(event, template) {
  //   var choice = template.$(event.target).attr("data");
  //   // template.inOutDoorValue.set(choice);
  //   Session.set("parkingArea_value", choice);
  // }
});

Template.inOutDoorView.onCreated(function(){
	if(Router.current().params.query.spaceId){
    var spaceId = Router.current().params.query.spaceId
    Meteor.subscribe('ParkingSpacesByID', spaceId)
  }
})
