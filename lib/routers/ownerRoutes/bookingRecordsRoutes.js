// Router.route('/bookingRecordList',{
//   name: 'bookingRecordList',
//   data: function(){
//     return {'parkingSpaces': ParkingSpaces.find({}) }
//   },
//   subscriptions: function(){
//     return [Meteor.subscribe('OwnerBookingRecords')];
//   }
// });

Router.route('/viewBookingRecord/:_id',{
  name: 'viewBookingRecord',
  data: function(){
    var now = Session.get("serverNow");
    return {  'upcomingRecords': Transactions.find({timestampEnd: { $gt: now } }, {sort: {timestampStart: 1}}),
              'historyRecords': Transactions.find({timestampEnd: { $lt: now } }, {sort: {timestampStart: -1}})}
  },
  waitOn: function(){
    return [Meteor.subscribe('bookingRecordOfSpace', this.params._id), Meteor.subscribe('OwnerBookingRecords')];
  },
  onBeforeAction: function () {
    if (this.ready()) {
      console.log('subscription is ready');
      var status = ParkingSpaces.findOne({_id: this.params._id}).status;

      if (status == 3 || status == 4) {
        // console.log('isApproved');
        this.next();

      } else {
        console.log('space is not approved yet');
        this.redirect('sumbitReview', {_id: this.params._id});
      }
    }
  }
});
