var weekdayText = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var timeSlotText = [
	'6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
	'6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am'
]

Template.availability.helpers({
	timeSlot: function(){
		return timeSlotText;
	},
	weekdayIndex: function(){
		return [0,1,2,3,4,5,6];
	},
	getWeekdayText: function(index){
		return weekdayText[index];
	},
	isChecked: function(type){
		var availability = Session.get('availability');
		if (availability[type].available){
			return 'checked'
		} else {
			return ''
		}
	},
	weekdayAvailable: function(){
		var weekdayAvailableArray = [];
		var availability = Session.get('availability');
		for(var i=0; i<7; i++){
			if(availability[i].available){
				weekdayAvailableArray.push(i);
			}
		}
		return weekdayAvailableArray;
	},
	startTimeId: function(){
		return 'startTime' + this;
	},
	endTimeId: function(){
		return 'endTime' + this;
	},
	// getStartTime: function(){
	// 	var availability = Session.get('availability');
	// 	return availability[this].startTime;
	// },
	// getEndTime: function(){
	// 	var availability = Session.get('availability');
	// 	return availability[this].endTime;
	// },
	getFirstStartTime: function(){
		var availability = Session.get('availability');
		return _.find(availability, function(element, index, list){
			return element.available;
		}).startTime;
	},
	getFirstEndTime: function(){
		var availability = Session.get('availability');
		return _.find(availability, function(element, index, list){
			return element.available;
		}).endTime;
	},
	isSelectedStart: function(timeSlotIndex){
		// console.log(weekdayIndex)
		// console.log(timeSlotIndex)
		// console.log(Template.parentData(1))
		var availability = Session.get('availability');
		if(availability){
			if(Template.parentData(1)){
				if(Template.parentData(1)._id){
					if(_.find(availability, function(element, index, list){
						return element.available;
					}).startTime == timeSlotIndex){
						return 'selected';
					} else {
						return '';
					}
				} else {
					if(availability[Template.parentData(1)].startTime == timeSlotIndex){
						return 'selected';
					} else {
						return '';
					}
				}
			} else {
				if(availability[Template.parentData(1)].startTime == timeSlotIndex){
					return 'selected';
				} else {
					return '';
				}
			}
			// console.log(availability[Template.parentData(1)].startTime);
		} else {
			return '';
		}
	},
	isSelectedEnd: function(timeSlotIndex){
		// console.log(weekdayIndex)
		// console.log(timeSlotIndex)
		var availability = Session.get('availability');
		if(availability){
			// console.log(availability[weekdayIndex].endTime);
			if(Template.parentData(1)){
				if(Template.parentData(1)._id){
					if(_.find(availability, function(element, index, list){
						return element.available;
					}).endTime == timeSlotIndex){
						return 'selected';
					} else {
						return '';
					}
				} else {
					if(availability[Template.parentData(1)].endTime == timeSlotIndex){
						return 'selected';
					} else {
						return '';
					}
				}
			} else {
				if(availability[Template.parentData(1)].endTime == timeSlotIndex){
					return 'selected';
				} else {
					return '';
				}
			}
		} else {
			return '';
		}
	},
	isDisabledStart: function(timeSlotIndex){
		if(timeSlotIndex > 16 && timeSlotIndex < 24){
			return 'disabled'
		}
		// console.log(weekdayIndex)
		// console.log(timeSlotIndex)
		// console.log(Template.parentData(1))
		var availability = Session.get('availability');
		if(availability){
			// console.log(availability[weekdayIndex].endTime);
			if(Template.parentData(1)){
				if(Template.parentData(1)._id){
					if(_.find(availability, function(element, index, list){
						return element.available;
					}).endTime <= timeSlotIndex){
						return 'disabled';
					} else {
						return '';
					}
				} else {
					if(availability[Template.parentData(1)].endTime <= timeSlotIndex){
						return 'disabled';
					} else {
						return '';
					}
				}
			} else {
				if(availability[Template.parentData(1)].endTime <= timeSlotIndex){
					return 'disabled';
				} else {
					return '';
				}
			}
		} else {
			return '';
		}
	},
	isDisabledEnd: function(timeSlotIndex){
		if(timeSlotIndex > 16 && timeSlotIndex < 24){
			return 'disabled'
		}
		// console.log(weekdayIndex)
		// console.log(timeSlotIndex)
		var availability = Session.get('availability');
		if(availability){
			// console.log(availability[weekdayIndex].startTime);
			if(Template.parentData(1)){
				if(Template.parentData(1)._id){
					if(_.find(availability, function(element, index, list){
						return element.available;
					}).startTime >= timeSlotIndex){
						return 'disabled';
					} else {
						return '';
					}
				} else {
					if(availability[Template.parentData(1)].startTime >= timeSlotIndex){
						return 'disabled';
					} else {
						return '';
					}
				}
			} else {
				if(availability[Template.parentData(1)].startTime >= timeSlotIndex){
					return 'disabled';
				} else {
					return '';
				}
			}
		} else {
			return '';
		}
	},
	checkboxName: function(index){
		return "availability" + index;
	},
	isDisabled: function(index){
		if(Session.get("isChecked" + index)){
			return ""
		} else {
			return "disabled"
		}
	}
});

