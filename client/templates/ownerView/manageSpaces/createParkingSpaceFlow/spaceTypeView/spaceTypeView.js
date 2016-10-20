Template.spaceTypeView.helpers({
  Next: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Next';
    }
  }
});

Template.spaceTypeView.onRendered(function(){
  if(Router.current().params.query.spaceId){
		var currentSpace = ParkingSpaces.findOne({_id: Router.current().params.query.spaceId});
    $('input[type="radio"][value=' + currentSpace.spaceType + ']').prop('checked', true);
	} else {
    $('input[type="radio"][value=0]').prop('checked', true);
  }
});

Template.spaceTypeView.events({
  // 'change input[type="radio"]': function(event, template) {
  //   var choice = template.$(event.target).attr("data");
  //   // template.spaceTypeValue.set(choice);
  //   Session.set("spaceType_value", choice);
  // }
});

Template.spaceTypeView.onCreated(function(){
	if(Router.current().params.query.spaceId){
    var spaceId = Router.current().params.query.spaceId
    Meteor.subscribe('ParkingSpacesByID', spaceId)
  }
})
