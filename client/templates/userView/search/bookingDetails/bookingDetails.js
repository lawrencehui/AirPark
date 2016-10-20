var timeslot = [ '8am - 12pm',
	               '12pm - 4pm',
	               '4pm - 8pm'   ];



Template.bookingDetails.onRendered(function() {

  // console.dir(this.data.spaceInfo);
	// Meteor.call('getCustomerObj', function(err, result) {
	// 	if(err) {
	// 		console.log('getCustomerObj: Error: ');
	// 		console.dir(err);
	// 	} else {
	// 		console.log('getCustomerObj: Result: ');
	// 		// console.dir(result);
	// 		// console.log(this);
	// 		this.btCustomer.set(result);
	// 	}
	// }.bind(this));
	// var indexArray = _.map(Session.get('bookingTimeslotsArray'), function(id, index, list){
	// 	return true;
	// });
	// console.log(indexArray);
	// Session.set('chooseTimeslotType', indexArray);
});

Template.bookingDetails.onDestroyed(function() {

});

Template.bookingDetails.helpers({
	goingback: function(){
		return Session.get("detailPreviousPath");
	},
	// showImg: function(parkingSpaceImgId){
	// 	return Images.findOne({_id: parkingSpaceImgId}).url();
	// },
  timeslotText: function(type) {
    return timeslot[type];
  },
	bookingDate: function(){
		return Session.get('bookingDate');
	},
	totalPrice: function(){
		var parkingSpace = ParkingSpaces.findOne({_id: Session.get("bookingSpaceId")});
		var startTime = Session.get("bookingStartTime");
		var endTime = Session.get("bookingEndTime");
		if(parkingSpace.rates[2].available){
			price = (parseInt(endTime) - parseInt(startTime)) * parkingSpace.rates[2].value;
		} else {
			if(endTime == 24){
				price = 8 * parkingSpace.rates[1].value + (16 - parseInt(startTime)) * parkingSpace.rates[0].value
			} else {
				price = (parseInt(endTime) - parseInt(startTime)) * parkingSpace.rates[0].value;
			}
		}
		// var totalPrice = _.reduce(Session.get('bookingTimeslotsArray'), function(memo, id, index, list){
		// 	if (Session.get('chooseTimeslotType')[index]) {
		// 		return memo + Timeslots.findOne({_id: id}).timeslotPrice * 4;
		// 	} else {
		// 		return memo
		// 	}
		// }, 0);
		return price + ".00";
	},
	getParkingSpaceLocationText: function(spaceId) {
		return ParkingSpaces.findOne({_id: spaceId}).locationText;
	},
  // hasDisableParking: function(spaceId) {
  //   return ParkingSpaces.findOne({_id: spaceId}).hasDisableParking;
  // },
  // hasEVCharger: function(spaceId) {
  //   return ParkingSpaces.findOne({_id: spaceId}).hasEVCharger;
  // },
  // hasOversizeParking: function(spaceId){
  //   return ParkingSpaces.findOne({_id: spaceId}).hasOversizeParking;
  // },
	btCustomer: function() {
		return Template.instance().btCustomer.get();
	},
	creditCardsObjs: function() {
		return _.map(this.creditCards, function(cc, index) {
			cc._index = index;
			return cc;
		});
	},
	cardType: function() {
		switch (this.cardType) {
			case 'Visa':
				return 'fa-cc-visa'
				break;
			case 'MasterCard':
				return 'fa-cc-mastercard'
				break;
			case 'American Express':
				return 'fa-cc-amex'
				break;
			case 'Diners Club':
				return 'fa-cc-diners-club'
				break;
			case 'Discover':
				return 'fa-cc-discover'
				break;
			case 'JCB':
				return 'fa-cc-jcb'
				break;
			default:
				return 'fa-cc'
		}
	},
	selected: function() {
		console.log(this);
		var selectedIndex = Template.instance().selectedCCIndex.get();
		if (this._index == selectedIndex) {
			return 'selected'
		}
	},
	timeslotInfos: function(){
		return Timeslots.find({_id: {$in: Session.get('bookingTimeslotsArray')}});
	},
	timeSelected: function(index){
		if(Session.get('chooseTimeslotType')[index]){
			return 'selected'
		} else {
			return ''
		}
	},
	spaceTypeText: function(spaceType){
		var textArray = [
			"Residential",
			"Commercial",
			"Industrial",
			"Others"
		];
		return textArray[spaceType];
	},
	parkingAreaText: function(parkingAreaType){
		var textArray = [
			"Indoor",
			"Outdoor with cover",
			"Outdoor without cover"
		];
		return textArray[parkingAreaType];
	},
	instructionsText: function(presetInstructions){
		var instructionsText = "";
		// if(instructions){
		// 	instructionsText += instructions + "</br>";
		// }
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
		_.forEach(presetInstructions, function(element, index, list){
			instructionsText += presets[element] + "</br>";
		});
		// console.log(instructionsText)
		return instructionsText;
	},
	spaceFeaturesText: function(height, vehicleRestriction){
		var spaceFeaturesText = "";
		if(height){
			spaceFeaturesText += "Height: &lt; " + height.toFixed(1) + "m</br>";
		}
		var restrictions = [
			'Oversize car friendly',
			'Normal',
			'Compact'
		];
		if(vehicleRestriction){
			spaceFeaturesText += restrictions[vehicleRestriction];
		}
		if(spaceFeaturesText){
			return spaceFeaturesText;
		} else {
			return "Not set";
		}
	},
	userRatings: function(){
    return [0,1,2,3,4];
  },
  isFullStar: function(index){
		var parkingSpace = ParkingSpaces.findOne({_id: Session.get("bookingSpaceId")});
    console.log(parkingSpace);
    var allRatings = parkingSpace.ratings;
    console.log(allRatings);
    var averageRate = 0;
    if(allRatings.length > 0){
      averageRate = _.reduce(allRatings, function(memo, num){
        return parseInt(memo) + parseInt(num.rate);
      }, 0)/allRatings.length;
      console.log(averageRate);
    }
    var averageRate = Math.round(averageRate);
    return index < averageRate;
  }
});

Template.bookingDetails.events({
	'click .cc-cell': function(e,t) {
		var index = $(e.currentTarget).attr("data-index");
		// console.dir(e);
		t.selectedCCIndex.set(index);
	},
	'click .time-cell': function(e,t) {
		var index = $(e.currentTarget).attr("data-index");
		// console.dir(e);
		var indexArray = Session.get('chooseTimeslotType');
		indexArray[index] = !indexArray[index];
		Session.set('chooseTimeslotType', indexArray);
	},
	'click .addBankAccountWhileConfirming': function(){
		Session.set('isAddingBankAccountWhileConfirming', true);
		Router.go('addCreditCard');
	},
	'click #bookingDetailsButton': function(e, t){
		Router.go('/bookingConfirmation');

	}
})
