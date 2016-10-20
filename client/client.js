Meteor.startup(function(){
  SimpleSchema.debug = true;

  if(Meteor.isCordova){
		cordova.plugins.Keyboard.disableScroll(true);
		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
	}

  AutoForm.hooks({
    createParkingSpace: {
      onSuccess: function (){
        Router.go('manageSpacesList');
      }
    }
  });

  // console.log('GoogleMaps is loaded');
});

//defer focus to wait for UI Animations
deferFocus = function(jQueryObj){
  Meteor.setTimeout(function(){
     jQueryObj.focus();
  }, 500);
}

Number.prototype.toHHMMSS = function () {
		var sec_num = Math.floor(this / 1000);
		var days 		= Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num - (days *86400)) / 3600);
    var minutes = Math.floor((sec_num - (days *86400)- (hours * 3600)) / 60);
    var seconds = sec_num - (days *86400) - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

Tracker.autorun(function () {
	var serverTimeNow = TimeSync.serverTime(null, 500);
	Session.set("serverNow", serverTimeNow);

  var status;
  if (Meteor.status().status === "connected") {
      status = 2;
  }
  else if (Meteor.status().status === "connecting") {
      status = 1;
  }
  else {
      status = 0;
  }
  Session.set('connectionStatus', status);
  // console.log('connectionStatus: '+ status );
  // Session.set('connectionStatus', 0);
});
