// var timeSlotText = [
//   '6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
//   '6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am'
// ];

Template.transactionHistory.helpers({
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
  statusText: function(){
    var now = moment().valueOf();
    if(now > this.timestampStart){
      return 'Completed'
    } else {
      return 'Pending'
    }
  },
  grossEarning: function(){
    return _.reduce(this.fetch(), function(memo, element){
      return parseInt(memo) + parseInt(element.amount);
    }, 0);
  }
});

Template.transactionHistory.events({

});

Template.transactionHistory.onCreated(function(){

});

Template.transactionHistory.onRendered(function(){

});
