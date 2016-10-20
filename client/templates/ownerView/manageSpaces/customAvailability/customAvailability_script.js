var calCarousel = {};

var totalCarouselItems = 0;
var calenderArray = [];
var currentCarouselItemIndex;

var timeSlotText = [
	'6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
	'6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am'
]

Template.customAvailability.onCreated(function() {
	this.selectedMonth = new ReactiveVar();
});

Template.customAvailability.helpers({
	currentTimeslot: function(){
		return Timeslots.findOne({spaceId: Router.current().params._id, timeslotDate: Session.get('currentDate')})
	},
	isDayOff: function(){
		var timeslotArray = Timeslots.find({spaceId: Router.current().params._id, timeslotDate: Session.get('currentDate'), dayOff: false}).fetch();

		if(timeslotArray.length > 0){
			return false
		} else {
			return true
		}
	},
	hideOnDayOff: function(){
		var timeslotArray = Timeslots.find({spaceId: Router.current().params._id, timeslotDate: Session.get('currentDate'), dayOff: false}).fetch();

		if(timeslotArray.length > 0){
			return ''
		} else {
			return 'hideOnDayOff'
		}
	},
	timeSlot: function(){
		return timeSlotText;
	},
	isSelectedStart: function(timeSlotIndex){
		var timeslotArray = Timeslots.find({spaceId: Router.current().params._id, timeslotDate: Session.get('currentDate'), dayOff: false}).fetch();
		// console.log(timeslotArray)
		if(timeslotArray.length > 0){
			var startTimeIndex = _.minBy(timeslotArray, function(element){
				return element.timeslotType;
			}).timeslotType;
		} else {
			var startTimeIndex = 0;
		}
		// console.log(startTimeIndex);
		// var startTimeIndex = moment(Template.parentData(1).timestampStart).add(-6, 'hours').hours();
		if(startTimeIndex == timeSlotIndex){
			return 'selected';
		} else {
			return '';
		}
	},
	isSelectedEnd: function(timeSlotIndex){
		var timeslotArray = Timeslots.find({spaceId: Router.current().params._id, timeslotDate: Session.get('currentDate'), dayOff: false}).fetch();
		if(timeslotArray.length > 0){
			var endTimeIndex = _.maxBy(timeslotArray, function(element){
				return element.timeslotType;
			}).timeslotType;
			endTimeIndex = parseInt(endTimeIndex) + 1;
		} else {
			var endTimeIndex = 24;
		}
		// var endTimeIndex = moment(Template.parentData(1).timestampEnd).add(-6, 'hours').hours();
		// if(endTimeIndex == 0){
		// 	endTimeIndex = 24;
		// }
		if(endTimeIndex == timeSlotIndex){
			return 'selected';
		} else {
			return '';
		}
	},
	isDisabledStart: function(timeSlotIndex){
		if(timeSlotIndex > 16 && timeSlotIndex < 24){
			return 'disabled'
		}
		// var endTimeIndex = moment(Template.parentData(1).timestampEnd).add(-6, 'hours').hours();
		// if(endTimeIndex == 0){
		// 	endTimeIndex = 24;
		// }
		var timeslotArray = Timeslots.find({spaceId: Router.current().params._id, timeslotDate: Session.get('currentDate'), dayOff: false}).fetch();
		if(timeslotArray.length > 0){
			var endTimeIndex = _.maxBy(timeslotArray, function(element){
				return element.timeslotType;
			}).timeslotType;
		} else {
			var endTimeIndex = 24;
		}
		if(endTimeIndex <= timeSlotIndex){
			return 'disabled';
		} else {
			return '';
		}
	},
	isDisabledEnd: function(timeSlotIndex){
		if(timeSlotIndex > 16 && timeSlotIndex < 24){
			return 'disabled'
		}
		// var startTimeIndex = moment(Template.parentData(1).timestampStart).add(-6, 'hours').hours();
		var timeslotArray = Timeslots.find({spaceId: Router.current().params._id, timeslotDate: Session.get('currentDate'), dayOff: false}).fetch();
		if(timeslotArray.length > 0){
			var startTimeIndex = _.minBy(timeslotArray, function(element){
				return element.timeslotType;
			}).timeslotType;
		} else {
			var startTimeIndex = 0;
		}
		if(startTimeIndex >= timeSlotIndex){
			return 'disabled';
		} else {
			return '';
		}
	},
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
			var totalItems = currentItem.siblings('.calender-container').andSelf().length;

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

	today: function() {
		// var fullDateString = this.date + "-" + this.month + "-" + this.year;
		var fullDateString = this.year + "-" + this.month + "-" + this.date;
		// var fullDateMoment = moment(fullDateString, "D-M-YYYY");
		var todayDateString = moment().format("YYYY-M-D");
		if (fullDateString === todayDateString) {
			Session.set('currentDate', todayDateString);
			return "today";
		} else {
			return
		}
	},
	// isCustomRange: function(){
	// 	if(Session.get('isCustomRange')){
	// 		return ''
	// 	} else {
	// 		return 'notCustomRange'
	// 	}
	// }

});

