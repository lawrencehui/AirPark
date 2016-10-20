Template.loginMain.events({
	'click .login-btn': function(){
		event.preventDefault();

		var email = $('#email').val();
		var password = $('#password').val();

		Meteor.loginWithPassword(email, password, function(error){
			if(error) {
				alert('Invalid login details, please try again.');
			}
		})
	},
	'click .facebook-login': function(event){
		Meteor.loginWithFacebook(['public_profile'], function(err){
			if(err){
				throw new Meteor.Error("Facebook login failed");
			}
			console.log("login with facebook success!");
			// Meteor.call('log facebook service', Meteor.userId() );
		});
	},
	'click .google-login': function(event){
		Meteor.loginWithGoogle({
			forceApprovalPrompt: true,
			requestPermissions: ['email'],
      requestOfflineToken: true
		}, function(err){
			if(err){
				throw new Meteor.Error("Google login failed");
			}
			console.log("login with Google success!");
		});
	}
});

Template.loginMain.helpers({
	'deviceHeight': function(){
		var height = $(window).height();
		console.log("height is: " + height);
		return height
	}
});
