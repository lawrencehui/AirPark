Template.payoutHistory.helpers({
	completedPayout: function(){
		return _.reduce(this.fetch(), function(memo, element){
	    if(element.paidAt){
	      return parseInt(memo) + parseInt(element.amount);
	    } else {
	      return memo;
	    }
	  }, 0);
	},
	futurePayout: function(){
		return _.reduce(this.fetch(), function(memo, element){
	    if(element.paidAt){
	      return memo;
	    } else {
	      return parseInt(memo) + parseInt(element.amount);
	    }
	  }, 0);
	},
	date: function(){
		return moment(this.requestedAt).format('YYYY-M-D');
	},
	status: function(){
		if(this.paidAt){
			return 'Completed'
		} else {
			return 'Pending'
		}
	}

});

Template.payoutHistory.events({


});

Template.payoutHistory.onCreated(function(){


});

Template.payoutHistory.onRendered(function(){

});
