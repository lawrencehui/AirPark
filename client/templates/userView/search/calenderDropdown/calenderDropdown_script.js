var calCarousel = {};
var timeslot = [
	{type: 0, text:'8am - 10pm'},
	{type: 1, text:'10pm - 8am'},
	{type: 2, text:'8am - 8am'},
	{type: 3, text:'9am - 5pm'}
];
var totalCarouselItems = 0;
var calenderArray = [];
var currentCarouselItemIndex;

var timeSlotText = [
	'6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
	'6pm','7pm','8pm','9pm','10pm'
];

Template.calenderDropdown.onCreated(function() {
	this.selectedMonth = new ReactiveVar();
});

Template.calenderDropdown.helpers({
	calenderCarouselGestures: {
		'panmove .calender-container':function (event,template) {
			// console.log(event.deltaX);
			var percentChange = event.deltaX/calCarousel.containerWidth * 100;
			$("#calender-carousel").css('left', calCarousel.left + percentChange + '%');

		 },

		'panend .calender-container': function(event,template) {

			calCarousel.left = $("#calender-carousel").position().left/calCarousel.containerWidth * 100;

			var currentItem = $(event.target).parents('.calender-container');
			var currentIndex = parseInt(currentItem.attr("data-index"));
			var prevIndex = null;
			var nextIndex = null;
			if (currentItem.prev().length != 0) {
				prevIndex = parseInt(currentItem.prev().attr("data-index"));
			}
			if (currentItem.next().length != 0) {
				nextIndex = parseInt(currentItem.next().attr("data-index"));
			}

			// console.log(currentItem.siblings('.calender-container').andSelf().length);
			// var totalItems = currentItem.siblings('.calender-container').andSelf().length;

			if (event.deltaX > 0) {
				//panning right
				rightPanCal(currentIndex, prevIndex, template);
			} else {
				//panning left
				leftPanCal(currentIndex, nextIndex, totalCarouselItems, template);
			}
		}
	},

	months: function() {
		calenderArray = prepareCal();
		return calenderArray;
	},

	month: function() {
		// return moment(this.month, "M").format("MMMM");
		return moment(Template.instance().selectedMonth.get(), "M").format("MMMM");
	},
	dates: function() {
		return this.dates;

	},
	date: function() {
		if(this == -1) {
			return "";
		} else {
			return this;
		}
	},
	empty: function() {
		if(this == -1) {
			return "empty";
		} else {
			return
		}
	},

	fullDate: function() {
		if (this == -1) {
			return "";
		}
		// return this.date + "-" + this.month + "-" + this.year;
		return this.year + "-" + this.month + "-" + this.date;
	},

	available: function() {
		if (this.active) {
			return "active"
		} else {
			return "unclickable"
		}
	},

	selected: function() {
		var calenderSelected = Session.get('calenderDropdownSelected');
		var dateString = calenderSelected.date;
		// var selected = moment(dateString, 'DD-MM-YYYY');
		// var current = moment(this.date + "-" + this.month + "-" + this.year, 'D-M-YYYY');
		var selected = moment(dateString, 'YYYY-M-D');
		var current = moment(this.year + "-" + this.month + "-" + this.date, 'YYYY-M-D');
		if (selected.isSame(current)) {
			return 'selected'
		} else {
			return
		}
	},

	today: function() {
		// var fullDateString = this.date + "-" + this.month + "-" + this.year;
		var fullDateString = this.year + "-" + this.month + "-" + this.date;
		// var fullDateMoment = moment(fullDateString, "D-M-YYYY");
		var todayDateString = moment().format("YYYY-M-D");
		if (fullDateString === todayDateString) {
			return "today";
		} else {
			return
		}
	},

	timeSlot: function() {
		return timeSlotText;
	},

	// isSelected: function() {
	// 	var calenderSelected = Session.get('calenderDropdownSelected');
	// 	var timeslotArray = calenderSelected.timeslot;
	// 	if (_.contains(timeslotArray, parseInt(this.type))) {
	// 		return 'selected'
	// 	} else {
	// 		return
	// 	}
	// },
	// isSelectedStart: function(timeSlotIndex){
	// 	if(Session.get('searchStartTime') == timeSlotIndex){
	// 		return 'selected';
	// 	} else {
	// 		return '';
	// 	}
	// },
	// isSelectedEnd: function(timeSlotIndex){
	// 	if(Session.get('searchEndTime') == timeSlotIndex){
	// 		return 'selected';
	// 	} else {
	// 		return '';
	// 	}
	// },
	// isDisabledStart: function(timeSlotIndex){
	// 	if(Session.get('searchEndTime') <= timeSlotIndex){
	// 		return 'disabled';
	// 	} else {
	// 		return '';
	// 	}
	// },
	// isDisabledEnd: function(timeSlotIndex){
	// 	if(Session.get('searchStartTime') >= timeSlotIndex){
	// 		return 'disabled';
	// 	} else {
	// 		return '';
	// 	}
	// },
	timeslotChecked: function(index){
		var calenderSelected = Session.get('calenderDropdownSelected');
		if(parseInt(calenderSelected.timeslot) === parseInt(index)){
			return 'checked'
		} else {
			return ''
		}
	},
	isDateFilter: function(){
		if(Session.get('isDateFilter')){
			return "isDateFilter"
		} else {
			return ""
		}
	}
});

