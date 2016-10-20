Template.bookingThanks.helpers({
	});

Template.bookingThanks.events({
	});

Template.bookingThanks.onRendered(function ( ){
	Session.set('bookingThanks', true)
});

Template.bookingThanks.onDestroyed(function(){
	Session.set('bookingThanks', false)
});
