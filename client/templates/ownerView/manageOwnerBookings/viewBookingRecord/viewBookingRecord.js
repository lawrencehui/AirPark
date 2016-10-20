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

// var timeSlotText = [
// 	'6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
// 	'6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am'
// ]

Template.viewBookingRecord.onRendered(function(){
	if(Router.current().params.query.type == 'history'){
		Session.set('isOwnerUpcomingActive', false);
	} else {
		Session.set('isOwnerUpcomingActive', true);
	}
});


Template.viewBookingRecord.helpers({
  'upcomingActive': function(){
    return Session.get('isOwnerUpcomingActive');
  },
  'isUpcomingSelected': function(){
    if(Session.get('isOwnerUpcomingActive')){
      return "selected";
    } else {
      return "";
    }
  },
  'isHistorySelected': function(){
    if(Session.get('isOwnerUpcomingActive')){
      return "";
    } else {
      return "selected";
    }
  },

});

Template.viewBookingRecord.events({
  'click .upcoming-tab': function(event, template) {
    Session.set('isOwnerUpcomingActive', true);
  },
  'click .history-tab': function(event) {
    Session.set('isOwnerUpcomingActive', false);
  }
});

Template.ownerUpcomingRecords.helpers({
  // 'upcomingRecords': function(){
  //   var now = Session.get("serverNow");
  //   return Transactions.find({timestampStart: { $gt: now } });
  // }
});

Template.ownerHistoryRecords.helpers({
  // 'historyRecords': function(bookeeId){
  //   var now = Session.get("serverNow");
  //   return Transactions.find({timestampStart: { $lt: now } });
  // }
});



Template.ownerBookingCell.helpers({
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
  // 'showImg': function(){
  //   //  console.log(this.parkingSpaceImg);
  //   if(Images.findOne({_id: this.parkingSpaceImg})){
  //     return Images.findOne({_id: this.parkingSpaceImg}).url();
  //   } else {
  //     return ""
  //   }
  // },
});
