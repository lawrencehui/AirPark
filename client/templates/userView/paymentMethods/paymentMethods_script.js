Template.paymentMethods.helpers({
  creditCards: function() {
		return Template.instance().creditCards.get();
	},

	cardType: function() {
		switch (this.cardType) {
			case 'Visa':
				return 'fa-cc-visa'
				break;
			case 'MasterCard':
				return 'fa-cc-mastercard'
				break;
			case 'American Express':
				return 'fa-cc-amex'
				break;
			case 'Diners Club':
				return 'fa-cc-diners-club'
				break;
			case 'Discover':
				return 'fa-cc-discover'
				break;
			case 'JCB':
				return 'fa-cc-jcb'
				break;
			default:
				return 'fa-cc'
		}
	},

	maskedNumber: function() {
		return this.maskedNumber;
	},
});

Template.paymentMethods.events({
  'click .cc-add': function(){
    Router.go('addCreditCard');
  },
  'click .removeCCBtn': function(){
    var r = confirm('Confirm remove payment method?');
    if(r){
      console.log('remove');
      console.log(this);
      Meteor.call('deleteCreditCard', this.token, function(error, result){
        if(error){
          console.log(error)
        } else {
          Router.go('wallet')
        }
      })
    }
  }
});

Template.paymentMethods.onCreated(function(){
  this.creditCards = new ReactiveVar();
});

Template.paymentMethods.onRendered(function(){
  Meteor.call('getCustomerObj', function(err, result) {
    if(err) {
      console.log('getCustomerObj: Error: ');
      console.dir(err);
    } else {
      console.log('getCustomerObj: Result: ');
      console.dir(result.creditCards);
      // console.log(this);
      this.creditCards.set(result.creditCards);
    }
  }.bind(this));
})
