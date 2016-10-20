var timeslot = [
	{type: 0, text:'Day Parking (8am to 10pm)', price: null},
	{type: 1, text:'Overnight (10pm to 8am)', price: null},
	{type: 2, text:'All Day (8am to 8am)', price: null},
	{type: 3, text:'9am to 5pm', price: null}
];

var slotText = [	'Day Parking (8am to 10pm)',
									'Overnight (10pm to 8am)',
									'All Day (8am to 8am)',
									'9am to 5pm'		]


Template.ratesAndAvailability.helpers({
	slotIndex: function() {
		return [1,2,3,4]
	},
	getTimeslotInfo: function(type){
		var ratesInfo
		ratesInfo.timeslotPrice = Session.get('rates'+type);
		ratesInfo.isChecked = Session.get('isChecked'+type);
		return ratesInfo;
	},
	getSlotText: function(index){
		return slotText[index];
	},
	priceText: function(index){
		if(index < 3){
			return 'for a total price of'
		} else if(index == 3){
			return 'for a total price of'
			// return 'at an hourly price of'
		}
	},
	isChecked: function(type){
		if (Session.get('isChecked'+type)){
			return 'checked'
		} else {
			return ''
		}
	},
	isDisabled: function(type){
		if (Session.get('isDisabled'+type)){
			return 'disabled'
		} else {
			return ''
		}
	},
	// availabilityRoute: function(){
	// 	return "/availability/" + Router.current().params._id;
	// }
	getPrice: function(type){
		return Session.get('rates'+type) || null;
	},
	availableDay: function(){
		var currentSpace = ParkingSpaces.findOne({_id: Router.current().params._id});
		console.log(currentSpace)
		var availability = currentSpace.availability;
		var weeklyAvailability = currentSpace.weeklyAvailability;
		if(weeklyAvailability){
			if(weeklyAvailability.available && weeklyAvailability.endTime > moment().valueOf() && weeklyAvailability.availability.length > 0){
				var noOfDay = 0;
				for(var i=0; i<7; i++){
					if(weeklyAvailability.availability[i].available){
						noOfDay++;
					}
				}
				if(noOfDay == 1){
					return "1 Day this week";
				} else {
					return noOfDay + " Days this week";
				}
			}
		}
		if(availability){
			if(availability.length > 0){
				var noOfDay = 0;
				for(var i=0; i<7; i++){
					if(availability[i].available){
						noOfDay++;
					}
				}
			} else {
				var noOfDay = 7;
			}
			if(noOfDay == 1){
				return "1 Day 4 weeks";
			} else {
				return noOfDay + " Days 4 weeks";
			}
		} else {
			return 'Not Set'
		}

	},
	timeSlotCheckboxId: function(index){
		return 'timeSlotCheckbox' + index;
	},
	// backPath: function(){
	// 	return '/manageSpacesSummary/' + Router.current().params._id;
	// }
});

