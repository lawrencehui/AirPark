Template.uploadImagesView.events({
  'click #navDoneBtn': function() {
    //do checking on
    console.log('next btn clicked');
    //Router.go('');
  },
  'click .upload-space-img-btn': function(event, template){
    if(Meteor.isCordova){
      console.log("isCordova")
      Session.set('photoType', 0);
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
    // } else {
    //   FS.Utility.eachFile(event, function(file) {
    //     Images.insert(file, function (err, fileObj) {
    //       if (err){
    //          // handle error
    //          console.log(err);
    //       } else {
    //          // handle success depending what you need to do
    //         var userId = Meteor.userId
    //         console.dir(fileObj);
    //         var imagesURL = "profile.image:" + "/cfs/files/images/" + fileObj._id;
    //         // Meteor.users.update(userId, {$set: imagesURL});
    //         // var imagesURL = Images.findOne({_id: fileObj._id}).url()
    //         console.log(imagesURL);
    //
    //         // template.parkingSpaceImg.set(fileObj._id);
    //         Session.set('parkingSpaceImg', fileObj._id);
    //       }
    //     });
    //   });
    }
  },
  'click .upload-building-img-btn': function(event, template){
    if(Meteor.isCordova){
      console.log("isCordova")
      Session.set('photoType', 1);
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
    // } else {
    //   FS.Utility.eachFile(event, function(file) {
    //     Images.insert(file, function (err, fileObj) {
    //       if (err){
    //          // handle error
    //       } else {
    //          // handle success depending what you need to do
    //         var userId = Meteor.userId
    //         console.dir(fileObj);
    //         var imagesURL = "profile.image:" + "/cfs/files/images/" + fileObj._id;
    //         // Meteor.users.update(userId, {$set: imagesURL});
    //         // var imagesURL = Images.findOne({_id: fileObj._id}).url()
    //         console.log(imagesURL);
    //
    //         // template.parkingBuildingImg.set(fileObj._id);
    //         Session.set('parkingBuildingImg', fileObj._id);
    //       }
    //     });
    //   });
    }
  },
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
    alert('Failed because: ' + message.reason);
		console.log(message.reason);
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
//           if(Session.get('photoType') === 0){
//             Session.set('parkingSpaceImg', fileObj._id);
//           } else if(Session.get('photoType') === 1){
//             Session.set('parkingBuildingImg', fileObj._id);
//           } else {
//             Session.set('parkingVerificationImg', fileObj._id);
//           }
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
      if(Session.get('photoType') === 0){
        var path = 'parkingSpaceImage';
      } else if(Session.get('photoType') === 1){
        var path = 'parkingBuildingImage';
      } else {
        var path = 'others';
      }

			var params = {
		    file_name: newFileName + m1,
		    file_type: file.type,
		    file_size: file.size,
		    expiration: 1800000,
		    path: path,
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
	          "key": path + "/"+result.file_name,
	          "AWSAccessKeyId": result.access_key,
	          "acl": result.acl,
	          "policy": result.policy,
	          "signature": result.signature,
	          "Content-Type": file.type
		    };

				var url = result.post_url+"/" + path + "/"+result.file_name;

        if(Session.get('photoType') === 0){
          Session.set('parkingSpaceImgTemp', url);
        } else if(Session.get('photoType') === 1){
          Session.set('parkingBuildingImgTemp', url);
        } else {
          console.log('wrong photoType index');
        }

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
  if(Session.get('photoType') === 0){
    Session.set('parkingSpaceImg', Session.get('parkingSpaceImgTemp'));
    Session.set('parkingSpaceImgUploaded', true);
  } else if(Session.get('photoType') === 1){
    Session.set('parkingBuildingImg', Session.get('parkingBuildingImgTemp'));
    Session.set('parkingBuildingImgUploaded', true);
  } else {
    console.log('wrong photoType index');
  }
}

function onUploadFailure(error){
	console.log('upload fail:')
	console.log(error)
}

Template.uploadImagesView.helpers({
  'spaceImg': function(){
    if(Session.get('parkingSpaceImg')) {
      return Session.get('parkingSpaceImg');
    } else {
      return null;
    }
  },
  'buildingImg': function(){
    if(Session.get('parkingBuildingImg')) {
      return Session.get('parkingBuildingImg');
    } else {
      return null;
    }
  },
  Next: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Next';
    }
  }
});

Template.uploadImagesView.onCreated(function(){

});

Template.uploadImagesView.onRendered(function(){
  this.autorun(function(h) {
    var currentSpace = ParkingSpaces.findOne({_id: Router.current().params._id});
    if(currentSpace){
      // var parkingSpaceImgURL = Images.findOne({_id: currentSpace.parkingSpaceImg });
      var parkingSpaceImgURL = currentSpace.parkingSpaceImg;
      if (parkingSpaceImgURL) {
        Session.set('parkingSpaceImg', parkingSpaceImgURL);
      }
      var parkingBuildingImgURL = currentSpace.parkingBuildingImg;
      if (parkingBuildingImgURL) {
        Session.set('parkingBuildingImg', parkingBuildingImgURL);
      }
      h.stop();
    }
  });
});
