Template.editBankAccount.helpers({
	});

Template.editBankAccount.events({
	});

Template.editBankAccount.onRendered(function ( ){
	})

var editBankAccountHook = {
	onSuccess: function(){
		$('[data-nav-container]').addClass('nav-view-direction-back');
    $('[data-navbar-container]').addClass('nav-bar-direction-back');
		Router.go('accountMain')
	}
}

AutoForm.hooks({
	'editBankAccount': editBankAccountHook
})
