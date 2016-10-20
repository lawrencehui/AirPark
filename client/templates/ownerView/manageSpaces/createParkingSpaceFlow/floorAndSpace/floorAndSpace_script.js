Template.floorAndSpace.helpers({
	Next: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Next';
    }
  }
});

Template.floorAndSpace.events({
	});

Template.floorAndSpace.onRendered(function ( ){
	if(Router.current().params.query.spaceId){
		var currentSpace = ParkingSpaces.findOne({_id: Router.current().params.query.spaceId});
		$('#spacefloor').val(currentSpace.spaceFloor);
		$('#spaceNumber').val(currentSpace.spaceNum);
	}
});

Template.floorAndSpace.onCreated(function(){
	if(Router.current().params.query.spaceId){
    var spaceId = Router.current().params.query.spaceId
    Meteor.subscribe('ParkingSpacesByID', spaceId)
  }
})
