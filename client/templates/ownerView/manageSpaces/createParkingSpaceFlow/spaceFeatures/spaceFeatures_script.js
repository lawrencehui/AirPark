Template.spaceFeatures.helpers({
	Next: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Next';
    }
  }
});

Template.spaceFeatures.events({
	'change #noHeightRadio': function(event, template){
		if(event.target.checked){
			$('label.height-input').removeClass('checked');
		} else {
			$('label.height-input').addClass('checked');
		}
	},
	'click .height-input': function(event, template){
		console.log('clicked')
		console.log(event.target);
		console.log(event.currentTarget);
		// if($(event.target).hasClass('height-input')){
			$(event.currentTarget).addClass('checked');
			$('#noHeightRadio')[0].checked = false;
		// }
	}
});

Template.spaceFeatures.onRendered(function ( ){
	this.autorun(function(handle){
		if(Router.current().params.query.spaceId){
			console.log('run')
			var currentSpace = ParkingSpaces.findOne({_id: Router.current().params.query.spaceId});
			if(currentSpace){
				if(currentSpace.height){
					$('label.height-input').addClass('checked');
					$('#height').val(currentSpace.height);
				} else {
					$('#noHeightRadio')[0].checked = true;
				}
		    if(currentSpace.vehicleRestriction){
		      $('input[name="vehicle"][value=' + currentSpace.vehicleRestriction + ']').prop('checked', true);
		    } else {
		      $('input[name="vehicle"][value=1]').prop('checked', true);
		    }
				$('#disabledRadio')[0].checked = currentSpace.hasDisableParking;
				$('#evRadio')[0].checked = currentSpace.hasEVCharger;
				handle.stop();
			}
		} else {
			$('#noHeightRadio')[0].checked = true;
			$('input[name="vehicle"][value=1]').prop('checked', true);
		}
	})

});

Template.spaceFeatures.onCreated(function(){
	if(Router.current().params.query.spaceId){
    var spaceId = Router.current().params.query.spaceId
    Meteor.subscribe('ParkingSpacesByID', spaceId)
  }
});
