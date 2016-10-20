Router.configure({
	layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

//specific routes for loading Google Maps
Router.onBeforeAction(function() {
	GoogleMaps.load({
		key: 'AIzaSyDnm1-5orJHJI-_u5MMo2I2jqVDq2hr7UI',
		libraries: 'places'
	});
	GoogleMaps.loadUtilityLibrary('/geolocation-marker.js');
	this.next();
}, {only: ['main','pickLocationView'] } );

//redirection to login if not registered user
Router.onBeforeAction(function () {
  if(!Meteor.userId()){
    this.redirect('loginMain');
  }
  this.next();
}, { except: ['loginMain', 'accountSignup', 'forgotPassword', 'resetPassword'] });

//Main page redirection after login
Router.onBeforeAction(function () {
  if(Meteor.userId()){
    this.redirect('main');
  }
  this.next();
}, {only: ['loginMain']} );

Router.onAfterAction(function() {
  Meteor.setTimeout(function(){
    $(".dotdotdot").dotdotdot({
      watch: "window"
    });
  }, 0);
  console.log("ran dotdotdot");
});

// Router.onBeforeAction(function() {
//   if(Meteor.isCordova){
//     console.log("isCordova:" + Meteor.isCordova);
//     this.redirect('main');
//   } else {
//     this.redirect('loginMain');
//   }
//   this.next();
// }, {only: ['main']} );
