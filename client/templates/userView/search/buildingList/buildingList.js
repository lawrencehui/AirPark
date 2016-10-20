Template.buildingList.onRendered(function() {
  Session.set("detailPreviousPath", 'main');
  Session.set("bookingSpaceId", Session.get('clusterMarkersStore')[0])

  Meteor.subscribe('ParkingSpacesByIDArray', Session.get('clusterMarkersStore'))
  Meteor.subscribe('ownProfile')
});

Template.buildingList.helpers({
  getFirstLocationText: function() {
    var markers = Session.get('clusterMarkersStore');
    console.log(markers)
    console.log(ParkingSpaces.findOne({_id: markers[0]}))
    return ParkingSpaces.findOne({_id: markers[0]}).locationText;
  },
  totalSpaces: function() {
    var markers = Session.get('clusterMarkersStore');
    // var uniqueMarker = _.uniqBy(markers, function(id){
    //   var spaceId = Timeslots.findOne({_id: id}).spaceId;
    //   console.log(spaceId);
    //   return spaceId;
    // });
    return markers.length;
  },
  parkingSpaces: function(){
    var markers = Session.get('clusterMarkersStore');
    return ParkingSpaces.find({_id: {$in: markers}}).fetch();
  },
  // timeslots: function() {
  //   var markers = Session.get('clusterMarkersStore');
  //   console.dir(markers);
  //   var uniqueMarker = _.uniqBy(markers, function(id){
  //     var spaceId = Timeslots.findOne({_id: id}).spaceId;
  //     return spaceId;
  //   });
  //   var groupedTimeslots = _.map(uniqueMarker, function(id){
  //     var spaceId = Timeslots.findOne({_id: id}).spaceId;
  //     var timeslotsArray = _.filter(markers, function(id){
  //       return Timeslots.findOne({_id: id}).spaceId == spaceId;
  //     })
  //     return {spaceId: spaceId, timeslotsArray: timeslotsArray};
  //   });
  //   console.log(groupedTimeslots);
  //   // return Timeslots.find({_id: {$in: markers} });
  //   return groupedTimeslots
  // },

  // getTimeSlotFloor: function(spaceId) {
  //   return ParkingSpaces.findOne({_id: spaceId}).spaceFloor;
  // },

  // showImg: function(parkingSpaceImgId){
  //   console.log(parkingSpaceImgId)
  //   // var parkingSpaceImgId =  ParkingSpaces.findOne({_id: spaceId}).parkingSpaceImg;
  //   return Images.findOne({_id: parkingSpaceImgId}).url();
  // },
  timeslotPrice: function(){
    console.log(this);
    var isFree = false
    if(this.access){
      if(this.access.freeGroup){
        var ownerProfile = Profile.findOne({userId: this.ownerId});
        var userProfile = Profile.findOne({userId: Meteor.userId()});
        if(ownerProfile && userProfile){
          if(ownerProfile.freeGroup){
            if(_.indexOf(ownerProfile.freeGroup, userProfile.email) > -1){
              console.log('free')
              isFree = true;
            }
          }
        }
      }
    }
    if(isFree){
      return 0;
    } else {
      // var startTime = Session.get('bookingStartTime');
      // var endTime = Session.get('bookingEndTime');
      // var price = 0;
      // if(this.rates[2].available){
      //   price = (parseInt(endTime) - parseInt(startTime)) * this.rates[2].value;
      // } else {
      //   if(endTime == 24){
      //     price = 8 * this.rates[1].value + (16 - parseInt(startTime)) * this.rates[0].value
      //   } else {
      //     price = (parseInt(endTime) - parseInt(startTime)) * this.rates[0].value;
      //   }
      // }
      // console.log(price);
      // return parseInt(price / (endTime - startTime));
      var timeslotType = Session.get('bookingTimeslotType');
      return this.rates[timeslotType].value;
    }
  },
  userRatings: function(){
    return [0,1,2,3,4];
  },
  isFullStar: function(index){
    var parkingSpace = Template.parentData(1);
    console.log(parkingSpace);
    var allRatings = parkingSpace.ratings;
    console.log(allRatings);
    var averageRate = 0;
    if(allRatings.length > 0){
      averageRate = _.reduce(allRatings, function(memo, num){
        return parseInt(memo) + parseInt(num.rate);
      }, 0)/allRatings.length;
      console.log(averageRate);
    }
    var averageRate = Math.round(averageRate);
    return index < averageRate;
  }

});

Template.buildingList.events({
  'click .spaceList-cell': function(e) {
    // var parkingSpaceId = ParkingSpaces.findOne({_id: this.spaceId})._id;
    console.log("click .spaceList-cell");
    Session.set("detailPreviousPath", 'buildingList');
    Session.set("bookingSpaceId", this._id)
    // Router.go('bookingConfirmation', {_id: this._id} );
    Router.go('bookingDetails');
  }
});
