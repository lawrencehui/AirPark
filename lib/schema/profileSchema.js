UserSchema = new SimpleSchema({
  userId: {
    type: String
  },
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  },
  email: {
    type: String
  },
  mobile: {
    type: Object,
    optional: true
  },
  "mobile.country": {
    type: Number,
    defaultValue: 852,
    optional: true
  },
  "mobile.number": {
    type: Number,
    optional: true
  },
  bankAccounts: {
    type: [Object],
    defaultValue: [],
    // optional: true
  },
  "bankAccounts.$.name": {
    type: String,
    optional: true
  },
  "bankAccounts.$.branchLocation": {
    type: String,
    optional: true
  },
  "bankAccounts.$.payee": {
    type: String,
    optional: true
  },
  "bankAccounts.$.bankCode": {
    type: String,
    optional: true
  },
  "bankAccounts.$.accountNo": {
    type: String,
    optional: true
  },
  bankAccount: {
    type: Object,
    optional: true
  },
  "bankAccount.name": {
    type: String,
    optional: true
  },
  "bankAccount.number": {
    type: Number,
    optional: true
  },
  "bankAccount.bank": {
    type: String,
    optional: true
  },
  "btCustomerId": {
    type: String,
    optional: true
  },
  isOwner: {
    type: Boolean,
    autoform: {
      omit: true
    },
    defaultValue: false
  },
  isAgent: {
    type: Boolean,
    autoform: {
      omit: true
    },
    defaultValue: false
  },
  owners: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  },
  agentId: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    },
  },
  isAdmin: {
    type: Boolean,
    autoform: {
      omit: true
    },
    defaultValue: false
  },
  availability: {
    type: [Object],
    optional: true,
    minCount: 7,
    maxCount: 7,
    autoform: {
      omit: true
    },
  },
  'availability.$.available': {
    type: Boolean,
    defaultValue: true,
    optional: true
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
  customGroup: {
    type: Object,
    optional: true,
    minCount: 3,
    maxCount: 3,
    autoform: {
      omit: true
    }
  },
  // 'customGroup.family': {
  //   type: [String],
  //   optional: true,
  // },
  // 'customGroup.friends': {
  //   type: [String],
  //   optional: true,
  // },
  // 'customGroup.others': {
  //   type: [String],
  //   optional: true,
  // },
  freeGroup: {
    type: [String],
    optional: true
  },
  garages: {
    type: [Object],
    optional: true
  },
  'garages.$.model': {
    type: String
  },
  'garages.$.number': {
    type: String
  },
  groups: {
    type: [String],
    optional: true
  },
  groupPic: {
    type: [String],
    optional: true
  }
});
