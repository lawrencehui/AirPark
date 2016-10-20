Template.forgotPassword.events({
	'click .reset-pw-btn': function(event, template) {
    event.preventDefault();
    var email = $('#email').val();

    if (email) {
      Accounts.forgotPassword({email: email}, function(error){
        alert('Reset password email is sent.');
        if (error) {
           if (error.message === 'User not found [403]') {
             alert('This email does not exist.');
           } else {
             alert('Sorry, something went wrong. Please try again later.');
           }
        } else {
           Router.go('loginMain');
        }
      });
    }
  }
});
