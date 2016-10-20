Template.addCreditCard.helpers({
	backPath: function(){
    if(Router.current().params.query.back == 'selectCreditCard'){
      return 'selectCreditCard'
    } else {
      return 'paymentMethods'
    }
  }
});

Template.addCreditCard.events({
  // 'click #addCreditCardDone': function(){
  //   if(Session.get('isAddingBankAccountWhileConfirming')){
  //     Router.go('bookingConfirmation', {_id: Session.get('isAddingBankAccountWhileConfirming')})
  //     delete Session.keys['isAddingBankAccountWhileConfirming'];
  //   } else {
  //     Router.go('accountMain');
  //   }
  // }
});

Template.addCreditCard.onRendered(function ( ){
	// $.getScript("braintree.js");

	// var clientToken = "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI0YTM3ZGMxNTRlMDgxZjUzZmEwOTY3YzJiMDUzMzVlMzJmYjM3ZjhmM2YzOTdjNjlkYjNkZTYxZDdiOGFhOTI2fGNyZWF0ZWRfYXQ9MjAxNS0xMC0wM1QwMzo1MzoxNy43OTgzMzIzMDYrMDAwMFx1MDAyNm1lcmNoYW50X2lkPTM0OHBrOWNnZjNiZ3l3MmJcdTAwMjZwdWJsaWNfa2V5PTJuMjQ3ZHY4OWJxOXZtcHIiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzM0OHBrOWNnZjNiZ3l3MmIvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIn0sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsInRocmVlRFNlY3VyZSI6eyJsb29rdXBVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi90aHJlZV9kX3NlY3VyZS9sb29rdXAifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiQWNtZSBXaWRnZXRzLCBMdGQuIChTYW5kYm94KSIsImNsaWVudElkIjpudWxsLCJwcml2YWN5VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3BwIiwidXNlckFncmVlbWVudFVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS90b3MiLCJiYXNlVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhc3NldHNVcmwiOiJodHRwczovL2NoZWNrb3V0LnBheXBhbC5jb20iLCJkaXJlY3RCYXNlVXJsIjpudWxsLCJhbGxvd0h0dHAiOnRydWUsImVudmlyb25tZW50Tm9OZXR3b3JrIjp0cnVlLCJlbnZpcm9ubWVudCI6Im9mZmxpbmUiLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJtZXJjaGFudEFjY291bnRJZCI6ImFjbWV3aWRnZXRzbHRkc2FuZGJveCIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiMzQ4cGs5Y2dmM2JneXcyYiIsInZlbm1vIjoib2ZmIn0=";
	Meteor.call('generateClientToken', function(error, result) {
		braintree.setup(result, "custom", {
			id: "credit-card-information",
			hostedFields: {
				number: {
					selector: "#card-number"
				},
				cvv: {
					selector: "#cvv"
				},
				// expirationDate: {
				// 	selector: "#expiration-date",
				// 	placeholder: 'MM/YYYY'
				// },
				expirationMonth: {
					selector: "#expiration-month",
					placeholder: 'MM'
				},
				expirationYear: {
					selector: "#expiration-year",
					placeholder: 'YYYY'
				},
				styles: {
					"input": {
						"font-size": "1em",
						"font-family": "BebasNeue-Regular",
						"color": "#999"
					}
				},
				onFieldEvent: function (event) {
					if (event.type === "focus") {
						// Handle focus
					} else if (event.type === "blur") {
						// Handle blur
					} else if (event.type === "fieldStateChange") {
						// Handle a change in validation or card type
						console.log(event.isValid); // true|false
						if (event.card) {
							console.log(event.card.type);
							// visa|master-card|american-express|diners-club|discover|jcb|unionpay|maestro
						}
					}
				}
			},

			onError: function(err){
				alert(err.message)
			},

			onPaymentMethodReceived: function(result) {
				console.log(result);
				var cardholderName = $('input#cardholder-name').val();
				console.log(this);
				var profile = Profile.findOne({userId: Meteor.userId()})
				console.log(profile);
				if (profile.btCustomerId) {
					Meteor.call('updateCustomerWithNewPaymentMethod', profile.btCustomerId, result.nonce, cardholderName, function(err, result) {
						if(err) {
							console.log('update customer with new payment method: Error: ');
							console.dir(err);
						} else {
							console.log('update customer with new payment method: Result: ');
							console.dir(result);
							// Router.go('accountMain');
						  if(Session.get('isAddingBankAccountWhileConfirming')){
						    // Router.go('bookingConfirmation', {_id: Session.get('isAddingBankAccountWhileConfirming')})
						    Router.go('bookingConfirmation')
						    Session.set('isAddingBankAccountWhileConfirming', null);
						  } else {
								if(Router.current().params.query.back == 'selectCreditCard'){
						      Router.go('/selectCreditCard');
						    } else {
						      Router.go('paymentMethods');
						    }
						  }
						}
					});
				} else {
					Meteor.call('createNewCustomer', result.nonce, cardholderName, function(err, result) {
						if(err) {
							console.log('create new customer: Error: ');
							console.dir(err);
						} else {
							console.log('create new customer: Result: ');
							console.dir(result);
							var customerId = result.customer.id;
							Meteor.call('updateProfileWithBtCustomerId', customerId, function(err, result) {
								if(err) {
									console.log('update profile with customerId: Error: ');
									console.dir(err);
								} else {
									console.log('update profile with customerId: Result: ');
									console.dir(result);
									if(Session.get('isAddingBankAccountWhileConfirming')){
							      Router.go('bookingConfirmation')
							      Session.set('isAddingBankAccountWhileConfirming', null);
							    } else {
										if(Router.current().params.query.back == 'selectCreditCard'){
								      Router.go('/selectCreditCard');
								    } else {
								      Router.go('paymentMethods');
								    }
							    }
								}
							})
						}
					});
				}

			}.bind(this)
		});
	}.bind(this));


	// console.log(clientToken);

})
