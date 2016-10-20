//2Park User Booking Routes

Router.route('/userBookingRecordList',{
  name: 'userBookingRecordList',
  data: function(){
    var now = Session.get("serverNow");
    return {  'upcomingRecords': Transactions.find({timestampEnd: { $gt: now } }, {sort: {timestampStart: 1}}),
              'historyRecords': Transactions.find({timestampEnd: { $lt: now } }, {sort: {timestampStart: -1}})}
  },
  subscriptions: function(){
    return [Meteor.subscribe('UserBookingRecords')];
  }
});

Router.route('/myGarage', {
  name: 'myGarage',
  data: function(){
    return Profile.findOne({userId: Meteor.userId()})
  },
  subscriptions: function(){
    return Meteor.subscribe('ownProfile');
  }
});

Router.route('reportIssueType/:_id', {
  name: 'reportIssueType',
  subscriptions: function(){
    return Meteor.subscribe('transactionById', Router.current().params._id);
  }
})
Router.route('reportPhotoProof', {
  name: 'reportPhotoProof'
})
Router.route('reportFinish/:_id', {
  name: 'reportFinish',
  subscriptions: function(){
    return Meteor.subscribe('issueById', Router.current().params._id);
  }
})