Template.availability.events({
	'click .weekday-cell': function(event, template){
		// console.log($(event.currentTarget))
		var type = $(event.currentTarget)[0].dataset.type;
		// console.log(type)
		var availability = Session.get('availability');
		availability[type].available = !availability[type].available;
		Session.set('changeAvailability', true);
		Session.set('availability', availability);
	},
	'click input#setHours': function(event, template){
		// console.log($('#setHoursInput')[0]);
		// console.log(event.target.checked);
		if(event.target.checked){
			$('#setHoursInput').addClass('checked');
			Session.set('isSetHours', true)
		} else {
			$('#setHoursInput').removeClass('checked');
			$('input#setSpecificHours')[0].checked = false;
			$('.specific-grey-cell-container').removeClass('checked');
			Session.set('isSetHours', false)
		}
		Session.set('changeAvailability', true);
	},
	'click input#setSpecificHours': function(event, template){
		// console.log($('#setHoursInput')[0]);
		// console.log(event.target.checked);
		if(event.target.checked){
			$('.specific-grey-cell-container').addClass('checked');
			Session.set('isSetSpecificHours', true)
		} else {
			$('.specific-grey-cell-container').removeClass('checked');
			Session.set('isSetSpecificHours', false)
		}
		Session.set('changeAvailability', true);
	},
	'click input.availability-checkbox': function(event, template){
		console.log(event.currentTarget);
		var weekday = $(event.currentTarget).attr('name')
		var type = parseInt($(event.currentTarget).attr('data-type'))
		console.log(weekday)
		console.log(type)
		var availability = Session.get('availability');
		// if(Session.get('isSetSpecificHours')){
			if(weekday != 'All'){
				if(type < 4){
					availability[parseInt(weekday)].timeSlots[type-1] = event.target.checked
				} else if(type == 4){
					for(let i=3; i<11; i++){
						availability[parseInt(weekday)].timeSlots[i] = event.target.checked
					}
				}
			}
		// } else if(Session.get('isSetHours')){
			if(weekday == 'All'){
				if(type < 4){
					for(let j=0; j<7; j++){
						availability[j].timeSlots[type-1] = event.target.checked
					}
				} else if(type == 4){
					for(let j=0; j<7; j++){
						for(let i=3; i<11; i++){
							availability[j].timeSlots[i] = event.target.checked
						}
					}
				}
			}
		// }
		Session.set('availability', availability)
	},
	'change select.startTime': function(event, template){
		// console.log(this)
		// console.log(this._id)
		var availability = Session.get('availability');
		// console.log(event.target.value)
		if(this._id){
			for(var i=0; i<7; i++){
				availability[i].startTime = event.target.value;
			}
		} else {
			availability[this].startTime = event.target.value;
		}
		Session.set('availability', availability);
	},
	'change select.endTime': function(event, template){
		// console.log(this)
		// console.log(this._id)
		var availability = Session.get('availability');
		// console.log(event.target.value)
		if(this._id){
			for(var i=0; i<7; i++){
				availability[i].endTime = event.target.value;
			}
		} else {
			availability[this].endTime = event.target.value;
		}
		Session.set('availability', availability);
	},
	'click #save-availability-button': function(){
		var availability = Session.get('availability');
		// console.log(availability);
		Meteor.call('saveAvailability', availability);
	},
	'click #use-availability-button': function(){
		var availability = Profile.findOne({userId: Meteor.userId()}).availability;
		Session.set('availability', availability);
		$('#setHoursInput').addClass('checked');
		$('.specific-grey-cell-container').addClass('checked');
		$('input#setHours')[0].checked = true;
		$('input#setSpecificHours')[0].checked = true;
	}
});