Template.ratesAndAvailability.events({
	'click .edit-availability': function(event, template){
		// for(let i=0; i<4; i++){
		// 	if(Session.get('isChecked' + i) && !Session.get('rates' + i)){
		// 		alert('Please input the price');
		// 		return true
		// 	}
		// }
		var route = "/availability/" + Router.current().params._id;
		if(Session.get('isChecked0') || Session.get('isChecked1') || Session.get('isChecked2') || Session.get('isChecked3')){
			Router.go(route)
		} else {
			alert('please select a time slot');
		}
	},
	'click .edit-custom-availability': function(event, template){
		Router.go('/customAvailability/' + Router.current().params._id);
	},
	'change input[type="checkbox"]': function(e,t) {
		var type = $(e.target).attr('data-type');
		// if(type == 2){
		// 	Session.set('isChecked0', false);
		// 	Session.set('isChecked1', false);
		// } else {
		// 	Session.set('isChecked2', false);
		// }
		if(Session.get('isChecked'+type)){
			Session.set('isChecked'+type, false);
			$('input[data-type="'+type+'"]').val(null);
		} else {
			Session.set('isChecked'+type, true);
		}

		// var spaceId = Router.current().params._id;
		// var date = Session.get('currentDate');
		// console.log('calling removePriceForDate for type: ' + type);
		// Meteor.call('removePriceForDate', spaceId, date, type);
	},
	'keyup .price-input': function(e,t){
		var type = $(e.target).attr('data-type');
		Session.set('rates'+type, $(e.target).val());

		if($(e.target).val().length > 0){
			console.log('greater than 0');
			Session.set('isChecked'+type, true);
			// if(type == 2){
			// 	Session.set('isChecked0', false);
			// 	Session.set('isChecked1', false);
			// } else {
			// 	Session.set('isChecked2', false);
			// }
		} else if ($(e.target).val().length === 0){
			console.log('equal to 0');
			Session.set('isChecked'+type, false);
			// var spaceId = Router.current().params._id;
			// var date = Session.get('currentDate');
			// console.log('calling removePriceForDate for type: ' + type);
			// Meteor.call('removePriceForDate', spaceId, date, type);
		}
	},
	'keydown .price-input': function(e,t){
		console.log($(e.target).val().length);
		console.log(e.keyCode);
		if ($.inArray(e.keyCode, [46, 8, 27, 13, 35, 36, 37, 39]) !== -1) {
			return;
		}
		// if((e.keyCode == 48 || e.keyCode == 96) && $(e.target).val().length == 0){
		// 	e.preventDefault();
		// 	return;
		// }
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
			return;
		} else {
				if($(e.target).val().length >= 3){
					e.preventDefault();
					return;
				}
				return;
		}
	},
	// 'blur .price-input': function(e,t) {
	// 	console.log('price is blurred');
	//
	// 	var spaceId = Router.current().params._id;
	// 	var date = Session.get('currentDate');
	// 	// var timestamp_date = moment(date).format("D-M-YYYY");
	// 	var type = $(e.target).attr('data-type');
	// 	var price = $(e.target).val();
	//
	// 	console.log(price);
	// 	if(price){
	// 		// var startTime = moment(date + ' ' + startTimeslots[type]).format("YYYY-M-D hh:mm:ss");
	// 		// var endTime = moment(date + ' ' + endTimeslots[type]).format("YYYY-M-D hh:mm:ss");
	//
	// 		var startTime = (date + ' ' + startTimeslots[type]).split(/[- :]/);
	// 		var endTime = (date + ' ' + endTimeslots[type]).split(/[- :]/);
	//
	// 		var timestamp_start = new Date(	startTime[0], startTime[1]-1, startTime[2],
	// 																		startTime[3], startTime[4], startTime[5] ).valueOf();
	// 		var timestamp_end = new Date(	endTime[0], endTime[1]-1, endTime[2],
	// 																		endTime[3], endTime[4], endTime[5] ).valueOf();
	// 		console.log(date);
	// 		console.log(timestamp_start);
	// 		console.log(timestamp_end);
	//
	// 		Meteor.call('updatePriceForDate', spaceId, date, type, price, timestamp_start, timestamp_end);
	// 	}
	// }
});

Template.ratesAndAvailability.onRendered(function ( ){
	var spaceId = Router.current().params._id
	var spaceInfo = ParkingSpaces.findOne({_id: spaceId});
	var finalRatesInfo = {};
	if(!Session.get('isChecked0') && !Session.get('isChecked1') && !Session.get('isChecked2') && !Session.get('isRates0') && !Session.get('isRates1') && !Session.get('isRates2')){
		if(spaceInfo){
			if(spaceInfo.rates){
				for(var i=0; i<3; i++){
					if(spaceInfo.rates[i]){
						Session.set('isChecked'+i, spaceInfo.rates[i].available);
						Session.set('rates'+i, spaceInfo.rates[i].value);
					}
				}
			}
		}
	}
	// if(!Session.get('availability')){
	// 	if(spaceInfo){
	// 		if(spaceInfo.availability){
	// 			Session.set('availability', spaceInfo.availability);
	// 		}
	// 	}
	// }
	// if(Session.get('isChecked0')){
	// 	$('$input#timeSlotCheckboxId0')[0].checked = true
	// }
})
