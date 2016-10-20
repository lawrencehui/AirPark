Template.bookingConfirmation.helpers({
	// showImg: function(parkingSpaceImgId){
	// 	console.log(parkingSpaceImgId);
	// 	return Images.findOne({_id: parkingSpaceImgId}).url();
	// },
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
	bookingDate: function(){
		return Session.get('bookingDate');
	},
	bookingTime: function(){
		// var timeSlotText = [
		// 	'6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
		// 	'6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am'
		// ];
		// var startTime = Session.get('bookingStartTime');
		// var endTime = Session.get('bookingEndTime');
		// return timeSlotText[startTime] + ' - ' + timeSlotText[endTime];
		var timeslotType = Session.get('bookingTimeslotType')
		var timeslot = [
			{type: 0, text:'8am - 10pm'},
			{type: 1, text:'10pm - 8am'},
			{type: 2, text:'8am - 8am'},
			{type: 3, text:'9am - 5pm'}
		];
		if(timeslotType < 3){
			return timeslot[timeslotType].text;
		} else if(timeslotType === 3){
			var timeslotArray = Session.get('bookingTimeslotArray');
			var timeSlotText = ['9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm'];
			var startTimeIndex = _.min(timeslotArray) - 3;
			var endTimeIndex = _.max(timeslotArray) - 2;
			return timeSlotText[startTimeIndex] + ' - ' + timeSlotText[endTimeIndex];
		}
	},
	totalPrice: function(){
		if(Session.get('isFree')){
			var price = 0;
		} else {
			var parkingSpace = ParkingSpaces.findOne({_id: Session.get("bookingSpaceId")});
			// var startTime = Session.get("bookingStartTime");
			// var endTime = Session.get("bookingEndTime");
			// if(parkingSpace.rates[2].available){
			// 	var price = (parseInt(endTime) - parseInt(startTime)) * parkingSpace.rates[2].value;
			// } else {
			// 	if(endTime == 24){
			// 		var price = 8 * parkingSpace.rates[1].value + (16 - parseInt(startTime)) * parkingSpace.rates[0].value
			// 	} else {
			// 		var price = (parseInt(endTime) - parseInt(startTime)) * parkingSpace.rates[0].value;
			// 	}
			// }
			var timeslotType = Session.get('bookingTimeslotType')
			var price = parkingSpace.rates[timeslotType].value;
			if(price === 0){
				Session.set('isFree', true);
			}
		}
		return price + ".00";
	},
	// hourlyPrice: function(){
	// 	if(Session.get('isFree')){
	// 		var hourlyPrice = 0;
	// 	} else {
	// 		var parkingSpace = ParkingSpaces.findOne({_id: Session.get("bookingSpaceId")});
	// 		var startTime = Session.get("bookingStartTime");
	// 		var endTime = Session.get("bookingEndTime");
	// 		if(parkingSpace.rates[2].available){
	// 			var hourlyPrice = parkingSpace.rates[2].value;
	// 		} else {
	// 			if(endTime == 24){
	// 				var hourlyPrice = 8 * parkingSpace.rates[1].value + (16 - parseInt(startTime)) * parkingSpace.rates[0].value
	// 				hourlyPrice /= (24 - parseInt(startTime));
	// 			} else {
	// 				var hourlyPrice = parkingSpace.rates[0].value;
	// 			}
	// 		}
	// 	}
	// 	return parseInt(hourlyPrice) + ".00";
	// },

	// btCustomer: function() {
	// 	return Template.instance().btCustomer.get();
	// },
	// creditCardsObjs: function() {
	// 	return _.map(this.creditCards, function(cc, index) {
	// 		cc._index = index;
	// 		return cc;
	// 	});
	// },
	cardType: function() {
		var btCustomer = Template.instance().btCustomer.get();
		var creditCardsObjs = btCustomer.creditCards;
		var selectedIndex = Session.get('selectedCCIndex');
		var cc = creditCardsObjs[selectedIndex];

		switch (cc.cardType) {
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
	// selected: function() {
	// 	console.log(this);
	// 	var selectedIndex = Template.instance().selectedCCIndex.get();
	// 	if (this._index == selectedIndex) {
	// 		return 'selected'
	// 	}
	// },
	maskedNumber: function(){
		var btCustomer = Template.instance().btCustomer.get();
		var creditCardsObjs = btCustomer.creditCards;
		var selectedIndex = Session.get('selectedCCIndex');
		var cc = creditCardsObjs[selectedIndex];
		return cc.maskedNumber;
	},
	carText: function(){
		var carObj = Session.get('selectedCarObj');
		return carObj.model;
	},
	licenseText: function(){
		var carObj = Session.get('selectedCarObj');
		return carObj.number;
	},
	isFree: function(){
		console.log(Session.get('isFree'))
		return Session.get('isFree');
	}
});

Template.bookingConfirmation.events({
	'click #confirmBookingButton': function(e, t){

		if(!$("input#booking-agreement-checkbox")[0].checked){
			alert("Please review the Carpark Space License Agreement and check the checkbox")
			return true;
		}

		var spaceId = Session.get("bookingSpaceId")
		var selectedDate = Session.get("bookingDate")
		// var startTime = Session.get("bookingStartTime")
		// var endTime = Session.get("bookingEndTime")
		var timeslotType = Session.get('bookingTimeslotType')
		var timeslotArray = Session.get('bookingTimeslotArray')
		var carObj = Session.get("selectedCarObj")
		var checkBooked = false;
		if(timeslotType < 3){
			if(Timeslots.findOne({spaceId: spaceId, timeslotDate: selectedDate, timeslotType: timeslotType}).isBooked){
				checkBooked = true;
			}
			if(Timeslots.findOne({spaceId: spaceId, timeslotDate: selectedDate, timeslotType: timeslotType}).isOccupied){
				checkBooked = true;
			}
		} else if(timeslotType == 3){
			lodash.forEach(timeslotArray, function(timeslotTypeIndex){
				if(Timeslots.findOne({spaceId: spaceId, timeslotDate: selectedDate, timeslotType: timeslotTypeIndex}).isBooked){
					checkBooked = true;
				}
				if(Timeslots.findOne({spaceId: spaceId, timeslotDate: selectedDate, timeslotType: timeslotTypeIndex}).isOccupied){
					checkBooked = true;
				}
			})
		} else {
			return null;
		}
		// for(var i = startTime; i < endTime; i++){
		// 	if(Timeslots.findOne({spaceId: spaceId, timeslotDate: selectedDate, timeslotType: i}).isBooked){
		// 		checkBooked = true;
		// 	}
		// }
		if(checkBooked){
			alert('Oops, parking space already booked by another user. Please select another one.');
			Router.go('/home');
		} else {
				var r = confirm("Confirm booking?");
				if (r == true) {
					// console.log("YEAHHHHH")
					if(timeslotType < 3){
						var currentTimeslot = Timeslots.find({spaceId: spaceId, timeslotDate: selectedDate, timeslotType: timeslotType}).fetch();
						if(timeslotType == 0){
							var timestampStart = moment(selectedDate, 'YYYY-M-D').hours(8).valueOf();
							var timestampEnd = moment(selectedDate, 'YYYY-M-D').hours(22).valueOf();
						} else if(timeslotType == 1){
							var timestampStart = moment(selectedDate, 'YYYY-M-D').hours(22).valueOf();
							var timestampEnd = moment(selectedDate, 'YYYY-M-D').hours(8).add(1,'days').valueOf();
						} else if(timeslotType == 2){
							var timestampStart = moment(selectedDate, 'YYYY-M-D').hours(8).valueOf();
							var timestampEnd = moment(selectedDate, 'YYYY-M-D').hours(8).add(1,'days').valueOf();
						} else {
							return null
						}
					} else if(timeslotType == 3){
						var currentTimeslot = Timeslots.find({spaceId: spaceId, timeslotDate: selectedDate, timeslotType: {$in: timeslotArray}}).fetch();
						var timestampStart = moment(selectedDate, 'YYYY-M-D').hours(_.min(timeslotArray) + 6).valueOf();
						var timestampEnd = moment(selectedDate, 'YYYY-M-D').hours(_.max(timeslotArray) + 7).valueOf();
					} else {
						return null;
					}

					if(Session.get('isFree')){
						// console.log('freeeeeeeeeee')
						// Meteor.call('checkIsFree', spaceId, Meteor.userId(), function(error, result){
						// 	if(error){
						// 		console.log('cheater')
						// 		alert('Please try again');
						// 		Router.go('bookingDetails');
						// 		} else {
						// 		console.log('confirm free')

								// var currentTimeslot = Timeslots.find({
								// 	$and: [
								// 		{spaceId: spaceId},
								// 		{timeslotDate: selectedDate},
								// 		{timeslotType: {$gte: startTime}},
								// 		{timeslotType: {$lt: endTime}}
								// 	]
								// }).fetch();
								var parkingSpace = ParkingSpaces.findOne({_id: spaceId});

								var timeslotIdArray = _.map(currentTimeslot, '_id');
								// var timestampStart = moment(selectedDate, 'YYYY-M-D').valueOf() + (parseInt(startTime) + 6) * 3600000;
								// var timestampEnd = moment(selectedDate, 'YYYY-M-D').valueOf() + (parseInt(endTime) + 6) * 3600000;
								var ownerId = parkingSpace.ownerId;
								var bookeeId = Meteor.userId();

								var transactionObj = {	btTransactionId		: 'free',
																				amount						:	0,
																				spaceId						:	spaceId,
																				timeslotIdArray		:	timeslotIdArray,
																				timeslotType			: timeslotType,
																				timeslotArray			: timeslotArray,
																				// startTime					: startTime,
																				// endTime						: endTime,
																				timeslotDate			:	selectedDate,
																				timestampStart		: timestampStart,
																				timestampEnd			: timestampEnd,
																				ownerId						: ownerId,
																				bookeeId					: bookeeId,
																				car								: carObj 			};
								console.dir(transactionObj);
								Meteor.call('addTransactionOnPaymentSuccess', transactionObj, function(err, newDocId) {
									if (err) {
										console.log(err);
									} else {
										console.dir(newDocId);
										console.log(timeslotIdArray);
										Meteor.call('markTimeslotArrayAsBooked', timeslotIdArray);
										// Meteor.call('markTimeslotAsBooked', id);
										// Router.go('bookingReceiptOngoing', {_id: newDocId});
										Router.go('/bookingThanks');
									}
								});
						// 	}
						// });
					} else {

						var creditcards = t.btCustomer.get().creditCards;
						var creditcard = creditcards[Session.get('selectedCCIndex')];
						var token = creditcard.token;
						// var amount = _.reduce(bookingTimeslotsArray, function(memo, id, index, list){
						// 	if (chooseTimeslotType[index]) {
						// 		return memo + Timeslots.findOne({_id: id}).timeslotPrice * 4;
						// 	} else {
						// 		return memo
						// 	}
						// }, 0);
						var parkingSpace = ParkingSpaces.findOne({_id: spaceId});
						// if(parkingSpace.rates[2].available){
						// 	var amount = (parseInt(endTime) - parseInt(startTime)) * parkingSpace.rates[2].value;
						// } else {
						// 	if(endTime == 24){
						// 		var amount = 8 * parkingSpace.rates[1].value + (16 - parseInt(startTime)) * parkingSpace.rates[0].value
						// 	} else {
						// 		var amount = (parseInt(endTime) - parseInt(startTime)) * parkingSpace.rates[0].value;
						// 	}
						// }
						var amount = parkingSpace.rates[timeslotType].value;

						Meteor.call('chargeCreditCardWithAmount', amount, token, function(err, result) {
							if(err) {
								console.log(err);
							} else {
								console.dir(result);

								// var currentTimeslot = Timeslots.find({
								// 	$and: [
								// 		{spaceId: spaceId},
								// 		{timeslotDate: selectedDate},
								// 		{timeslotType: {$gte: startTime}},
								// 		{timeslotType: {$lt: endTime}}
								// 	]
								// }).fetch();

								var timeslotIdArray = _.map(currentTimeslot, '_id');
								// var timestampStart = moment(selectedDate, 'YYYY-M-D').valueOf() + (parseInt(startTime) + 6) * 3600000;
								// var timestampEnd = moment(selectedDate, 'YYYY-M-D').valueOf() + (parseInt(endTime) + 6) * 3600000;
								var ownerId = parkingSpace.ownerId;
								var bookeeId = Meteor.userId();

								var transactionObj = {	btTransactionId		: result.transaction.id,
																				amount						:	amount,
																				spaceId						:	spaceId,
																				timeslotIdArray		:	timeslotIdArray,
																				timeslotType			: timeslotType,
																				timeslotArray			: timeslotArray,
																				// startTime					: startTime,
																				// endTime						: endTime,
																				timeslotDate			:	selectedDate,
																				timestampStart		: timestampStart,
																				timestampEnd			: timestampEnd,
																				ownerId						: ownerId,
																				bookeeId					: bookeeId,
																				car								: carObj 			};
								console.dir(transactionObj);

								Meteor.call('addTransactionOnPaymentSuccess', transactionObj, function(err, newDocId) {
									if (err) {
										console.log(err);
									} else {
										console.dir(newDocId);
										console.log(timeslotIdArray);
										Meteor.call('markTimeslotArrayAsBooked', timeslotIdArray);
										// Meteor.call('markTimeslotAsBooked', id);
										// Router.go('bookingReceiptOngoing', {_id: newDocId});
										Router.go('/bookingThanks');
									}
								});
							}
						})
					}

				}
			}
	},

	// 'click .cc-cell': function(e,t) {
	// 	var index = $(e.currentTarget).attr("data-index");
	// 	// console.dir(e);
	// 	t.selectedCCIndex.set(index);
	// },
	// 'click .addBankAccountWhileConfirming': function(){
	// 	Session.set('isAddingBankAccountWhileConfirming', true);
	// 	Router.go('addCreditCard');
	// },
	'click .selectCar': function(event, template){
		Router.go('selectCar');
	},
	'click .selectCC': function(){
		Router.go('selectCreditCard');
	}

});

Template.bookingConfirmation.onRendered(function ( ){
	// console.log('onRendered')
	Session.set('isFree', false)
	Meteor.subscribe('ParkingSpacesByID', Session.get('bookingSpaceId'), function(){
		var parkingSpace = ParkingSpaces.findOne({_id: Session.get("bookingSpaceId")});
		console.log(parkingSpace)
		if(parkingSpace.access){
			if(parkingSpace.access.freeGroup){
				var ownerProfile = Profile.findOne({userId: parkingSpace.ownerId});
				var userProfile = Profile.findOne({userId: Meteor.userId()});
				console.log(userProfile)
				if(ownerProfile.freeGroup){
					if(_.indexOf(ownerProfile.freeGroup, userProfile.email) > -1){
						Session.set('isFree', true)
					}
				}
			}
		}
	})


	Meteor.call('getCustomerObj', function(err, result) {
		if(err) {
			console.log('getCustomerObj: Error: ');
			console.dir(err);
		} else {
			console.log('getCustomerObj: Result: ');
			// console.dir(result);
			// console.log(this);
			this.btCustomer.set(result);
		}
	}.bind(this));

	var garages = Profile.findOne({userId: Meteor.userId()}).garages;
	console.log(garages);
	if(garages.length > 0){
		Session.setDefault('selectedCarObj', garages[0])
	}

})

Template.bookingConfirmation.onCreated(function() {
	// console.log('onCreated')
	this.btCustomer = new ReactiveVar();
	Session.setDefault('selectedCCIndex', 0);
	// this.selectedCCIndex = new ReactiveVar(0);
});
