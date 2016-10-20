Meteor.publishComposite('UserSearchSpaces', function() {
  return {
    find: function() {
      return ParkingSpaces.find({status: 4});
    },
    children: [
      {
        find: function(parkingSpace){
          return Timeslots.find( {spaceId: parkingSpace._id} );
        }
      },
      {
        find: function(parkingSpace){
          return Profile.find({userId: parkingSpace.ownerId}, {fields: {freeGroup: 1, userId: 1}})
        }
      }
    ]
  }
});

Meteor.publish('ParkingSpaces', function(){
  return ParkingSpaces.find();
});

Meteor.publishComposite('ParkingSpacesByID', function(spaceId){
  return {
    find: function(){
      return ParkingSpaces.find({_id: spaceId});
    },
    children: [
      // {
      //   find: function(parkingSpace){
      //     return Images.find({$or: [{_id: parkingSpace.parkingSpaceImg}, {_id: parkingSpace.parkingBuildingImg}, {_id: parkingSpace.parkingVerificationImg}]});
      //   }
      // },
      {
        find: function(parkingSpace){
          return Profile.find({userId: parkingSpace.ownerId}, {fields: {freeGroup: 1, userId: 1}})
        }
      }
    ]
  }
});

Meteor.publishComposite('ParkingSpacesByIDArray', function(spaceIdArray){
  return {
    find: function(){
      return ParkingSpaces.find({_id: {$in: spaceIdArray}});
    },
    children: [
      // {
      //   find: function(parkingSpace){
      //     return Images.find({$or: [{_id: parkingSpace.parkingSpaceImg}, {_id: parkingSpace.parkingBuildingImg}, {_id: parkingSpace.parkingVerificationImg}]});
      //   }
      // },
      {
        find: function(parkingSpace){
          return Profile.find({userId: parkingSpace.ownerId}, {fields: {freeGroup: 1, userId: 1}})
        }
      }
    ]
  }
});

Meteor.publishComposite('OwnerManageSpaces', function(ownerId){
  return {
    find: function(){
      return ParkingSpaces.find({ownerId: ownerId}, {sort: {createdAt: -1} } );
    }
  }
});


Meteor.publish('OwnerBookingRecords', function(){
  return ParkingSpaces.find({ ownerId: this.userId });
});

Meteor.publishComposite('UserBookingRecords', function(){
  return {
    find: function(){
      return Transactions.find({bookeeId: this.userId}, {sort: {createdAt: -1}});
    },
    children: [
      {
        find: function(transaction){
          return ParkingSpaces.find({_id: transaction.spaceId})
        }
      }
    ]
  }
})

Meteor.publishComposite('bookingRecordOfSpace', function(spaceId){
  return {
    find: function(){
      return Transactions.find({spaceId: spaceId}, {sort: {createdAt: -1} } );
    },
    children: [
      {
        find: function(transaction){
          return Profile.find({userId: transaction.bookeeId}, {fields: {firstName: 1, lastName: 1} });
        }
      }
    ]
  }
});

Meteor.publish('Timeslots', function(){
  return Timeslots.find({});
});

Meteor.publish('Transactions', function(){
  return Transactions.find({});
});

Meteor.publishComposite('parkingReceiptData', function(transactionId){
  return {
    find: function() {
      return Transactions.find({_id: transactionId});
    },
    children: [
      // {
      //   find: function(transaction){
      //     return Timeslots.find( {_id: transaction.timeslotId} );
      //   }
      // },
      {
        find: function(transaction){
          return ParkingSpaces.find( {_id: transaction.spaceId} );
        }
      },
      {
        find: function(transaction){
          return Profile.find({userId: transaction.ownerId}, {fields: {"mobile.country": 1, "mobile.number": 1, reportImgId: 1} });
        }
      }
    ]
  }
});


Meteor.publish('ownProfile', function () {
  return Profile.find({userId: this.userId});
});

// Meteor.publish('Images', function(){
//   return Images.find();
// });

// Meteor.publish('uploadedImages', function(imgIds){
//   // console.log(imgIds + "is re-subscribing");
//   return Images.find({_id: {$in: imgIds} });
// });

Meteor.publishComposite('userTransactionRecords', function(){
  return {
    find: function(){
      return Transactions.find({ownerId: this.userId});
    },
    children: [
      {
        find: function(transaction){
          return ParkingSpaces.find({_id: transaction.spaceId});
        }
        // children: [
        //   {
        //     find: function(parkingSpace){
        //       return Images.find({_id: parkingSpace.parkingSpaceImg});
        //     }
        //   }
        // ]
      }
    ]
  }
});

Meteor.publishComposite('parkingSpaceDetail', function(spaceId){
  return {
    find: function(){
      return ParkingSpaces.find({_id: spaceId});
    },
    children: [
      {
        find: function(space){
          return Transactions.find({spaceId: space._id})
        }
      }
    ]
  }
})

Meteor.publish('spaceTimeslot', function(spaceId){
  return Timeslots.find({spaceId: spaceId});
})

Meteor.publish('userPayoutRecords', function(){
  console.log(Payouts.find().fetch())
  console.log(this.userId)
  return Payouts.find({userId: this.userId});
})

Meteor.publish('issueById', function(issueId){
  return Issues.find({_id: issueId});
})

Meteor.publish('transactionById', function(transactionId){
  return Transactions.find({_id: transactionId});
})