Template.calenderDropdown.events({
	'click .date-box': function(e, t) {
		$('.date-box').removeClass('selected');
		$(e.target).addClass('selected');

		var dateString = $(e.target).attr('data-date');
		var calenderSelected = Session.get('calenderDropdownSelected');
		calenderSelected.date = dateString;
		Session.set('calenderDropdownSelected', calenderSelected);
	},

	// 'click .slot': function(e) {
	// 	// $(e.target).toggleClass('selected');
	// 	var value = parseInt($(e.target).attr('data-type'));
	// 	var calenderSelected = Session.get('calenderDropdownSelected');
	// 	var timeslotArray = calenderSelected.timeslot;
	// 	if ($(e.target).hasClass('selected')) {
	// 		var processed = _.without(timeslotArray,value);
	// 		var uniqArray = _.uniq(processed);
	// 		calenderSelected.timeslot = uniqArray;
	// 		Session.set('calenderDropdownSelected', calenderSelected);
	// 	} else {
	// 		timeslotArray.push(value);
	// 		var uniqArray = _.uniq(timeslotArray);
	// 		calenderSelected.timeslot = uniqArray;
	// 		Session.set('calenderDropdownSelected', calenderSelected);
	// 	}
	// },

	'click .done-btn': function(e,t) {
		var calenderSelected = Session.get('calenderDropdownSelected');
		var type = $('input[name="searchTimeslot"]:checked')[0].dataset.type;
		calenderSelected.timeslot = type
		// calenderSelected.timeslot = parseInt($(event.currentTarget)[0].dataset.type)
		if(type === '3'){
			calenderSelected.timeslotArray = [3,4,5,6,7,8,9,10];
		}
		console.log(calenderSelected)
		Session.set('calenderDropdownSelected', calenderSelected)

		Blaze.remove(t.view);
		Session.set('isCalenderDropdownOpen', false);

		//set marker session

		// var calenderSelected = Session.get('calenderDropdownSelected');
		// // var startTime = 0;
		// // var endTime = 16;
		// // if(Session.get('searchOvernightParking')){
		// // 	endTime = 24;
		// // 	if(Session.get('searchHourlyParking')){
		// // 		startTime = parseInt(Session.get('searchStartTime'));
		// // 	} else {
		// // 		startTime = 16;
		// // 	}
		// // } else {
		// // 	if(Session.get('searchHourlyParking')){
		// // 		startTime = parseInt(Session.get('searchStartTime'));
		// // 		endTime = parseInt(Session.get('searchEndTime'));
		// // 	}
		// // }
		//
		// var oldSelectedDate = calenderSelected.date;
		// var selectedTimeslot = parseInt(calenderSelected.timeslot);
		// var allTimeslotsArray = [];
		//
		// var sortedTimeslots = Timeslots.find({
		// 	timeslotDate: oldSelectedDate,
		// 	isBooked: false,
		// 	isOccupied: false,
		// 	dayOff: false
		// }).fetch();
		//
		// if(selectedTimeslot === 3){
		// 	var timeslotArray = calenderSelected.timeslotArray;
		// 	console.log(timeslotArray)
		// 	var allTimeslotsArray = [];
		// 	lodash.forEach(timeslotArray, function(timeslotIndex){
		// 		var spaceIdArray = []
		// 		// var allTimeslots = Timeslots.find({
		// 		// 	timeslotDate: oldSelectedDate,
		// 		// 	timeslotType: timeslotIndex,
		// 		// 	isOccupied: false,
		// 		// 	isBooked: false,
		// 		// 	dayOff: false
		// 		// }).fetch();
		// 		var allTimeslotsObj = lodash.filter(sortedTimeslots, {'timeslotType': selectedTimeslot})
		// 		spaceIdArray = _.map(allTimeslotsObj, 'spaceId');
		// 		allTimeslotsArray.push(spaceIdArray)
		//
		// 	})
		// 	var allTimeslots = _.intersection.apply(_, allTimeslotsArray);
		//
		// } else {
		// 	// var allTimeslots = Timeslots.find({
		// 	// 	'timeslotDate': oldSelectedDate,
		// 	// 	'timeslotType': selectedTimeslot,
		// 	// 	'isOccupied': false,
		// 	// 	'isBooked': false,
		// 	// 	'dayOff': false
		// 	// }).fetch()
		// 	var allTimeslotsObj = lodash.filter(sortedTimeslots, {'timeslotType': selectedTimeslot})
		// 	allTimeslots = _.map(allTimeslotsObj, 'spaceId');
		// }
		// console.log(allTimeslots)
		// // for(var i = startTime; i < endTime; i++){
		// // 	var spaceIdArray = []
		// // 	var allTimeslotsTime = lodash.filter(allTimeslots, {'timeslotType': i});
		// // 	spaceIdArray = _.map(allTimeslotsTime, 'spaceId');
		// // 	allTimeslotsArray.push(spaceIdArray)
		// // }
		// // allTimeslotsArray = _.intersection.apply(_, allTimeslotsArray);
		// Session.set('allTimeslots', allTimeslots)
	},

	'click .prev-month-btn': function(e, template) {
		swipeCalToPrev(template);
	},

	'click .next-month-btn': function(e, template) {
		swipeCalToNext(template);
	},

	'click input[name="searchTimeslot"]': function(event, template){
		// console.log(event.currentTarget.dataset.type);
		// var calenderSelected = Session.get('calenderDropdownSelected');
		// calenderSelected.timeslot = event.currentTarget.dataset.type
		// // calenderSelected.timeslot = parseInt($(event.currentTarget)[0].dataset.type)
		// if(calenderSelected.timeslot === '3'){
		// 	calenderSelected.timeslotArray = [3,4,5,6,7,8,9,10];
		// }
		// console.log(calenderSelected)
		// Session.set('calenderDropdownSelected', calenderSelected)
	},

	// 'click input#searchHourlyParking': function(event, template){
	// 	// console.log($('#setHoursInput')[0]);
	// 	// console.log(event.target.checked);
	// 	if(event.target.checked){
	// 		$('#searchHourlyParkingInput').addClass('checked');
	// 		Session.set('searchHourlyParking', true)
	// 	} else {
	// 		$('#searchHourlyParkingInput').removeClass('checked');
	// 		Session.set('searchHourlyParking', false)
	// 	}
	// },
	// 'click input#searchOvernightParking': function(event, template){
	// 	// console.log($('#setHoursInput')[0]);
	// 	// console.log(event.target.checked);
	// 	if(event.target.checked){
	// 		Session.set('searchEndTime', 16);
	// 		Session.set('searchOvernightParking', true)
	// 	} else {
	// 		Session.set('searchOvernightParking', false)
	// 	}
	// },
	// 'change select#searchStartTime': function(event, template){
	// 	// console.log(event.target.value);
	// 	Session.set('searchStartTime', event.target.value);
	// },
	// 'change select#searchEndTime': function(event, template){
	// 	// console.log(event.target.value);
	// 	Session.set('searchEndTime', event.target.value);
	// }
});

