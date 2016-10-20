Template.selectCreditCard.helpers({
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

Template.selectCreditCard.events({
  'click .credit-card-cell': function(event, template){
    console.log($(event.currentTarget).attr('data-index'));
    Session.set('selectedCCIndex', $(event.currentTarget).attr('data-index'))
    Router.go('/bookingConfirmation');
  },
  'click .cc-add': function(){
    Router.go('/accountMain/addCreditCard?back=selectCreditCard');
  }
});

Template.selectCreditCard.onCreated(function(){
  this.creditCards = new ReactiveVar();
});

Template.selectCreditCard.onRendered(function(){
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