Template.customAvailability.events({
	'click input#makeDaysOff': function(event, template){
		var dayOff = event.target.checked;
		var spaceId = Router.current().params._id;
		var date = Session.get('currentDate');
		console.log(spaceId);
		console.log(date);
		console.log(dayOff);
		Meteor.call('toggleDayOff', spaceId, date, dayOff);
		if(!dayOff){
			$('.notDayOff').removeClass('hideOnDayOff')
		} else {
			$('.notDayOff').addClass('hideOnDayOff')
		}
	},

	'click .date-box': function(e, t) {
		$('.date-box').removeClass('selected');
		$(e.target).addClass('selected');

		var dateString = $(e.target).attr('data-date');
		Session.set('currentDate', dateString);
		// console.log(dateString);
		$('input#customRange')[0].checked = false;
	},

	'click .prev-month-btn': function(e, template) {
		swipeCalToPrev(template);
	},

	'click .next-month-btn': function(e, template) {
		swipeCalToNext(template);
	},

	'change select#customStartTime': function(event, template){
		if(!$('input#makeDaysOff')[0].checked){
			if($('input#customRange')[0].checked){
				console.log(event.target.value);
				var spaceId = Router.current().params._id;
				var date = Session.get('currentDate');
				// var startTime = moment(date, 'YYYY-M-D').startOf('day').valueOf();
				// startTime += 3600000 * (parseInt(event.target.value) + 6);
				var startTime = event.target.value;
				var endTime = $('select#customEndTime')[0].value;
				if(endTime == 0){
					endTime = 24;
				}
				// console.log(endTime);
				Meteor.call('changeStartEndTime', spaceId, date, startTime, endTime);
			}
		}
	},

	'change select#customEndTime': function(event, template){
		if(!$('input#makeDaysOff')[0].checked){
			if($('input#customRange')[0].checked){
				console.log(event.target.value);
				var spaceId = Router.current().params._id;
				var date = Session.get('currentDate');
				// var endTime = moment(date, 'YYYY-M-D').startOf('day').valueOf();
				// if(event.target.value == 0){
				// 	endTime += 3600000 * 30;
				// } else {
				// 	endTime += 3600000 * (parseInt(event.target.value) + 6);
				// }
				var endTime = event.target.value;
				if(endTime == 0){
					endTime = 24;
				}
				var startTime = $('select#customStartTime')[0].value;
				Meteor.call('changeStartEndTime', spaceId, date, startTime, endTime);
			}
		}
	}

});

Template.customAvailability.onRendered(function ( ){

	var width = $('.date-box').width();
	$('.date-box').height(width);
	calCarousel.left = $("#calender-carousel").position().left;
	calCarousel.containerWidth = $('.calender-carousel-container').width();
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

	console.dir(resultCal);
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
