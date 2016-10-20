//2Park General Account Routes

Router.route('/wallet', {
  name: 'wallet'
})

Router.route('/accountMain', {
  name: 'accountMain',
  waitOn: function(){
    return Meteor.subscribe('ownProfile');
  },
  data: function(){
    return Profile.findOne({userId: Meteor.userId()});
  }
});

Router.route('/accountMain/addCreditCard', {
  name: 'addCreditCard',
  template: 'addCreditCard',
  subscriptions: function(){
    return Meteor.subscribe('ownProfile');
  },
  data: function(){
    return Profile.findOne({userId: Meteor.userId()});
  },
  onStop: function(){
    Session.set('isAddingBankAccountWhileConfirming', null);
  }
});

Router.route('/accountMain/editBankAccount', {
  name: 'editBankAccount',
  template: 'editBankAccount',
  subscriptions: function(){
    return Meteor.subscribe('ownProfile');
  },
  // data: function(){
  //   return Profile.findOne({userId: Meteor.userId()});
  // }
});


Router.route('/paymentMethods',{
  name: 'paymentMethods'
});

Router.route('/payoutMethods',{
  name: 'payoutMethods',
  subscriptions: function(){
    return Meteor.subscribe('ownProfile');
  },
  data: function(){
    return Profile.findOne({userId: Meteor.userId()});
  }
});

Router.route('/addBankAccountDetails',{
  name: 'addBankAccountDetails',
  // subscriptions: function(){
  //   return Meteor.subscribe('ownProfile');
  // },
  // data: function(){
  //   // console.log(Profile.findOne({userId: Meteor.userId()}))
  //   return Profile.findOne({userId: Meteor.userId()});
  // }
});

Router.route('/accountBalance',{
  name: 'accountBalance',
  data: function(){
    return {
      transactionHistory: Transactions.find({ownerId: Meteor.userId()}, {sort: {timestampStart: -1}}),
      payoutHistory: Payouts.find({userId: Meteor.userId()}, {sort: {requestedAt: -1}})
    }
  },
  subscriptions: function(){
    return [Meteor.subscribe('userTransactionRecords'), Meteor.subscribe('userPayoutRecords')];
  }
});

Router.route('/transactionHistory',{
  name: 'transactionHistory',
  data: function(){
    return Transactions.find({ownerId: Meteor.userId()}, {sort: {timestampStart: -1}})
  },
  subscriptions: function(){
    return [Meteor.subscribe('userTransactionRecords'), Meteor.subscribe('userPayoutRecords')];
  }
});

Router.route('/payoutHistory',{
  name: 'payoutHistory',
  data: function(){
    return Payouts.find({userId: Meteor.userId()}, {sort: {requestedAt: -1}})
  },
  subscriptions: function(){
    return Meteor.subscribe('userPayoutRecords')
  }
});

Router.route('/requestPayout',{
  name: 'requestPayout',
  data: function(){
    return Profile.findOne({userId: Meteor.userId()});
  },
  subscriptions: function(){
    return Meteor.subscribe('ownProfile');
  }
});
