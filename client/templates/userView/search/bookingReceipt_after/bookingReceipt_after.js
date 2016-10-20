var timeSlotText = [
	'6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
	'6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am'
];

Template.bookingReceiptAfter.events({
  'click .userRatings': function(event, template){
    // console.log($(event.target).attr('data-value'));
    var rating = parseInt($(event.target).attr('data-value')) + 1;
    var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
    Meteor.call('setRating', spaceId ,Meteor.userId(), rating);
    Session.set('userRated', true);
  },
	'click .contactBtn': function(e,t) {
		var PhoneNumber = Profile.findOne().mobile.country.toString() +  Profile.findOne().mobile.number.toString();
		window.location.href="tel://+"+PhoneNumber;
	},
	'click .reportBtn': function(event, target){
		Router.go('/reportIssueType/' + Router.current().params._id)
	},
})

Template.bookingReceiptAfter.helpers({
	locationText: function(){
		var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
		return ParkingSpaces.findOne({_id: spaceId}).locationText;
	},
	spaceFloor: function(){
		var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
		return ParkingSpaces.findOne({_id: spaceId}).spaceFloor;
	},
	spaceNum: function(){
		var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
		return ParkingSpaces.findOne({_id: spaceId}).spaceNum;
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
  bookingRef: function(){
		return Router.current().params._id;
	},
  userRatings: function(){
    return [0,1,2,3,4];
  },
  userRated: function(){
    return Session.get('userRated');
  },
  isFullStar: function(index){
    var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
    var allRatings = ParkingSpaces.findOne({_id: spaceId}).ratings;
    var userRate = _.find(allRatings, {'userId': Meteor.userId()});
    if(userRate){
      userRate = userRate.rate;
    } else {
      userRate = 0;
    }
    return index < userRate;
  },
	transactionInfo: function(){
		return Transactions.findOne({_id: Router.current().params._id})
	},
	spaceImage: function(){
		var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
		return ParkingSpaces.findOne({_id: spaceId}).parkingSpaceImg;
	}
})

Template.bookingReceiptAfter.onRendered(function(){
  Session.set('userRated', false);
})
