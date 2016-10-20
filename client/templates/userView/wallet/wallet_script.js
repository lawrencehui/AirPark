Template.wallet.helpers({
	'incomeActive': function(){
    return Session.get('isIncomeActive');
  },
  'isIncomeSelected': function(){
    if(Session.get('isIncomeActive')){
      return "selected";
    } else {
      return "";
    }
  },
  'isExpensesSelected': function(){
    if(Session.get('isIncomeActive')){
      return "";
    } else {
      return "selected";
    }
  },
	'totalAmount': function(){
		if(Session.get('isIncomeActive')){
			var incomeRecords = this.incomeRecords.fetch()
			var totalAmount = _.reduce(incomeRecords, function(memo, transaction){
				console.log(memo);
				console.log(transaction);
				return memo + transaction.amount;
			}, 0)
      return totalAmount;
    } else {
			var expensesRecords = this.expensesRecords.fetch()
			var totalAmount = _.reduce(expensesRecords, function(memo, transaction){
				return memo + transaction.amount;
			}, 0)
      return totalAmount;
    }
	}
});

Template.wallet.events({
	'click .income-tab': function(event, template) {
    Session.set('isIncomeActive', true);
  },
  'click .expenses-tab': function(event) {
    Session.set('isIncomeActive', false);
  }
});

Template.wallet.onRendered(function ( ){
	Session.set('isIncomeActive', true);
	Tracker.afterFlush(function() {
    Meteor.defer(function(){
      $(".dotdotdot").dotdotdot({
        watch: "window"
      });
    });
  });
})

// Template.walletRecordsCell.onRendered(function ( ){
// 	Tracker.afterFlush(function() {
//     Meteor.defer(function(){
//       $(".dotdotdot").dotdotdot({
//         watch: "window"
//       });
//     });
//   });
// })

// Template.walletRecordsCell.helpers({
// 	showImg: function(){
// 		// console.log(this)
// 		if(ParkingSpaces.findOne({_id: this.spaceId})){
// 			return ParkingSpaces.findOne({_id: this.spaceId}).parkingSpaceImg
// 		} else {
// 			return ""
// 		}
// 	},
// 	locationText: function(){
// 		return ParkingSpaces.findOne({_id: this.spaceId}).locationText;
// 	},
// 	spaceFloor: function(){
// 		return ParkingSpaces.findOne({_id: this.spaceId}).spaceFloor;
// 	},
// 	spaceNum: function(){
// 		return ParkingSpaces.findOne({_id: this.spaceId}).spaceNum;
// 	},
// 	hasDisableParking: function(spaceId) {
//     return ParkingSpaces.findOne({_id: this.spaceId}).hasDisableParking;
//   },
//   hasEVCharger: function(spaceId) {
//     return ParkingSpaces.findOne({_id: this.spaceId}).hasEVCharger;
//   },
//   hasOversizeParking: function(spaceId){
//     return ParkingSpaces.findOne({_id: this.spaceId}).hasOversizeParking;
//   },
// })
