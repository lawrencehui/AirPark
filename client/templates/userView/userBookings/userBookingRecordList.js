// var timeslotText = [ '8am - 12pm',
//     	               '12pm - 4pm',
//     	               '4pm - 8pm'   ];
//
// var startTimeslots = [ 	'08:00:00',
// 												'12:00:00',
// 											 	'16:00:00' ];
//
// var endTimeslots 	= [ 	'11:59:59',
// 												'15:59:59',
// 											 	'19:59:59' ];

var timeSlotText = [
  '6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
  '6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am'
];

Template.userBookingRecordList.onRendered(function(){
  if(Router.current().params.query.type == 'history'){
    Session.set('isUserUpcomingActive', false);
  } else {
    Session.set('isUserUpcomingActive', true);
  }
});


Template.userBookingRecordList.helpers({
  'upcomingActive': function(){
    return Session.get('isUserUpcomingActive');
  },
  'isUpcomingSelected': function(){
    if(Session.get('isUserUpcomingActive')){
      return "selected";
    } else {
      return "";
    }
  },
  'isHistorySelected': function(){
    if(Session.get('isUserUpcomingActive')){
      return "";
    } else {
      return "selected";
    }
  }
});

Template.userBookingRecordList.events({
  'click .upcoming-tab': function(event, template) {
    Session.set('isUserUpcomingActive', true);
  },
  'click .history-tab': function(event) {
    Session.set('isUserUpcomingActive', false);
  }
});

Template.userUpcomingRecords.helpers({
  // 'upcomingRecords': function(){
  //   var now = Session.get("serverNow");
  //   return Transactions.find({timestampStart: { $gt: now } });
  // }
});

Template.userHistoryRecords.helpers({
  // 'historyRecords': function(bookeeId){
  //   var now = Session.get("serverNow");
  //   return Transactions.find({timestampStart: { $lt: now } });
  // }
});



Template.userBookingCell.helpers({
  'firstName': function(bookeeId){
    //  console.log(this.parkingSpaceImg);
     return Profile.findOne({userId: bookeeId}).firstName;
  },
  'lastName': function(bookeeId){
    //  console.log(this.parkingSpaceImg);
     return Profile.findOne({userId: bookeeId}).lastName;
  },
  'timeslotTypeText': function() {
    var timeslotType = this.timeslotType
		var timeslot = [
			{type: 0, text:'8am - 10pm'},
			{type: 1, text:'10pm - 8am'},
			{type: 2, text:'8am - 8am'},
			{type: 3, text:'9am - 5pm'}
		];
		if(timeslotType < 3){
			return timeslot[timeslotType].text;
		} else if(timeslotType === 3){
			var timeslotArray = this.timeslotArray
			var timeSlotText = ['9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm'];
			var startTimeIndex = _.min(timeslotArray) - 3;
			var endTimeIndex = _.max(timeslotArray) - 2;
			return timeSlotText[startTimeIndex] + ' - ' + timeSlotText[endTimeIndex];
		}
    // return timeSlotText[this.startTime] + ' - ' + timeSlotText[this.endTime];
  },
  locationText: function(){
    return ParkingSpaces.findOne({_id: this.spaceId}).locationText;
  },
  floorText: function(){
    return ParkingSpaces.findOne({_id: this.spaceId}).spaceFloor;
  },
  showImg: function(){
    if(ParkingSpaces.findOne({_id: this.spaceId})){
      return ParkingSpaces.findOne({_id: this.spaceId}).parkingSpaceImg
    } else {
      return ""
    }
  }
});

Template.userBookingCell.events({
  'click .user-view-booking-cell': function(){
    var receiptRoute = '/bookingReceiptOngoing/' + this._id;
    Router.go(receiptRoute);
  }
})
