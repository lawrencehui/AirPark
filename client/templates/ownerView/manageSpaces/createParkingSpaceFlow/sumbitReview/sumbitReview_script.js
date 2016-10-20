Template.sumbitReview.helpers({
	parkingSpaceImgUrl: function(){
		console.log(this)
		if(this.parkingSpaceImg){
			return this.parkingSpaceImg
		} else {
			return '/images/spaceImageIcon.png'
		}
	},
	parkingBuildingImgUrl: function(){
		if(this.parkingBuildingImg){
			return this.parkingBuildingImg
		} else {
			return '/images/entranceImage.png'
		}
	},
	parkingVerificationImgUrl: function(){
		if(this.parkingVerificationImg){
			return this.parkingVerificationImg
		} else {
			return '/images/ownerVerImage.png'
		}
	},
	spaceFloorText: function(){
		if(this.spaceFloor){
			return this.spaceFloor
		} else {
			return "Not Set"
		}
	},
	spaceNumText: function(){
		if(this.spaceNum){
			return this.spaceNum
		} else {
			return "Not Set"
		}
	},
	spaceTypeText: function(){
		var textArray = [
			"Residential",
			"Commercial",
			"Industrial",
			"Others",
			"Not Set"
		];
		return textArray[this.spaceType];
	},
	parkingAreaText: function(){
		var textArray = [
			"Indoor",
			"Outdoor with cover",
			"Outdoor without cover",
			"Not Set"
		];
		return textArray[this.parkingAreaType];
	},
	instructionsText: function(){
		var instructionsText = "";
		if(this.instructions){
			instructionsText += this.instructions + "</br>";
		}
		var presets = [
			'Not set',
			'Exit requires proof of rental voucher',
			'Park close to the wall',
			'Park all the way to the left',
			'Park all the way to the right',
			'Head-first parking only',
			'Reverse parking only',
			'Access requires octopus card, or call management office'
		];
		_.forEach(this.presetInstructions, function(element, index, list){
			instructionsText += presets[element] + "</br>";
		});
		// console.log(instructionsText)
		if(instructionsText){
			return instructionsText;
		} else {
			return "Not Set"
		}
	},
	spaceFeaturesText: function(){
		var spaceFeaturesText = "";
		if(this.height){
			spaceFeaturesText += "Height: &lt; " + this.height.toFixed(1) + "m</br>";
		} else {
			spaceFeaturesText += "Height restrictions: Not Set</br>";
		}
		var restrictions = [
			'Oversize car friendly',
			'Normal',
			'Compact'
		];
		spaceFeaturesText += restrictions[this.vehicleRestriction];
		if(spaceFeaturesText){
			return spaceFeaturesText;
		} else {
			return "Not set";
		}
	},
  hasDisableParking: function() {
    return this.hasDisableParking;
  },
  hasEVCharger: function() {
    return this.hasEVCharger;
  },
	// showParkingSpaceImg: function(){
	// 	if(this.parkingSpaceImg){
	// 		if(Images.findOne({_id: this.parkingSpaceImg})){
	// 			return Images.findOne({_id: this.parkingSpaceImg}).url();
	// 		} else {
	// 			return '/images/spaceImageIcon.png';
	// 		}
	// 	} else {
	// 		return '/images/spaceImageIcon.png';
	// 	}
	// },
	// showParkingBuildingImg: function(){
	// 	if(this.parkingBuildingImg){
	// 		if(Images.findOne({_id: this.parkingBuildingImg})){
	// 			return Images.findOne({_id: this.parkingBuildingImg}).url();
	// 		} else {
	// 			return '/images/entranceImage.png';
	// 		}
	// 	} else {
	// 		return '/images/entranceImage.png';
	// 	}
	// },
	// showParkingVerificationImg: function(){
	// 	if(this.parkingVerificationImg){
	// 		if(Images.findOne({_id: this.parkingVerificationImg})){
	// 			return Images.findOne({_id: this.parkingVerificationImg}).url();
	// 		} else {
	// 			return '/images/ownerVerImage.png';
	// 		}
	// 	} else {
	// 		return '/images/ownerVerImage.png';
	// 	}
	// }
});

Template.sumbitReview.events({
	'click #review-edit-address': function(event, template){
		var spaceId = Router.current().params._id;
		Router.go('/pickLocationView?spaceId=' + spaceId + '&edit=true');
	},
	'click #review-edit-floorAndSpace': function(event, template){
		var spaceId = Router.current().params._id;
		Router.go('/floorAndSpace?spaceId=' + spaceId + '&edit=true');
	},
	'click #review-edit-spaceType': function(event, template){
		var spaceId = Router.current().params._id;
		Router.go('/spaceTypeView?spaceId=' + spaceId + '&edit=true');
	},
	'click #review-edit-parkingArea': function(event, template){
		var spaceId = Router.current().params._id;
		Router.go('/inOutDoorView?spaceId=' + spaceId + '&edit=true');
	},
	'click #review-edit-instruction': function(event, template){
		var spaceId = Router.current().params._id;
		Router.go('/instructionView?spaceId=' + spaceId + '&edit=true');
	},
	'click #review-edit-spaceFeature': function(event, template){
		var spaceId = Router.current().params._id;
		Router.go('/spaceFeatures?spaceId=' + spaceId + '&edit=true');
	},
	'click .review-space-image-button': function(event, template){
		var spaceId = Router.current().params._id;
		Router.go('/uploadImagesView/' + spaceId + '?edit=true');
	},
	'click .review-verification-image-button': function(event, template){
		var spaceId = Router.current().params._id;
		Router.go('/ownerVerification?spaceId=' + spaceId + '&edit=true');
	},
	'click .review-save': function(event, template){
		Router.go('/manageSpacesList')
	},
});

Template.sumbitReview.onRendered(function ( ){
	})

Template._agreementModal.events({
	'click #reviewAgree': function(event, template){
		var cs = ParkingSpaces.findOne({_id: Router.current().params._id});
		console.log(cs)
		var checked = true;
		if(cs.lat && cs.lng && cs.locationText && cs.spaceFloor && cs.spaceNum && cs.parkingSpaceImg && cs.parkingBuildingImg && cs.parkingVerificationImg){
			// checked = true;
		} else {
			checked = false;
		}
		if(cs.spaceType === 0 || cs.spaceType === 1 || cs.spaceType === 2 || cs.spaceType === 3){
			// checked = true;
		} else {
			checked = false;
		}
		if(cs.parkingAreaType === 0 || cs.parkingAreaType === 1 || cs.parkingAreaType === 2){
			// checked = true;
		} else {
			checked = false;
		}
		if(checked){
			Meteor.call('pendingParkingSpace', Router.current().params._id, function(error, result){
				if(error){
					console.log(error)
				} else {
					Router.go('/reviewThanks');
				}
			});
		} else {
			alert("Please enter all information")
		}

	}
})
