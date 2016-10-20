Template.ownerVerification.helpers({
	'verificationImg': function(){
		console.log(this)
    if(Session.get('parkingVerificationImg')){
			return Session.get('parkingVerificationImg')
		} else {
			return null;
		}
  },
	editing: function(){
		return Router.current().params.query.edit;
	},
	Done: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Done';
    }
  }
});

Template.ownerVerification.events({
	'click .upload-verification-img-btn': function(event, template){
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
//           Session.set('parkingVerificationImg', fileObj._id);
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
		    path: "parkingVerificationImage",
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
	          "key": "parkingVerificationImage/"+result.file_name,
	          "AWSAccessKeyId": result.access_key,
	          "acl": result.acl,
	          "policy": result.policy,
	          "signature": result.signature,
	          "Content-Type": file.type
		    };

				// var userUploadInfo = Session.get("userUploadInfo");
				var url = result.post_url+"/parkingVerificationImage/"+result.file_name;
				// Session.set("userUploadVideoURL", url);
        Session.set('parkingVerificationImgTemp', url);

				console.log(url);

		    console.log(options);

				ft.upload(newUrl, encodeURI(result.post_url), onUploadSuccess, onUploadFailure, options, true);
				// ft.upload(file.localURL, encodeURI(result.post_url), onUploadSuccess, onUploadFailure, options, true);
		  });
		});
}

function onUploadSuccess(result){
	console.log('upload success:')
	console.log(result)
  Session.set('parkingVerificationImg', Session.get('parkingVerificationImgTemp'));
}

function onUploadFailure(error){
	console.log('upload fail:')
	console.log(error)
}

Template.ownerVerification.onRendered(function ( ){
	this.autorun(function(h) {
    var currentSpace = ParkingSpaces.findOne({_id: Router.current().params.query.spaceId});
    if(currentSpace){
      var parkingVerificationImgURL = currentSpace.parkingVerificationImg;
      if (parkingVerificationImgURL) {
        Session.set('parkingVerificationImg', parkingVerificationImgURL);
      }
      h.stop();
    }
  });
})

Template.spaceFeatures.onCreated(function(){
	Session.set('parkingVerificationImgUploaded', false);
	if(Router.current().params.query.spaceId){
    var spaceId = Router.current().params.query.spaceId
    Meteor.subscribe('ParkingSpacesByID', spaceId)
  }
});
