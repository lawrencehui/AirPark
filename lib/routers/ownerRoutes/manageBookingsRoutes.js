//2Park Owner manageBooking Routes

Router.route('/manageSpacesList',{
  name: 'manageSpacesList',
  data: function(){
    return {'ownerSpaces': ParkingSpaces.find({ownerId: Meteor.userId()}, {sort: {lastUpdatedAt: -1, createdAt: -1} }) }
  },
  subscriptions: function(){
    return [Meteor.subscribe('OwnerManageSpaces', Meteor.userId())];
  }
});

Router.route('/pickLocationView',{
  name: 'pickLocationView',
  subscriptions: function(){
    return [Meteor.subscribe('ParkingSpaces')];
  },
  // onBeforeAction: function() {
  //   GoogleMaps.load({
  // 		key: 'AIzaSyDnm1-5orJHJI-_u5MMo2I2jqVDq2hr7UI',
  // 		libraries: 'places'
  // 	});
  // 	GoogleMaps.loadUtilityLibrary('/geolocation-marker.js');
  // 	this.next();
  // }
});

Router.route('/floorAndSpace', {
  name: 'floorAndSpace'
});

Router.route('/floorView',{
  name: 'floorView'
});

Router.route('/spaceNumberView',{
  name: 'spaceNumberView'
});

Router.route('/licensePlateView',{
  name: 'licensePlateView'
});

Router.route('/spaceTypeView',{
  name: 'spaceTypeView'
});

Router.route('/inOutDoorView',{
  name: 'inOutDoorView'
});

Router.route('/instructionView',{
  name: 'instructionView'
});

Router.route('/spaceFeatures',{
  name: 'spaceFeatures'
});

Router.route('/additionalInfoView',{
  name: 'additionalInfoView'
});

// Router.route('/reviewSpaceDetails',{
//   name: 'reviewSpaceDetails',
//   waitOn: function(){
//     return [Meteor.subscribe('ParkingSpaces')];
//   }
// });

Router.route('/uploadImagesView/:_id',{
  name: 'uploadImagesView',
  data: function(){
    return {'ownerSpace': ParkingSpaces.findOne({'_id': this.params._id }) }
  },
  subscriptions: function(){
    return [Meteor.subscribe('ParkingSpaces')];
  }
});

Router.route('/ownerVerification', {
  name: 'ownerVerification',
  data: function(){
    return {'ownerSpace': ParkingSpaces.findOne({'_id': this.params.query.spaceId }) }
  },
  subscriptions: function(){
    return [Meteor.subscribe('ParkingSpaces')];
  }
});

Router.route('/sumbitReview/:_id', {
  name: 'sumbitReview',
  data: function(){
    return ParkingSpaces.findOne({'_id': this.params._id});
  },
  subscriptions: function(){
    return Meteor.subscribe('ParkingSpacesByID', this.params._id);
  }
});

Router.route('/reviewThanks', {
  name: 'reviewThanks'
});

Router.route('/spaceScheduleDetailsView/:_id',{
  name: 'spaceScheduleDetailsView'
});


Router.route('/priceSettings/:_id', {
  name: 'priceSettings',
  data: function(){
    return {'timeslotsInfo': Timeslots.find({ 'spaceId': this.params._id}) };
  },
  waitOn: function(){
    return [ Meteor.subscribe('OwnerManageSpaces', Meteor.userId()), Meteor.subscribe('Timeslots')];
  },
  onBeforeAction: function () {
    if (this.ready()) {
      console.log('subscription is ready');
      // var isApproved = ParkingSpaces.findOne({_id: this.params._id}).isApproved;
      if (ParkingSpaces.findOne({_id: this.params._id}).status == 4) {
        // console.log(isApproved);
        this.next();
      } else if (ParkingSpaces.findOne({_id: this.params._id}).status == 1){
        console.log('space is editing');
        this.redirect('/sumbitReview/' + this.params._id);
      } else if (ParkingSpaces.findOne({_id: this.params._id}).status == 2){
        console.log('space is not approved yet');
        this.redirect('/sumbitReview/' + this.params._id);
      }
    }
  }
});
