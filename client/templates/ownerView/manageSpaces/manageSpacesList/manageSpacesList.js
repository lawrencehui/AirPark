Template.manageSpacesList.helpers({
  // 'showImg': function(){
  //   //  console.log(this.parkingSpaceImg);
  //    return Images.findOne({_id: this.parkingSpaceImg}).url();
  // },
  'pending': function(){
    if(this.status == 2){
      return true
    } else {
      return false
    }
  },
  'editing': function(){
    if(this.status == 1){
      return true
    } else {
      return false
    }
  },
  'isInactive': function(){
    if(this.status == 3){
      return true
    } else {
      return false
    }
  },
  'isActive': function(){
    if(this.status == 4){
      return true
    } else {
      return false
    }
  },
  'isNotApproved': function(){
    if(this.status == 5){
      return true
    } else {
      return false
    }
  },
  userRatings: function(){
    return [0,1,2,3,4];
  },
  isFullStar: function(index){
		// var parkingSpace = ParkingSpaces.findOne({_id: Session.get("bookingSpaceId")});
    // console.log(this);
    // console.log(Template.parentData(1));
    var allRatings = Template.parentData(1).ratings;
    // console.log(allRatings);
    var averageRate = 0;
    if(allRatings){
      if(allRatings.length > 0){
        averageRate = _.reduce(allRatings, function(memo, num){
          return parseInt(memo) + parseInt(num.rate);
        }, 0)/allRatings.length;
        // console.log(averageRate);
      }
    }
    var averageRate = Math.round(averageRate);
    return index < averageRate;
  }
});

Template.manageSpacesList.events({
  'click .booking-records-image': function(event, template) {
    Router.go('manageSpacesSummary', {_id: this._id});
  },
  'click .booking-records-content': function(event, template) {
    Router.go('manageSpacesSummary', {_id: this._id});
  },
  'click .delete-space-container': function(event, template){
    var r = confirm('Are you sure you want to delete the space?')
    if(r){
      // console.log('delete')
      Meteor.call('deleteSpace', this._id);
    }
  },
  'click .add-more': function(event) {
    Router.go('pickLocationView');
  }
});

Template.manageSpacesList.onCreated(function(){
  // this.floorInput = new ReactiveVar();

  Session.set("Lat_value", null);
  Session.set("Lng_value", null);
  Session.set("locationText", "");
  Session.set("spaceFloor_value", "");
  Session.set("spaceNumber_value", "");
  Session.set("licensePlate_value", "");
  Session.set("spaceType_value", 0);
  Session.set("parkingArea_value", 0);
  Session.set("instructions_value", "");

  Session.set("evToggle_value",false);
  Session.set("disabled_value",false);
  Session.set("oversizedToggle_value",false);

  Session.set('parkingSpaceImg', "");
  Session.set('parkingBuildingImg', "");
  Session.set('parkingVerificationImg', "");

});
