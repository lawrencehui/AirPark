Template.resetPassword.events({
  'click .reset-pw-btn': function(event, template) {
    event.preventDefault();
    var password = $('#new-password').val();
    console.log(password);
    Accounts.resetPassword(Session.get('resetPasswordToken'), password, function(error){
       if (error) {
         alert('Sorry, something wrong with your password');
       } else {
         Session.set('resetPasswordToken', null);
         alert('Your password has been reset!');
				 Router.go('loginMain');
       }
    });
  }
});

Template.resetPassword.helpers({
	resetPassword: function(){
    console.log(Iron.Location.get().path);
    var pathArray = Iron.Location.get().path.split('/');
    var token = pathArray[2];
    Session.set('resetPasswordToken', token);
    return token;
  }
});
