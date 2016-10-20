Template.accountMain.helpers({
	// creditCards: function() {
	// 	return Template.instance().creditCards.get();
	// },
	//
	// cardType: function() {
	// 	switch (this.cardType) {
	// 		case 'Visa':
	// 			return 'fa-cc-visa'
	// 			break;
	// 		case 'MasterCard':
	// 			return 'fa-cc-mastercard'
	// 			break;
	// 		case 'American Express':
	// 			return 'fa-cc-amex'
	// 			break;
	// 		case 'Diners Club':
	// 			return 'fa-cc-diners-club'
	// 			break;
	// 		case 'Discover':
	// 			return 'fa-cc-discover'
	// 			break;
	// 		case 'JCB':
	// 			return 'fa-cc-jcb'
	// 			break;
	// 		default:
	// 			return 'fa-cc'
	// 	}
	// },
	//
	// maskedNumber: function() {
	// 	return this.maskedNumber;
	// },
	//
	// hasReceivingAcount: function() {
	// 	if(this.bankAccount) {
	// 		return true
	// 	} else {
	// 		return false
	// 	}
	// }
	isDisabled: function(){
		if(Session.get('editProfileStatus')){
			return false
		} else {
			return true
		}
	}
});

Template.accountMain.onCreated(function() {
	// this.creditCards = new ReactiveVar();
});

Template.accountMain.events({
	'click button.edit-profile-button': function(event, template){
		event.preventDefault();
		Session.set('editProfileStatus', true)
		$(".disabled").removeClass('disabled')
	}
})

Template.accountMain.onRendered(function() {
	Session.set('editProfileStatus', false)
	// Meteor.call('getCustomerObj', function(err, result) {
	// 	if(err) {
	// 		console.log('getCustomerObj: Error: ');
	// 		console.dir(err);
	// 	} else {
	// 		console.log('getCustomerObj: Result: ');
	// 		console.dir(result.creditCards);
	// 		// console.log(this);
	// 		this.creditCards.set(result.creditCards);
	// 	}
	// }.bind(this));
});

var editProfileHook = {
	onSuccess: function(){
		Router.go('/')
	},
	onError: function(operation, error, template){
		alert(error);
	}
}

AutoForm.hooks({
	'editProfile': editProfileHook
})
