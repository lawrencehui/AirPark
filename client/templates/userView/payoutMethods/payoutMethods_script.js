Template.payoutMethods.helpers({
  testing: function(){
    console.log(this)
    return "test"
  }
});

Template.payoutMethods.events({
  'click .removeCCBtn': function(event, template){
    console.log(this);
    Meteor.call('removeBankAccount', Meteor.userId(), this);
  }
});

Template.payoutMethods.onCreated(function(){
});

Template.payoutMethods.onRendered(function(){
})
