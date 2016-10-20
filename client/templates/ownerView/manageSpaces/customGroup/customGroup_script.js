var groupTextArray = ['Family', 'Friends', 'Others']

Template.customGroup.helpers({
	groupList: function(){
		var groupIndex = Session.get('groupIndex');
		var currentProfile = Profile.findOne({userId: Meteor.userId()});
		if(currentProfile){
			if(groupIndex == 0){
				var array = _.map(currentProfile.customGroup.family, function(element, index, list){
					return {
						email: element,
						index: index
					}
				})
				return array;
			} else if(groupIndex == 1){
				var array = _.map(currentProfile.customGroup.friends, function(element, index, list){
					return {
						email: element,
						index: index
					}
				})
				return array;
			} else if(groupIndex == 2){
				var array = _.map(currentProfile.customGroup.others, function(element, index, list){
					return {
						email: element,
						index: index
					}
				})
				return array;
			} else {
				return [];
			}
		} else {
			return [];
		}
	},
	guestList: function(){
		var currentProfile = Profile.findOne({userId: Meteor.userId()});
		console.log(currentProfile)
		if(currentProfile){
			var array = _.map(currentProfile.freeGroup, function(element, index, list){
				return {
					email: element,
					index: index
				}
			})
			return array;
		} else {
				return [];
		}
	},
	groupHeader: function(){
		var groupIndex = Session.get('groupIndex');
		return groupTextArray[groupIndex];
	}
});

Template.customGroup.events({
	'click .invite-button': function(event, template){
		// var groupIndex = Session.get('groupIndex');
		var email = $('#groupEmailInput').val();
		// console.log(groupIndex);
		// console.log(email);
		Meteor.call('insertGuestEmail', email, function(error, result){
			if(error){
				console.log(error);
			} else {
				$('#groupEmailInput').val('');
				return true;
			}
		});
		// Meteor.call('insertGroupEmail', groupIndex, email, function(error, result){
		// 	if(error){
		// 		console.log(error);
		// 	} else {
		// 		$('#groupEmailInput').val('');
		// 		return true;
		// 	}
		// });
	},
	// 'change #selectGroup': function(event, template){
	// 	Session.set('groupIndex', event.target.value);
	// },
	'click .delete': function(event, template){
		// var groupIndex = Session.get('groupIndex');
		// console.log(this)
		// console.log(this.email)
		Meteor.call('deleteGuestEmail', this.email, function(error, result){
			if(error){
				console.log(error);
			} else {
				return true;
				// console.log('deleteGroupEmail success')
			}
		});
		// Meteor.call('deleteGroupEmail', groupIndex, this, function(error, result){
		// 	if(error){
		// 		console.log(error);
		// 	} else {
		// 		return true;
		// 		console.log('deleteGroupEmail success')
		// 	}
		// });
	}
});

Template.customGroup.onRendered(function ( ){
	// Session.set('groupIndex', 0);
	// if(Session.get('customeGroupSelected')){
	// 	var customeGroupSelected = Session.get('customeGroupSelected');
	// } else {
	// 	var currentSpace = ParkingSpaces.findOne({_id: Router.current().params._id});
	// 	if(currentSpace.access){
	// 		var customeGroupSelected = currentSpace.access.customGroups;
	// 	}
	// }
	// if(customeGroupSelected[0]){
	// 	$('input#familyGroup')[0].checked = true;
	// }
	// if(customeGroupSelected[1]){
	// 	$('input#friendsGroup')[0].checked = true;
	// }
	// if(customeGroupSelected[2]){
	// 	$('input#othersGroup')[0].checked = true;
	// }
});
