var minPayout = 500;

Template.requestPayout.helpers({
	accountBalance: function(){
		return Session.get('accountBalance');
	},
	isChecked: function(index){
		if(Session.get('selectedBankAccountIndex') == index){
			return true
		} else {
			return false
		}
	},
	minPayout: function(){
		return minPayout;
	}

});

Template.requestPayout.events({
	'click input.selectedBankAccountCheckbox': function(event, template){
		if(event.target.value){
			Session.set('selectedBankAccountIndex', $(event.currentTarget).attr('data-index'));
		}
	},
	'click .request-confirm-btn': function(event, template){
		if(Session.get('accountBalance') >= minPayout){
			if($('input#requestAgreementCheckbox')[0].checked){
				var accountObj = this.bankAccounts[Session.get('selectedBankAccountIndex')];
				console.log(accountObj);
				Meteor.call('requestPayout', Meteor.userId(), accountObj, Session.get('accountBalance'), function(error, result){
					if(error){
						console.log(error)
					} else {
						alert('Request successful');
						Router.go('accountBalance');
					}
				})
			} else {
				console.log('not checked')
				alert('Please review the Owner Agreement and check the box');
			}
		} else {
			alert('Account Balance is less than the minimum payout HK$' + minPayout);
		}
	}

});

Template.requestPayout.onCreated(function(){


});

Template.requestPayout.onRendered(function(){
	Session.setDefault('selectedBankAccountIndex', 0);

});
