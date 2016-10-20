	var calCarousel = {};
	var timeslot = [
		{type: 0, text:'8am - 12pm', price: null},
		{type: 1, text:'12pm - 4pm', price: null},
		{type: 2, text:'4pm - 8pm', price: null}
	];

	var slotText = [	'8am - 12pm',
										'12pm - 4pm',
										'4pm - 8pm'		]

	var startTimeslots = [ 	'08:00:00',
													'12:00:00',
												 	'16:00:00' 	];

	var endTimeslots 	= [ 	'11:59:59',
													'15:59:59',
												 	'19:59:59' 	];

	var totalCarouselItems = 0;
	var calenderArray = [];
	var currentCarouselItemIndex;

	Template.priceSettings.onCreated(function() {
		this.selectedMonth = new ReactiveVar();
	});

	Template.priceSettings.helpers({
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
		slotIndex: function() {
			return [1,2,3]
		},
		getTimeslotInfo: function(type){
			var spaceId = Router.current().params._id;
			var date = Session.get('currentDate');
			var isDisabled = '';
			var isChecked = '';
			var isCheckedOpened = '';
			var finalTimeslotInfo;

			var timeslotInfo = Timeslots.findOne({ spaceId: spaceId,
																							timeslotDate: date,
																							timeslotType: type.toString()	});

			if (timeslotInfo) {
				Session.set('isChecked'+type, true);
				if (timeslotInfo.isBooked) {
					Session.set('isDisabled'+type, true)
				} else {
					Session.set('isDisabled'+type, false)
				}

				finalTimeslotInfo = _.assign( {	timeslotInfo,
																				isChecked: isChecked,
 																				isDisabled: isDisabled });

			} else {
				Session.set('isChecked'+type, false);
				Session.set('isDisabled'+type, false);

				finalTimeslotInfo = {	isChecked: isChecked,
															isDisabled: isDisabled,
															timeslotPrice: null }
			}
			return finalTimeslotInfo;
		},
		getSlotText: function(index){
			return slotText[index];
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
		}
	});

	Template.priceSettings.events({
		'click .date-box': function(e, t) {
			$('.date-box').removeClass('selected');
			$(e.target).addClass('selected');

			var dateString = $(e.target).attr('data-date');
			Session.set('currentDate', dateString);
			console.log(dateString);

		},

		'change input[type="checkbox"]': function(e,t) {
			var type = $(e.target).attr('data-type');
			Session.set('isChecked'+type, !Session.get('isChecked'+type));

			// Meteor.setTimeout(function(){
			// 	// $('input').css('line-height', 'normal');
			// 	var target = $('section.slot-container').find('.price-box[data-type='+type+']')
			// 	if (target.hasClass('open')) {
			// 		$('input[data-type="'+type+'"]').css('line-height', 1);
			// 		console.log('state is open');
			// 	} else {
			// 		$('input[data-type="'+type+'"]').css('line-height', 0);
			// 		console.log('state is closed');
			// 		$('input[data-type="'+type+'"]').val(null);
			// 	}
			// }, 210);
			$('input[data-type="'+type+'"]').val(null);
			var spaceId = Router.current().params._id;
			var date = Session.get('currentDate');
			console.log('calling removePriceForDate for type: ' + type);
			Meteor.call('removePriceForDate', spaceId, date, type);
		},

		'click .prev-month-btn': function(e, template) {
			swipeCalToPrev(template);
		},

		'click .next-month-btn': function(e, template) {
			swipeCalToNext(template);
		},
		'keyup .price-input': function(e,t){
			var type = $(e.target).attr('data-type');

			if($(e.target).val().length > 0){
				console.log('greater than 0');
				Session.set('isChecked'+type, true);
			} else if ($(e.target).val().length === 0){
				console.log('equal to 0');
				Session.set('isChecked'+type, false);
				var spaceId = Router.current().params._id;
				var date = Session.get('currentDate');
				console.log('calling removePriceForDate for type: ' + type);
				Meteor.call('removePriceForDate', spaceId, date, type);
			}
		},
		'keydown .price-input': function(e,t){
			console.log($(e.target).val().length);
			console.log(e.keyCode);
			if ($.inArray(e.keyCode, [46, 8, 27, 13, 35, 36, 37, 39]) !== -1) {
		 	  return;
			}
			if((e.keyCode == 48 || e.keyCode == 96) && $(e.target).val().length == 0){
				e.preventDefault();
				return;
			}
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
				return;
			} else {
					if($(e.target).val().length >= 2){
						e.preventDefault();
						return;
					}
					return;
			}
		},
		'blur .price-input': function(e,t) {
			console.log('price is blurred');

			var spaceId = Router.current().params._id;
			var date = Session.get('currentDate');
			// var timestamp_date = moment(date).format("D-M-YYYY");
			var type = $(e.target).attr('data-type');
			var price = $(e.target).val();

			console.log(price);
			if(price){
				// var startTime = moment(date + ' ' + startTimeslots[type]).format("YYYY-M-D hh:mm:ss");
				// var endTime = moment(date + ' ' + endTimeslots[type]).format("YYYY-M-D hh:mm:ss");

				var startTime = (date + ' ' + startTimeslots[type]).split(/[- :]/);
				var endTime = (date + ' ' + endTimeslots[type]).split(/[- :]/);

				var timestamp_start = new Date(	startTime[0], startTime[1]-1, startTime[2],
																				startTime[3], startTime[4], startTime[5] ).valueOf();
				var timestamp_end = new Date(	endTime[0], endTime[1]-1, endTime[2],
																				endTime[3], endTime[4], endTime[5] ).valueOf();
				console.log(date);
				console.log(timestamp_start);
				console.log(timestamp_end);

				Meteor.call('updatePriceForDate', spaceId, date, type, price, timestamp_start, timestamp_end);
			}
		}
	});

	Template.priceSettings.onRendered(function ( ){
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