Template.availability.onRendered(function (){
	// console.log('onRendered');
	// if(Session.get('isChecked2')){
	// 	var startTime = 0;
	// 	var endTime = 24;
	// } else if(Session.get('isChecked0') && Session.get('isChecked1')){
	// 	var startTime = 0;
	// 	var endTime = 24;
	// } else if(Session.get('isChecked0')){
	// 	var startTime = 0;
	// 	var endTime = 16;
	// } else if(Session.get('isChecked1')){
	// 	var startTime = 16;
	// 	var endTime = 24;
	// } else {
	// 	alert('please select a time slot');
	// 	Router.go('/ratesAndAvailability/' + Router.current().params._id);
	// }
	var timeSlots = [];
	for(var i=0; i<3; i++){
		if(Session.get('isChecked' + i)){
			timeSlots[i] = true
		} else {
			timeSlots[i] = false
		}
	}
	for(var i=3; i<11; i++){
		if(Session.get('isChecked3')){
			timeSlots[i] = true
		} else {
			timeSlots[i] = false
		}
	}
	var availability = [];
	for(var i=0; i<7; i++){
		availability[i] = {};
		availability[i].available = true;
		// availability[i].startTime = startTime;
		// availability[i].endTime = endTime;
		availability[i].timeSlots = timeSlots;
	}
	this.autorun(function(h){
		var spaceObj = ParkingSpaces.findOne({_id: Router.current().params._id})
		if(spaceObj){
			if(spaceObj.availability){
				Session.set('availability', spaceObj.availability);
				$('#setHoursInput').addClass('checked');
				$('.specific-grey-cell-container').addClass('checked');
				$('input#setHours')[0].checked = true;
				$('input#setSpecificHours')[0].checked = true;
			} else {
				Session.set('availability', availability);
			}
			h.stop();
		} else {
			Session.set('availability', availability);
		}
	})

	this.autorun(function(){
		var changeAvailability = Session.get('changeAvailability');
		var customeAvailability = Session.get('availability');
		Meteor.defer(function(){
			console.log(customeAvailability)
			var customeTimeSlots = _.find(customeAvailability, function(element, index, list){
				return element.available;
			}).timeSlots;
			for(let i=1; i<4; i++){
				$('input[name="All"][data-type="' + i + '"]')[0].checked = customeTimeSlots[i-1];
			}
			$('input[name="All"][data-type="4"]')[0].checked = false;
			for(let i=4; i<12; i++){
				if(customeTimeSlots[i-1]){
					$('input[name="All"][data-type="4"]')[0].checked = true;
					break;
				}
			}

			for(let i=0; i<7; i++){
				if(customeAvailability[i].available){
					for(let j=1; j<4; j++){
						// console.log($('input[name="' + i + '"][data-type="' + j + '"]'))
						$('input[name="' + i + '"][data-type="' + j + '"]')[0].checked = customeAvailability[i].timeSlots[j-1];
					}
					$('input[name="' + i + '"][data-type="4"]')[0].checked = false;
					for(let j=4; j<12; j++){
						if(customeAvailability[i].timeSlots[j-1]){
							$('input[name="' + i + '"][data-type="4"]')[0].checked = true;
							break;
						}
					}
				}
			}
			Session.set('changeAvailability', false);
    });
	})

	if(Session.get('isSetHours')){
		$('input#setHours')[0].checked = true;
		$('#setHoursInput').addClass('checked');
		if(Session.get('isSetSpecificHours')){
			$('input#setSpecificHours')[0].checked = true;
			$('.specific-grey-cell-container').addClass('checked');
		}
	}

 // 	console.log(Template.instance().data)
 	var weeklyAvailability = Template.instance().data.weeklyAvailability;
	if(weeklyAvailability){
		if(weeklyAvailability.available && weeklyAvailability.endTime > moment().valueOf() && weeklyAvailability.availability.length > 0){
			$('input#isWeek')[0].checked = true;
			Session.set('availability', weeklyAvailability.availability)
		} else {
			$('input#isMonth')[0].checked = true;
		}
	} else {
		$('input#isMonth')[0].checked = true;
	}

})
