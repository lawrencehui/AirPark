// Images = new FS.Collection("images", {
//   stores: [new FS.Store.GridFS("images", {})]
// });
//
// Images.allow({
//   insert: function(userId, doc){
//     return true;
//   },
//   download: function(userId){
//     return true;
//   }
// });

ParkingSpaces = new Mongo.Collection('parkingSpaces');
Timeslots = new Mongo.Collection('timeslots');
Profile = new Mongo.Collection('profile');
Transactions = new Mongo.Collection('transactions');
Payouts = new Mongo.Collection('payouts');
Groups = new Mongo.Collection('groups');
Issues = new Mongo.Collection('issues');


ParkingSpaces.attachSchema(parkingSpaceSchema);
Timeslots.attachSchema(timeslotSchema);
Profile.attachSchema(UserSchema);
Transactions.attachSchema(transactionsSchema);
Payouts.attachSchema(payoutSchema);
Groups.attachSchema(groupsSchema);
Issues.attachSchema(issueSchema);
