// var timeslot = [ '8am - 12pm',
// 	               '12pm - 4pm',
// 	               '4pm - 8pm'   ];
//
// var startTimeslots = [ 	'08:00:00',
// 												'12:00:00',
// 											 	'16:00:00' 	];
//
// var endTimeslots 	= [ 	'11:59:59',
// 												'15:59:59',
// 											 	'19:59:59' 	];

var timeSlotText = [
	'6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
	'6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am'
];

Template.bookingReceiptOngoing.helpers({
	locationText: function(){
		if(Session.get('parkingReceiptDataSubscription')){
			var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
			return ParkingSpaces.findOne({_id: spaceId}).locationText;
		} else {
			return ""
		}
	},
	spaceFloor: function(){
		if(Session.get('parkingReceiptDataSubscription')){
			var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
			return ParkingSpaces.findOne({_id: spaceId}).spaceFloor;
		} else {
			return ""
		}
	},
	spaceNum: function(){
		if(Session.get('parkingReceiptDataSubscription')){
			var spaceId = Transactions.findOne({_id: Router.current().params._id}).spaceId;
			return ParkingSpaces.findOne({_id: spaceId}).spaceNum;
		} else {
			return ""
		}
	},
  'timeslotTypeText': function() {
    var timeslotType = this.timeslotType
		var timeslot = [
			{type: 0, text:'8am - 10pm'},
			{type: 1, text:'10pm - 8am'},
			{type: 2, text:'8am - 8am'},
			{type: 3, text:'9am - 5pm'}
		];
		if(timeslotType < 3){
			return timeslot[timeslotType].text;
		} else if(timeslotType === 3){
			var timeslotArray = this.timeslotArray
			var timeSlotText = ['9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm'];
			var startTimeIndex = _.min(timeslotArray) - 3;
			var endTimeIndex = _.max(timeslotArray) - 2;
			return timeSlotText[startTimeIndex] + ' - ' + timeSlotText[endTimeIndex];
		}
    // return timeSlotText[this.startTime] + ' - ' + timeSlotText[this.endTime];
  },
  // timeslotText: function(type) {
  //   return timeSlotText[type];
  // },
	bookingRef: function(){
		return Router.current().params._id;
	},
	totalPrice: function(hourPrice){
		return hourPrice*4+".00";
	},
	countDownTimer: function() {
		if(Session.get('parkingReceiptDataSubscription')){
			var now = Session.get("serverNow");
			var date = Transactions.findOne({_id: Router.current().params._id}).timeslotDate
			var startTime = Transactions.findOne({_id: Router.current().params._id}).timestampStart
			var endTime = Transactions.findOne({_id: Router.current().params._id}).timestampEnd

			startTime = moment(startTime);
			endTime = moment(endTime);

			var timerStr = "PARKING";

			// console.log(startTime);
			// console.log(endTime);
			// timerStr = startTime - now;
			// console.log(startTime.valueOf());
			// console.log(now);

			if (startTime.diff(now, 'days') >= 1) {
				timerStr = date;
			} else if (startTime.diff(now) > 0 && startTime.diff(now, 'hours') < 24 ){
				timerStr = (startTime - now).toHHMMSS();
			} else if (startTime.diff(now) <= 0) {
				timeStr = "PARKING";
			}

			return timerStr
		} else {
			return ""
		}
	},
	hasDisableParking: function(spaceId) {
		// console.log(spaceId);
		return ParkingSpaces.findOne({_id: spaceId}).hasDisableParking;
	},
	hasEVCharger: function(spaceId) {
		return ParkingSpaces.findOne({_id: spaceId}).hasEVCharger;
	},
	hasOversizeParking: function(spaceId){
		return ParkingSpaces.findOne({_id: spaceId}).hasOversizeParking;
	},
	reportImg: function(){
		if(Session.get('parkingReceiptDataSubscription')){
			if(Session.get('hasNewReportImg')) {
				return Session.get('reportImg')
			} else {
				return Transactions.findOne({_id: Router.current().params._id}).reportImgId
			}
		} else {
			return ""
		}
	},
	transactionInfo: function(){
		return Transactions.findOne({_id: Router.current().params._id})
	},
	parkingSpaceInfo: function(){
		return ParkingSpaces.findOne({_id: this.spaceId});
	},
	canCancel: function(){
		if(Session.get('parkingReceiptDataSubscription')){
			var now = Session.get("serverNow");
			var startTime = Transactions.findOne({_id: Router.current().params._id}).timestampStart
			if(now < startTime){
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	}
});

Template.bookingReceiptOngoing.events({
	'click .contactBtn': function(e,t) {
		var PhoneNumber = Profile.findOne().mobile.country.toString() +  Profile.findOne().mobile.number.toString();
		window.location.href="tel://+"+PhoneNumber;
	},
	'click .reportBtn': function(event, template){
		Router.go('/reportIssueType/' + Router.current().params._id)
	},
	'click .cancelBtn': function(event, template){
		$('.black-overlay').addClass('open');
		$('.cancel-modal').addClass('open');
	},
	'click .modal-back-button': function(event, template){
		$('.black-overlay').removeClass('open');
		$('.cancel-modal').removeClass('open');

	},
	'click #cancel-booking': function(event, template){
		Meteor.call('cancelTransaction', Router.current().params._id, function(error, result){
			if(error){
				console.log(error)
			} else {
				Router.go('/')
			}
		});
	},
	// 'change .uploadImg': function(event, template){
	// 	FS.Utility.eachFile(event, function(file) {
	// 		Images.insert(file, function (err, fileObj) {
	// 			if (err){
	// 				 // handle error
	// 				 console.log(err);
	// 			} else {
	// 				 // handle success depending what you need to do
	// 				var userId = Meteor.userId
	// 				console.dir(fileObj);
	// 				var imagesURL = "profile.image:" + "/cfs/files/images/" + fileObj._id;
	// 				// Meteor.users.update(userId, {$set: imagesURL});
	// 				// var imagesURL = Images.findOne({_id: fileObj._id}).url()
	// 				console.log(imagesURL);
	//
	// 				// template.parkingSpaceImg.set(fileObj._id);
	// 				Session.set('reportImg', fileObj._id);
	// 			}
	// 		});
	// 	});
	// },
	'click .uploadImg':  function(event, template){
    CameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      correctOrientation:true
    };
    IonActionSheet.show({
      // titleText: 'ActionSheet Example',
      buttons: [
        { text: 'Select From Gallery' },
        { text: 'Take A Photo' },
      ],
      // destructiveText: 'Delete',
      // cancel: function() {
      //   console.log('Cancelled!');
      // },
      buttonClicked: function(index) {
        CameraOptions.sourceType = index;
        navigator.camera.getPicture(onSuccess, onFail, CameraOptions);
        return true;
      }
    });
	}
});

function onSuccess(imageData) {
		// window.resolveLocalFileSystemURL(imageData , onResolveSuccess, onFail);
	// 	if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
	// 		imageData = imageData.replace("%3A", ":")
	// 		window.FilePath.resolveNativePath(imageData, function(result) {
	// 			var absoluteFilePath = "file://" + result;
	// 			window.resolveLocalFileSystemURL(absoluteFilePath, onResolveSuccess, onFail);
	// 		}, function(error) {
	 //
	// 			navigator.notification.alert(
	// 				 'Please choose local photo instead of photo from the cloud',  // message
	// 				 null,         // callback
	// 				 '2Park',            // title
	// 				 'OK'                  // buttonName
	// 		 );
	// 		});
	//  } else {
		 window.resolveLocalFileSystemURL(imageData, onResolveSuccess, onFail);
	//  }
}

function onFail(message) {
    alert('Failed because: ' + message);
		console.log(message);
}

// function onResolveSuccess(fileEntry) {
//     console.log('onResolveSuccess: ' + fileEntry.name);
//
//     fileEntry.file(function(file) {
//       var newFile = new FS.File(file);
//
// 			Images.insert(newFile, function (err, fileObj) {
// 					if(err) console.log(err);
// 					console.log(fileObj);
//           Session.set('reportImg', fileObj._id);
// 	    });
// 		});
// };

function onResolveSuccess(fileEntry) {
	var newUrl = fileEntry.toURL();
		fileEntry.file(function(file) {

			file.type = "";
			console.log(file);

			var ft = new FileTransfer();

			var timestamp = new Date();
			var newFileName = Meteor.userId() + timestamp.valueOf().toString();

			var patt1=/\.[0-9a-z]{1,3}$/i;
			var m1 = (file.name).match(patt1);

			console.log(newFileName)
			console.log(m1)
			var params = {
		    file_name: newFileName + m1,
		    file_type: file.type,
		    file_size: file.size,
		    expiration: 1800000,
		    path: "reportImages",
		    acl: "public-read",
				bucket: "2park"
		  };

			console.log(params)

		  Meteor.call("sanuker_s3_2park", params, function(error, result) {
		    console.log(result);
		    var options = new FileUploadOptions();

		    options.fileKey = "file";
		    options.fileName = result.file_name;
	      options.mimeType = result.file_type;
	      options.chunkedMode = false;
	      options.params = {
	          "key": "reportImages/"+result.file_name,
	          "AWSAccessKeyId": result.access_key,
	          "acl": result.acl,
	          "policy": result.policy,
	          "signature": result.signature,
	          "Content-Type": file.type
		    };

				// var userUploadInfo = Session.get("userUploadInfo");
				var url = result.post_url+"/reportImages/"+result.file_name;
				// Session.set("userUploadVideoURL", url);
        Session.set('reportImgTemp', url);

				console.log(url);

		    console.log(options);

				ft.upload(newUrl, encodeURI(result.post_url), onUploadSuccess, onUploadFailure, options, true);
				// ft.upload(file.localURL, encodeURI(result.post_url), onUploadSuccess, onUploadFailure, options, true);
		  });
		});
}

function onUploadSuccess(result){
	console.log('upload success:')
	Session.set('reportImg', Session.get('reportImgTemp'))
	console.log(result)
	var reportImgObj = {
		reportImgId: Session.get('reportImg'),
		transactionId: Router.current().params._id
	}
	console.log(reportImgObj)
	Session.set('hasNewReportImg', true);
	Session.set('reportImgObj', reportImgObj);
}

function onUploadFailure(error){
	console.log('upload fail:')
	console.log(error)
}


Template.bookingReceiptOngoing.onCreated(function() {
	Session.set('hasNewReportImg', false);
	Session.set('parkingReceiptDataSubscription', false)
	Meteor.subscribe('parkingReceiptData', Router.current().params._id, function(){
		Session.set('parkingReceiptDataSubscription', true)
	});
});
