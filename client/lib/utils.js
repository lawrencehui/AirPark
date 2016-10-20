LoadingSpinnerModal = {
	show() {
    console.log("show spinner")
		Blaze.renderWithData(Template.customSpinner, {}, $('.spinner-container')[0]);
	},
	hide() {
    console.log("hide spinner")
		$('.customSpinner-container').remove();
		let modalContainer = $('.spinner-container');
		modalContainer.velocity({opacity: 0}, {
			duration: 300,
			complete: function(el) {
				modalContainer.removeClass('open');
				modalContainer.removeClass('blackOverlay');
				modalContainer.removeAttr("style");
			}
		});
	}
}
