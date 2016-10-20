parkingSpaceSchema = new SimpleSchema({
  createdAt: {
    type: Date,
    autoform: {
      omit: true
    },
    autoValue: function(){
      if(this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    }
  },
  ownerId: {
    type: String,
    autoform: { omit: true },
    autoValue: function(){
      if(this.isInsert) {
        return Meteor.userId();
      } else {
        this.unset();
      }
    }
  },
  lat: {
    type: Number,
    optional: true,
    decimal: true
  },
  lng: {
    type: Number,
    optional: true,
    decimal: true
  },
  locationText: {
    type: String,
    optional: true
  },
  spaceFloor: {
    type: String,
    optional: true
  },
  spaceNum: {
    type: String,
    optional: true
  },
  // licensePlate: {
  //   type: String,
  //   optional: true
  // },
  spaceType: {
    type: Number,
    optional: true
  },
  parkingAreaType: {
    type: Number,
    optional: true
  },
  presetInstructions: {
    type: [Number],
    optional: true,
    maxCount: 3
  },
  instructions: {
    type: String,
    optional: true
  },
  height: {
    type: Number,
    optional: true,
    decimal: true
  },
  vehicleRestriction: {
    type: Number,
    optional: true
  },
  hasEVCharger: {
    type: Boolean,
    defaultValue: false,
  },
  hasDisableParking: {
    type: Boolean,
    defaultValue: false,
  },
  // hasOversizeParking: {
  //   type: Boolean,
  //   defaultValue: false,
  // },
  parkingSpaceImg: {
    type: String,
    optional: true,
    // autoform: {
    //   afFieldInput: {
    //     type: 'fileUpload',
    //     collection: 'Images'
    //   }
    // }
  },
  parkingBuildingImg: {
    type: String,
    optional: true,
    // autoform: {
    //   afFieldInput: {
    //     type: 'fileUpload',
    //     collection: 'Images'
    //   }
    // }
  },
  parkingVerificationImg: {
    type: String,
    optional: true,
    // autoform: {
    //   afFieldInput: {
    //     type: 'fileUpload',
    //     collection: 'Images'
    //   }
    // }
  },
  // isApproved: {
  //   type: Boolean,
  //   autoform: { omit: true },
  //   defaultValue: false
  // },
  status: {
    type: Number,
    defaultValue: 1 // 1 for editing, 2 for pending, 3 for inactive, 4 for active, 5 for not approved, 6 for deleted
  },
  lastPrice: {
    type: Number,
    optional: true
  },
  lastAvailableDate: {
    type: Date,
    optional: true
  },
  rates: {
    type: [Object],
    optional: true,
    minCount: 4,
    maxCount: 4
  },
  'rates.$.available': {
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  'rates.$.value': {
    type: Number,
    optional: true
  },
  availability: {
    type: [Object], // 0 is sun, 6 is sat
    optional: true,
    minCount: 7,
    maxCount: 7
  },
  'availability.$.available': {
    type: Boolean,
    defaultValue: true
  },
  'availability.$.timeSlots': {
    type: [Boolean],
    optional: true,
    minCount: 11,
    maxCount: 11
    //0: day parking
    //1: night parking
    //2: all day
    //3: 9-10
    //4: 10-11
    //5: 11-12
    //6: 12-13
    //7: 13-14
    //8: 14-15
    //9: 15-16
    //10: 16-17
  },
  // 'availability.$.startTime': {
  //   type: Number,
  //   optional: true
  // },
  // 'availability.$.endTime': {
  //   type: Number,
  //   optional: true
  // },
  weeklyAvailability: {
    type: Object,
    optional: true
  },
  'weeklyAvailability.available': {
    type: Boolean,
  },
  'weeklyAvailability.endTime': {
    type: Number,
    optional: true
  },
  'weeklyAvailability.availability': {
    type: [Object], // 0 is sun, 6 is sat
    optional: true,
    minCount: 7,
    maxCount: 7
  },
  'weeklyAvailability.availability.$.available': {
    type: Boolean,
    defaultValue: true,
    optional: true
  },
  'weeklyAvailability.availability.$.startTime': {
    type: Number,
    optional: true
  },
  'weeklyAvailability.availability.$.endTime': {
    type: Number,
    optional: true
  },
  access: {
    type: Object,
    optional: true,
  },
  'access.everyone': {
    type: Boolean,
    defaultValue: true
  },
  'access.groups': {
    type: [Boolean],
    optional: true,
    minCount: 3,
    maxCount: 3
  },
  // 'access.customGroups': {
  //   type: [Boolean],
  //   optional: true,
  //   minCount: 3,
  //   maxCount: 3
  // },
  'access.freeGroup': {
    type: Boolean,
    optional: true
  },
  ratings: {
    type: [Object],
    optional: true,
  },
  'ratings.$.userId': {
    type: String
  },
  'ratings.$.rate': {
    type: Number,
    min: 0,
    max: 5,
    decimal: false
  },
  lastUpdatedAt: {
    type: Date,
    autoform: {
      omit: true
    },
    optional: true
  }
});
