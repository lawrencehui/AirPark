var spaceTypeText = [
	"Residential",
	"Commercial",
	"Industrial",
	"Others"
];

var parkingAreaText = ['Indoor', 'Outdoor'];

Template.manageSpacesSummary.helpers({
	// 'showImg': function(imgId){
	// 	return Images.findOne({_id: imgId}).url();
	// },
	'spaceTypeText': function(){
		return spaceTypeText[this.spaceType];
	},
	'parkingAreaTypeText': function(){
		return parkingAreaText[this.parkingAreaType];
	},
	'noOfBooking': function(){
		var now = Session.get("serverNow");
		return Transactions.find({timestampEnd: {$lt: now}}).count();
	},
	'noOfUpcoming': function(){
		var now = Session.get("serverNow");
		return Transactions.find({timestampEnd: {$gt: now}}).count();
	},
	'ratesAndAvailabilityRoute': function(){
		return "/ratesAndAvailability/" + Router.current().params._id;
	},
	'accessRoute': function(){
		return "/access/" + Router.current().params._id;
	},
	'accessText': function(){
		var accessSelected = this.access;
		if(accessSelected){
			if(accessSelected.everyone){
				return 'Everyone';
			} else if(_.some(accessSelected.groups)){
				return 'Custom'
			} else if(accessSelected.freeGroup){
				return 'Guest Only'
			} else {
				return 'Not Set'
			}
		} else {
			return 'Not Set'
		}
	},
	'ratesText': function(){
		var rates = this.rates;
		if(rates){
			if(_.some(rates, function(element, index, list){
				return element.available;
			})){
				return 'Set'
			} else {
				return 'Not Set'
			}
		} else {
			return 'Not Set'
		}
	},
	'availableText': function(){
		var availability = this.availability;
		if(availability){
			if(_.some(availability, function(element, index, list){
				return element.available;
			})){
				return 'Set'
			} else {
				return 'Not Set'
			}
		} else {
			return 'Not Set'
		}
	},
	'isActive': function(){
		console.log(this)
		if(this.status == 4){
			return 'active'
		} else {
			return 'inactive'
		}
	}
});

Template.manageSpacesSummary.events({
	'click .view-booking': function(){
		Router.go('/viewBookingRecord/' + Router.current().params._id + '?type=history');
	},
	'click .view-booking-upcoming': function(){
		Router.go('/viewBookingRecord/' + Router.current().params._id);
	},
	'click input#statusToggle': function(event, template){
		if(event.target.checked){
			console.log(this)
			var rates = _.map(this.rates, function(element){
				return element.available;
			})
			var availability = _.map(this.availability, function(element){
				return element.available;
			})
			if(_.some(rates) && _.some(availability)){
				var c = confirm('Are you sure to activate?');
				if(c){
					Meteor.call('toggleStatus', Router.current().params._id, 4);
				} else {
					event.target.checked = false
				}
			} else {
				alert('Please set rates & availability')
				event.target.checked = false
			}
		} else {
			Meteor.call('toggleStatus', Router.current().params._id, 3);
		}
	}
});

Template.manageSpacesSummary.onRendered(function ( ){

		Session.set('customeGroupSelected', null);
		Session.set('accessSelected', null);
		Session.set('isChecked0', null);
		Session.set('isChecked1', null);
		Session.set('isChecked2', null);
		Session.set('rates0', null);
		Session.set('rates1', null);
		Session.set('rates2', null);
		Session.set('availability', null);
		Session.set('isSetHours', null);
		Session.set('isSetSpecificHours', null);

		if(Template.instance().data.status == 4){
			console.log('toggleOn')
			$('input#statusToggle')[0].checked = true;
		} else {
			console.log('toggleOff')
			$('input#statusToggle')[0].checked = false;
		}

	})
