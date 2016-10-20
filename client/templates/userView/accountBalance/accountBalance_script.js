Template.accountBalance.helpers({
  grossEarning: function(){
    return grossEarning(this.transactionHistory);
  },
  completedPayout: function(){
    return completedPayout(this.payoutHistory);
  },
  futurePayout: function(){
    return futurePayout(this.payoutHistory);
  },
  accountBalance: function(){
    var accountBalance = grossEarning(this.transactionHistory) - completedPayout(this.payoutHistory) - futurePayout(this.payoutHistory);
    Session.set('accountBalance', accountBalance);
    return accountBalance
  }
});

function grossEarning(transactionHistory){
  return _.reduce(transactionHistory.fetch(), function(memo, element){
    return parseInt(memo) + parseInt(element.amount);
  }, 0);
}

function completedPayout(payoutHistory){
  return _.reduce(payoutHistory.fetch(), function(memo, element){
    if(element.paidAt){
      return parseInt(memo) + parseInt(element.amount);
    } else {
      return memo;
    }
  }, 0);
}

function futurePayout(payoutHistory){
  return _.reduce(payoutHistory.fetch(), function(memo, element){
    if(element.paidAt){
      return memo;
    } else {
      return parseInt(memo) + parseInt(element.amount);
    }
  }, 0);
}

Template.accountBalance.events({

});

Template.accountBalance.onCreated(function(){
});

Template.accountBalance.onRendered(function(){
})
