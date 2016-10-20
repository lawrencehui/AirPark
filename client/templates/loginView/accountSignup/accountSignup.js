Template.accountSignup.events({
	'click .signup-btn': function(){
		event.preventDefault();

		var firstname = $('#firstname').val();
		var lastname = $('#lastname').val();
		var email = $('#email').val();
		var password = $('#password').val();

		//TODO: add input validation

		var newUser = { 	email: email,
											password: password,
											firstname: firstname,
											lastname: lastname	};

		Meteor.call('createNewUser', newUser, function(error, result) {
			if (error) {
				console.log(error);
			} else {
				// console.dir(newUser);
				console.log('newUserCreated');
				//Auto login after signed up
				Meteor.loginWithPassword(newUser.email, newUser.password, function(error) {
						if (error) {
							console.log(error);
						} else {
							Router.go('main');
						}
				});

				// console.log(result)
				// Profile.insert({
				// 	userId: result,
				// 	email: newUser.email
				// });
			}
		});
	}
});