Template.calenderDropdown.onRendered(function ( ){
	// var width = $('.date-box').width();
	// $('.date-box').height(width);
	calCarousel.left = $("#calender-carousel").position().left;
	calCarousel.containerWidth = $('.calender-carousel-container').width();

	var calenderSelected = Session.get('calenderDropdownSelected');
	var selectedTimeslot = calenderSelected.timeslot;
	console.log(calenderSelected)
	$('input[name="searchTimeslot"][data-type="' + selectedTimeslot + '"]')[0].checked = true;


	// var currentTime = moment().hours();
	// var startTime = currentTime - 6;
	// var endTime = startTime + 1;
	// if(startTime < 0 || startTime == 16 || startTime == 17){
	// 	startTime = 16;
	// 	endTime = 24;
	// 	Session.setDefault('searchHourlyParking', false)
	// } else {
	// 	Session.setDefault('searchHourlyParking', true)
	// }
	//
	// Session.setDefault('searchStartTime', startTime);
	// Session.setDefault('searchEndTime', endTime);
	//
	//
	// if(Session.get('searchHourlyParking')){
	// 	$('#searchHourlyParking')[0].checked = true;
	// 	$('#searchHourlyParkingInput').addClass('checked');
	// }
	// if(Session.get('searchOvernightParking')){
	// 	$('#searchOvernightParking')[0].checked = true;
	// 	Session.setDefault('searchEndTime', 16);
	// }

});

var rightPanCal = function(currentIndex, prevIndex, template) {
	if(prevIndex != null) {
		console.log("has prev");
		if (calCarousel.left < -100*currentIndex + 100/3 ) {
			swipeCalToBound(-100*currentIndex);
			setSelectedMonth(currentIndex, template);
		} else {
			swipeCalToBound(-100*prevIndex);
			setSelectedMonth(prevIndex, template);
		}
	} else {
		swipeCalToBound(0);
		setSelectedMonth(0, template);
	}
}

