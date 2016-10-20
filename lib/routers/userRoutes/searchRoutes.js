//2Park User Search Routes

Router.route('/main',{
  name: 'main',
  // subscriptions: function() {
  //   return [Meteor.subscribe('ownProfile')]
  // },
  // data: function(){
  //   return { 'parkingSpaces': ParkingSpaces.find({}),
  //             'timeslots': Timeslots.find({}) };
  // }

});

Router.route('/buildingList',{
  name: 'buildingList',
  // subscriptions: function() {
  //   return [Meteor.subscribe('UserSearchSpaces')]
  // },
  // data: function(){
  //   return { 'parkingSpaces': ParkingSpaces.find({}),
  //             'timeslots': Timeslots.find({}) };
  // }
});

Router.route('/parkingSpaceDetails/:_id',{
  name: 'parkingSpaceDetails',
  // waitOn: function() {
  //   return [Meteor.subscribe('UserSearchSpaces')]
  // },
  // data: function(){
  //   return { 'parkingSpaceInfo': ParkingSpaces.findOne({_id: this.params._id}),
  //             'timeslotInfo': Timeslots.findOne({spaceId: this.params._id}) };
  // }
});

Router.route('/bookingConfirmation',{
  name: 'bookingConfirmation',
  subscriptions: function() {
    return [ Meteor.subscribe('ownProfile'),
              Meteor.subscribe('spaceTimeslot', Session.get('bookingSpaceId'))];
  },
  data: function(){
    return {
      // 'timeslotInfo': Timeslots.findOne({_id: this.params._id}),
      'spaceInfo': ParkingSpaces.findOne({_id: Session.get('bookingSpaceId')}),
      'userProfile': Profile.findOne({userId: Meteor.userId()})
    };
  }
});

Router.route('/bookingDetails/',{
  name: 'bookingDetails',
  subscriptions: function() {
    return [  Meteor.subscribe('UserSearchSpaces'),
              Meteor.subscribe('ownProfile'),
              Meteor.subscribe('Transactions') ];
  },
  data: function(){
    return {
      // 'timeslotInfo': Timeslots.findOne({_id: this.params._id}),
      'spaceInfo': ParkingSpaces.findOne({_id: Session.get('bookingSpaceId')}),
      'userProfile': Profile.findOne({userId: Meteor.userId()})
    };
  }
});

Router.route('/bookingReceiptOngoing/:_id',{
  name: 'bookingReceiptOngoing',
  // subscriptions: function() {
  //   return [ Meteor.subscribe('parkingReceiptData', this.params._id)];
  // },
  // data: function(){
  //   var currentTransaction = Transactions.findOne({_id: this.params._id});
  //   console.log(currentTransaction)
  //   var spaceId = currentTransaction.spaceId;
  //   console.log(spaceId)
  //   return {
  //     // 'timeslotInfo': Timeslots.findOne({}),
  //             'parkingSpaceInfo': ParkingSpaces.findOne({_id: spaceId}),
  //             'transactionInfo': Transactions.findOne({_id: this.params._id})
  //           };
  // },
  onBeforeAction: function(){
    // var now = Session.get('serverNow');
    // var tran = Transactions.findOne({_id: this.params._id});
    // console.log(tran)
    // if (tran.timestampEnd > now){
    //   this.next()
    // } else {
    //   var receiptRoute = '/bookingReceiptAfter/' + this.params._id;
    //   Router.go(receiptRoute);
    // }
    this.next();
  },
  onRun: function(){
    var now = Session.get('serverNow');
    var tran = Transactions.findOne({_id: this.params._id});
    // console.log(tran)
    if (tran.timestampEnd > now){
      this.next()
    } else {
      var receiptRoute = '/bookingReceiptAfter/' + this.params._id;
      Router.go(receiptRoute);
    }
  },
  onStop: function(){
    // console.log('bookingReceiptOngoing onStop')
    Session.set('reportImg', null);
    Session.set('reportImgObj', null);
  }
});

Router.route('/bookingReceiptAfter/:_id',{
  name: 'bookingReceiptAfter',
  subscriptions: function() {
    return [ Meteor.subscribe('parkingReceiptData', this.params._id)];
  },
  // data: function(){
  //   console.log(this.params._id)
  //   var currentTransaction = Transactions.findOne({_id: this.params._id});
  //   console.log(currentTransaction)
  //   var spaceId = currentTransaction.spaceId;
  //   console.log(spaceId)
  //   return {
  //     // 'timeslotInfo': Timeslots.findOne({}),
  //             'parkingSpaceInfo': ParkingSpaces.findOne({_id: spaceId}),
  //             'transactionInfo': Transactions.findOne({_id: this.params._id})
  //           };
  // },
});

Router.route('bookingThanks');

Router.route('/selectCar', {
  name: 'selectCar',
  data: function(){
    return Profile.findOne({userId: Meteor.userId()})
  },
  subscriptions: function(){
    return Meteor.subscribe('ownProfile');
  }
});

Router.route('selectCreditCard');
