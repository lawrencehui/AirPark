Router.route('/manageSpacesSummary/:_id',{
  name: 'manageSpacesSummary',
  data: function(){
    return ParkingSpaces.findOne({_id: Router.current().params._id});
  },
  subscriptions: function(){
    return [Meteor.subscribe('parkingSpaceDetail', Router.current().params._id)];
  },
  onBeforeAction: function () {
    if (this.ready()) {
      console.log('subscription is ready');
      // var isApproved = ParkingSpaces.findOne({_id: this.params._id}).isApproved;
      if (ParkingSpaces.findOne({_id: this.params._id}).status == 4) {
        // console.log('isApproved');
        this.next();
      } else if (ParkingSpaces.findOne({_id: this.params._id}).status == 1){
        console.log('space is editing');
        this.redirect('/sumbitReview/' + this.params._id);
      } else if (ParkingSpaces.findOne({_id: this.params._id}).status == 2){
        console.log('space is not approved yet');
        alert('space is not approved yet')
        this.redirect('/manageSpacesList');
      } else if (ParkingSpaces.findOne({_id: this.params._id}).status == 3){
        this.next();
      } else {
        this.next();
      }
    }
  }
});

Router.route('/ratesAndAvailability/:_id', {
  name: 'ratesAndAvailability',
  data: function(){
    return ParkingSpaces.findOne({_id: Router.current().params._id});
  },
  subscriptions: function(){
    return Meteor.subscribe('parkingSpaceDetail', Router.current().params._id);
  }
});

Router.route('/availability/:_id', {
  name: 'availability',
  data: function(){
    return ParkingSpaces.findOne({_id: Router.current().params._id});
  },
  subscriptions: function(){
    return [Meteor.subscribe('parkingSpaceDetail', Router.current().params._id), Meteor.subscribe('ownProfile')];
  }
});

Router.route('/access/:_id', {
  name: 'access',
  data: function(){
    return ParkingSpaces.findOne({_id: Router.current().params._id});
  },
  subscriptions: function(){
    return [Meteor.subscribe('parkingSpaceDetail', Router.current().params._id), Meteor.subscribe('ownProfile')];
  }
})

Router.route('/customGroup/:_id', {
  name: 'customGroup',
  data: function(){
    return ParkingSpaces.findOne({_id: Router.current().params._id});
  },
  subscriptions: function(){
    return [Meteor.subscribe('parkingSpaceDetail', Router.current().params._id), Meteor.subscribe('ownProfile')];
  }
})

Router.route('/customAvailability/:_id', {
  name: 'customAvailability',
  data: function(){
    return ParkingSpaces.findOne({_id: Router.current().params._id});
  },
  subscriptions: function(){
    return [Meteor.subscribe('parkingSpaceDetail', Router.current().params._id), Meteor.subscribe('ownProfile'), Meteor.subscribe('spaceTimeslot', Router.current().params._id)];
  }
})