var leftPanCal = function(currentIndex, nextIndex, totalItems, template) {
	if(nextIndex != null) {
		console.log("has next");
		if (calCarousel.left > -100*(currentIndex + 1) + 100/3*2 ) {
			swipeCalToBound(-100*currentIndex);
			setSelectedMonth(currentIndex, template);
		} else {
			swipeCalToBound(-100*nextIndex);
			setSelectedMonth(nextIndex, template);
		}
	} else {
		console.log("totalItems: "+ totalItems);
		swipeCalToBound(-100 * (totalItems - 1));
		setSelectedMonth(totalItems - 1, template);
	}
}

var swipeCalToBound = function(left) {
	$("#calender-carousel").velocity({left: left + "%"}, {duration: 300, complete: function(els) {
		calCarousel.left = left;
		}
	});
}

var setSelectedMonth = function(index, template) {
	currentCarouselItemIndex = index;
	var selectedMonth = calenderArray[index].month;
	template.selectedMonth.set(selectedMonth);
}

var swipeCalToNext = function(template) {
	if (currentCarouselItemIndex < (totalCarouselItems - 1)) {
		var newIndex = currentCarouselItemIndex + 1;
		swipeCalToBound(-100*newIndex);
		setSelectedMonth(newIndex, template);
	}
}

var swipeCalToPrev = function(template) {
	if (currentCarouselItemIndex > 0 ) {
		var newIndex = currentCarouselItemIndex - 1;
		swipeCalToBound(-100*newIndex);
		setSelectedMonth(newIndex, template);
	}
}

var prepareCal = function() {

	var startDate = moment();
	var endDate = moment().add(30, 'days');

	var startDateMonth = startDate.month();
	var startDateYear = startDate.year();

	var endDateMonth = endDate.month();
	var endDateYear = endDate.year();

	// console.log(startDateMonth);
	// console.log(endDateMonth);

	var resultCal = [];
	var i;
	var j;

	// for (i = startDateYear; i <= endDateYear; i++) {
	if (startDateMonth < endDateMonth) {
		// console.log('same year');
		for (j = startDateMonth; j <= endDateMonth; j++) {
			var cal = {};
			cal.month = j+1;
			if (j === startDateMonth) {
				cal.dates = genOneMonthCal(startDate, null, j, startDateYear);
			} else if (j === endDateMonth) {
				cal.dates = genOneMonthCal(null, endDate, j, startDateYear);
			} else {
				cal.dates = genOneMonthCal(null, null, j, startDateYear);
			}
			resultCal.push(cal);
		}
	} else {
		for (j = startDateMonth; j <= 11; j++) {
			var cal = {};
			cal.month = j+1;
			if (j === startDateMonth) {
				cal.dates = genOneMonthCal(startDate, null, j, startDateYear);
			} else {
				cal.dates = genOneMonthCal(null, null, j, startDateYear);
			}
			resultCal.push(cal);
		}
		for (j = 0; j <= endDateMonth; j++) {
			var cal = {};
			cal.month = j+1;
			if (j === endDateMonth) {
				cal.dates = genOneMonthCal(null, endDate, j, endDateYear);
			} else {
				cal.dates = genOneMonthCal(null, null, j, endDateYear);
			}
			resultCal.push(cal);
		}
	}
	// }
	totalCarouselItems = resultCal.length;
	var firstMonth = resultCal[0].month;
	Template.instance().selectedMonth.set(firstMonth);
	currentCarouselItemIndex = 0;

	return resultCal;

}

var genOneMonthCal = function(startDate, endDate, month, year) {

	var daysInMonth = moment(year + "-" + (month+1), "YYYY-M").daysInMonth();

	var monthStartDate;
	var monthEndDate;

	if (_.isEmpty(startDate) && _.isEmpty(endDate)){
		monthStartDate = 1;
		monthEndDate = daysInMonth;
	} else if (_.isEmpty(startDate)) {
		monthStartDate = 1;
		monthEndDate = endDate.date();
	} else {
		monthStartDate = startDate.date();
		monthEndDate = daysInMonth;
	}

	// console.log("month: "+ (month+1) + " monthstartDate: " + monthStartDate + " monthEndDate: " + monthEndDate);

	var firstDay = moment("1-"+(month+1)+"-"+year, "D-M-YYYY").day();
	var prevEmpDays;
	if(firstDay === 0) {
		prevEmpDays = 6;
	} else {
		prevEmpDays = firstDay - 1;
	}

	var i;

	var datesArray = [];
	for (i = 0; i < prevEmpDays; i++) {
		datesArray.push(-1);
	}

	for (i = 1; i <= daysInMonth; i++) {
		var dateObject = {
			date: i,
			month: month+1,
			year: year
		}
		if (i >= monthStartDate && i <= monthEndDate) {
			dateObject.active = true;
		} else {
			dateObject.active = false;
		}
		datesArray.push(dateObject);
	}
	return datesArray;

}
