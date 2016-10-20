Template.reportIssueType.helpers({
  isDriver: function(){
    var transaction = Transactions.findOne({_id: Router.current().params._id})
    if(transaction.bookeeId === Meteor.userId()){
      return true
    } else {
      return false
    }
  },
  isOwner: function(){
    var transaction = Transactions.findOne({_id: Router.current().params._id})
    if(transaction.ownerId === Meteor.userId()){
      return true
    } else {
      return false
    }
  }
});

Template.reportIssueType.events({
});

Template.reportIssueType.onCreated(function(){
});

Template.reportIssueType.onRendered(function(){
})
