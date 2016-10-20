Template.ionSideMenu.events({
  'click #logoutBtn': function(event) {
      Meteor.logout(function(err){
          if (err) {
              throw new Meteor.Error("Logout failed");
          }
      })
  }
});

Template.layout.onRendered(function(){
  var spinnerContainer = $(".spinner-container")[0];
  spinnerContainer._uihooks = {
    insertElement: function(node, next) {
      console.log('hooked');
      var $node = $(node);
      $(spinnerContainer).addClass('open');
      $(spinnerContainer).addClass('blackOverlay');
      $node.css('opacity', '0');
      spinnerContainer.insertBefore(node, next);
      return $node.velocity({
        opacity: 1
      }, {
        duration: 0
        // queue: false
      });
    },
    removeElement: function(node) {

      console.log(node);
      var $node = $(node);
      return $node.velocity({opacity: 0}, {
        duration: 300,
        complete: function() {
          $(spinnerContainer).removeClass('open');
          $(spinnerContainer).removeClass('blackOverlay');
          return node.remove();
        }
      });
    }
  };
})

Template.layout.helpers({
  Next: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Next';
    }
  },
  Done: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Done';
    }
  }
})

Template.ionNavBar.events({
  'click .submit-form-btn': function(event) {
    var formId = $(event.target).attr('data-form-id');
    console.log(formId);
    $('#'+formId).submit();
      // e.preventDefault();
    // });
  },
  'click #parkingReceiptOngoingDone': function(){
    // console.log(Session.get('reportImgObj'))
    if(Session.get('hasNewReportImg')) {
      console.log('updateReportImg');
      Meteor.call('updateReportImg', Session.get('reportImgObj'));
    }
    Router.go('/userBookingRecordList');
    Session.set('hasNewReportImg', false);
    Session.set('reportImgObj', null);
    Session.set('reportImg', null);
  },
  'click #parkingReceiptAfterDone': function(){
    Router.go('/userBookingRecordList?type=history');
  }
})

Template.layout.events({
  'click #pickLocationNext': function(event) {
    console.log('pick Location next is clicked');
    var lat = Session.get("Lat_value");
    var lng = Session.get("Lng_value");
    var locationText = Session.get("locationText");
    if(lat && lng && locationText){
      var newSpace = {  lat: lat,
                        lng: lng,
                        locationText: locationText
      };
      Meteor.call('createParkingSpace', newSpace, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log('create park result: ' + result);
          // Session.set('newSpaceId', result);
          Session.set("Lat_value", null);
          Session.set("Lng_value", null);
          Session.set("locationText", null);

          if(Router.current().params.query.edit){
            Router.go('/sumbitReview/' + Router.current().params.query.spaceId);
          } else {
            Router.go('/floorAndSpace?spaceId=' + result);
          }
        }
      });
    } else {
      alert('Please input the address')
    }

    // console.log(Session.get("Lat_value"));
    // console.log(Session.get("Lng_value"));
  },
  'click #floorSpaceNext': function(event){
    var spaceFloor = $('#spacefloor').val();
    var spaceNum = $('#spaceNumber').val();
    // if(spaceFloor == ""){
    //   alert('Please input a floor number');
    // } else if (spaceNum == "") {
    //   alert('Please input a space number');
    // } else {
      var spaceId = Router.current().params.query.spaceId;
      var updateObj = {
        spaceFloor: spaceFloor,
        spaceNum: spaceNum
      };
      Meteor.call('updateParkingSpace', spaceId, updateObj, function(error, result){
        if(error){
          console.log(error)
        } else {
          if(Router.current().params.query.edit){
            Router.go('/sumbitReview/' + Router.current().params.query.spaceId);
          } else {
            Router.go('/spaceTypeView?spaceId=' + spaceId);
          }
        }
      })
    // }
  },
  // 'click #floorNext': function(event) {
  //   //validation
  //   if(Session.get('spaceFloor_value') != "") {
  //     Router.go('spaceNumberView');
  //   } else {
  //     alert('Please input a floor number');
  //   }
  // },
  // 'click #spaceNumNext': function(event) {
  //   //validation
  //   if(Session.get('spaceNumber_value') != "") {
  //     Router.go('licensePlateView');
  //   } else {
  //     alert('Please input a space number');
  //   }
  // },
  // 'click #licenseNumNext': function(event) {
  //   //validation
  //   if(Session.get('licensePlate_value') != "") {
  //     Router.go('spaceTypeView');
  //   } else {
  //     alert('Please input your license number');
  //   }
  // },
  'click #spaceTypeNext': function(event) {
    var spaceType = $('input:checked')[0] ? $('input:checked')[0].value : "4";
    console.log(spaceType);
    if(spaceType){
      var spaceId = Router.current().params.query.spaceId;
      var updateObj = {
        spaceType: spaceType
      };
      Meteor.call('updateParkingSpace', spaceId, updateObj, function(error, result){
        if(error){
          console.log(error)
        } else {
          if(Router.current().params.query.edit){
            Router.go('/sumbitReview/' + Router.current().params.query.spaceId);
          } else {
            Router.go('/inOutDoorView?spaceId=' + spaceId);
          }
        }
      })
    }

    // Router.go('inOutDoorView');
  },
  'click #parkingAreaNext': function(event) {
    var parkingAreaType = $('input:checked')[0] ? $('input:checked')[0].value : "3";
    console.log(parkingAreaType);
    if(parkingAreaType){
      var spaceId = Router.current().params.query.spaceId;
      var updateObj = {
        parkingAreaType: parkingAreaType
      };
      Meteor.call('updateParkingSpace', spaceId, updateObj, function(error, result){
        if(error){
          console.log(error)
        } else {
          if(Router.current().params.query.edit){
            Router.go('/sumbitReview/' + Router.current().params.query.spaceId);
          } else {
            Router.go('/instructionView?spaceId=' + spaceId);
          }
        }
      })
    }
    // Router.go('instructionView');
  },
  'click #instructionsNext': function(event) {
    var instructions = $('#instructionText').val();
    //validation
    // if(instructions) {
      var spaceId = Router.current().params.query.spaceId;
      var presetInstructions = [];
      _.forEach($('input.instructionRadio:checked'), function(element, index, list){
        presetInstructions.push(element.value);
      });
      var updateObj = {
        instructions: instructions,
        presetInstructions: presetInstructions
      };
      console.log(updateObj);
      Meteor.call('updateParkingSpace', spaceId, updateObj, function(error, result){
        if(error){
          console.log(error)
        } else {
          if(Router.current().params.query.edit){
            Router.go('/sumbitReview/' + Router.current().params.query.spaceId);
          } else {
            Router.go('/spaceFeatures?spaceId=' + spaceId);
          }
        }
      })
      // Router.go('additionalInfoView');
    // } else {
    //   alert('Please input some instructions to find your parking space');
    // }
  },
  'click #spaceFeaturesNext': function(event) {
    var spaceId = Router.current().params.query.spaceId;
    if($('#noHeightRadio')[0].checked){
      var height = 0;
    } else {
      var height = $('#height').val();
    }
    var vehicleRestriction = $('input[name="vehicle"]:checked')[0].value;
    var hasEVCharger = $('#evRadio')[0].checked;
    var hasDisableParking = $('#disabledRadio')[0].checked;
    var updateObj = {
      height: height,
      vehicleRestriction: vehicleRestriction,
      hasEVCharger: hasEVCharger,
      hasDisableParking: hasDisableParking
    };
    console.log(updateObj);
    Meteor.call('updateParkingSpace', spaceId, updateObj, function(error, result){
      if(error){
        console.log(error)
      } else {
        if(Router.current().params.query.edit){
          Router.go('/sumbitReview/' + Router.current().params.query.spaceId);
        } else {
          Router.go('/uploadImagesView/' + spaceId);
        }
      }
    })
  },
  // 'click #additionalInfoNext': function(event) {
  //   var lat = Session.get("Lat_value");
  //   var lng = Session.get("Lng_value");
  //   var locationText = Session.get("locationText");
  //   var spaceFloor = Session.get("spaceFloor_value");
  //   var spaceNum = Session.get("spaceNumber_value");
  //   var licensePlate = Session.get("licensePlate_value");
  //   var spaceType = Session.get("spaceType_value");
  //   var parkingAreaType = Session.get("parkingArea_value");
  //   var instructions = Session.get("instructions_value");
  //
  //   var hasEVCharger = Session.get("evToggle_value");
  //   var hasDisableParking = Session.get("disabled_value");
  //   var hasOversizeParking = Session.get("oversizedToggle_value");
  //
  //   var ownerId = Meteor.userId();
  //
  //   var newSpace = {  lat: lat,
  //                     lng: lng,
  //                     locationText: locationText,
  //                     spaceFloor: spaceFloor,
  //                     spaceNum: spaceNum,
  //                     licensePlate: licensePlate,
  //                     spaceType: spaceType,
  //                     parkingAreaType: parkingAreaType,
  //                     instructions: instructions,
  //                     hasEVCharger: hasEVCharger,
  //                     hasDisableParking: hasDisableParking,
  //                     hasOversizeParking: hasOversizeParking,
  //                     ownerId: ownerId
  //                   };
  //
  //   Meteor.call('createParkingSpace', newSpace, function(error, result) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('create park result: ' + result);
  //       // Session.set('newSpaceId', result);
  //         Session.set("Lat_value", null);
  //         Session.set("Lng_value", null);
  //         Session.set("locationText", null);
  //         Session.set("spaceFloor_value", null);
  //         Session.set("spaceNumber_value", null);
  //         Session.set("licensePlate_value", null);
  //         Session.set("spaceType_value", null);
  //         Session.set("parkingArea_value", null);
  //         Session.set("instructions_value", null);
  //
  //         Session.set("evToggle_value", null);
  //         Session.set("disabled_value", null);
  //         Session.set("oversizedToggle_value", null);
  //       Router.go('uploadImagesView', {_id: result});
  //     }
  //   });
  //
  //
  // },
  'click #uploadImagesNext': function(event) {
    var parkingSpaceImg = Session.get('parkingSpaceImg');
    var parkingBuildingImg = Session.get('parkingBuildingImg');
    // var parkingVerificationImg = Session.get('parkingVerificationImg');

    var currentSpaceId = Router.current().params._id;

    Meteor.call('updateParkingSpaceImg', currentSpaceId, parkingSpaceImg);
    Meteor.call('updateParkingBuildingImg', currentSpaceId, parkingBuildingImg);
    // Meteor.call('updateParkingVerificationImg', currentSpaceId, parkingVerificationImg);

    console.log('upload image next');
    Session.set("updateParkingSpaceImg", null);
    Session.set("updateParkingBuildingImg", null);
    // Session.set("updateParkingVerificationImg", null);
    if(Router.current().params.query.edit){
      Router.go('/sumbitReview/' + Router.current().params._id);
    } else {
      Router.go('/ownerVerification?spaceId=' + currentSpaceId);
    }

  },
  'click #uploadImagesDone': function(event){
    if(Router.current().params.query.edit){
      var parkingVerificationImg = Session.get('parkingVerificationImg');
      var spaceId = Router.current().params.query.spaceId;
      if(parkingVerificationImg){
        Meteor.call('updateParkingVerificationImg', spaceId, parkingVerificationImg);
      }
      Session.set("updateParkingVerificationImg", null);
      Router.go('/sumbitReview/' + spaceId);
    } else if($('input[name="privacyCheckbox"]')[0].checked){
      var parkingVerificationImg = Session.get('parkingVerificationImg');
      var spaceId = Router.current().params.query.spaceId;
      if(parkingVerificationImg){
        Meteor.call('updateParkingVerificationImg', spaceId, parkingVerificationImg);
      }
      Session.set("updateParkingVerificationImg", null);
      Router.go('/sumbitReview/' + spaceId);
    } else {
      alert('Please read the Privacy Policy and check the box');
    }
  },
  // 'click #uploadImagesBack': function(event) {
  //   Router.go('/manageSpacesList');
  // },

  'click #reviewNext': function(event) {
    //validation
    if(Session.get('spaceFloor_value') != "") {
      Router.go('/spaceNumberView');
    } else {
      alert('Please input a floor number');
    }
  },

  'click #availabilitySave': function(event){
    var availability = Session.get('availability');
    for(let i=0; i<7; i++){
      for(let j=0; j<3; j++){
        if(!Session.get('isChecked' + j)){
          availability[i].timeSlots[j] = false;
        }
      }
      for(let j=3; j<11; j++){
        if(!Session.get('isChecked3')){
          availability[i].timeSlots[j] = false;
        }
      }
    }
    console.log("layout.js 401")
    console.log(availability)
    // Session.set('availability', availability);
    if(!$('input#setSpecificHours')[0].checked){
      // availability = Session.get('availability');
      // console.log(availability);
      if($('input#setHours')[0].checked){
        for(var i=0; i<7; i++){
  				// availability[i].startTime = $('select#allStartTime')[0].value;
  				// availability[i].endTime = $('select#allEndTime')[0].value;
    			for(let j=1; j<4; j++){
    				availability[i].timeSlots[j-1] = $('input[name="All"][data-type="' + j + '"]')[0].checked;
    			}
          for(let j=4; j<12; j++){
    				availability[i].timeSlots[j-1] = $('input[name="All"][data-type=4]')[0].checked;
    			}
  			}
        console.log('isSetHours true')
        Session.set('isSetHours', true);
      } else {
        // if(Session.get('isChecked2')){
      	// 	var startTime = 0;
      	// 	var endTime = 24;
      	// } else if(Session.get('isChecked0') && Session.get('isChecked1')){
      	// 	var startTime = 0;
      	// 	var endTime = 24;
      	// } else if(Session.get('isChecked0')){
      	// 	var startTime = 0;
      	// 	var endTime = 16;
      	// } else if(Session.get('isChecked1')){
      	// 	var startTime = 16;
      	// 	var endTime = 24;
      	// } else {
        //   var startTime = 0;
      	// 	var endTime = 24;
        // }
      	var timeSlots = [];
      	for(var i=0; i<3; i++){
      		if(Session.get('isChecked' + i)){
      			timeSlots[i] = true
      		} else {
      			timeSlots[i] = false
      		}
      	}
      	for(var i=3; i<11; i++){
      		if(Session.get('isChecked3')){
      			timeSlots[i] = true
      		} else {
      			timeSlots[i] = false
      		}
      	}
        for(var i=0; i<7; i++){
  				// availability[i].startTime = startTime;
  				// availability[i].endTime = endTime;
          availability[i].timeSlots = timeSlots;
  			}
        console.log('isSetHours false')
        Session.set('isSetHours', false);
      }
      // Session.set('availability', availability);
      console.log('isSetSpecificHours false')
      Session.set('isSetSpecificHours', false);
    } else {
      console.log('isSetSpecificHours true')
      Session.set('isSetSpecificHours', true);
      Session.set('isSetHours', true);
    }
    console.log("layout.js 468")
    console.log(availability)

    if($('input#isMonth')[0].checked){
      // Meteor.call('setSpaceAvailability', Router.current().params._id, Session.get('availability'));
      Meteor.call('setSpaceAvailability', Router.current().params._id, availability);

      Meteor.call('removeAllTimeSlot', Router.current().params._id, function(error, result){
        if(error){
          console.log(error)
        } else {
          Meteor.call('generateTimeSlot', Router.current().params._id, availability, moment().valueOf(), moment().add(30, 'days').endOf('day').valueOf())
        }
      })
    } else if($('input#isWeek')[0].checked){
      Meteor.call('setSpaceAvailability', Router.current().params._id, availability);
      Meteor.call('removeAllTimeSlot', Router.current().params._id, function(error, result){
        if(error){
          console.log(error)
        } else {
          Meteor.call('generateTimeSlot', Router.current().params._id, availability, moment().valueOf(), moment().add(7, 'days').endOf('day').valueOf())
        }
      })
    } else if($('input#isForever')[0].checked){
      Meteor.call('setSpaceAvailability', Router.current().params._id, availability);
      Meteor.call('removeAllTimeSlot', Router.current().params._id, function(error, result){
        if(error){
          console.log(error)
        } else {
          Meteor.call('generateTimeSlot', Router.current().params._id, availability, moment().valueOf(), moment().add(6, 'months').endOf('month').valueOf())
        }
      })
    }

    Router.go('/ratesAndAvailability/' + Router.current().params._id);
  },

  'click .availability-back': function(event){
    // Session.set('availability', null);
    // Session.set('isSetHours', false);
    // Session.set('isSetSpecificHours', false);
  },

  'click #customGroupSave': function(event){
    // var customeGroupSelected = [false, false, false];
    // if($('input#familyGroup')[0].checked){
    //   customeGroupSelected[0] = true;
    // }
    // if($('input#friendsGroup')[0].checked){
    //   customeGroupSelected[1] = true;
    // }
    // if($('input#othersGroup')[0].checked){
    //   customeGroupSelected[2] = true;
    // }
    // Session.set('customeGroupSelected', customeGroupSelected);
    Router.go('/access/' + Router.current().params._id);
  },

  'click .customGroup-back': function(event){
    event.preventDefault();
    Router.go('/access/' + Router.current().params._id);
  },

  'click #accessSave': function(event){
    var spaceId = Router.current().params._id;
    var access = {};
    access.everyone = $('#everyoneAccess')[0].checked;
    access.groups = [false, false, false];
    if($('#groupAccess')[0].checked){
      if($('input#evOnly')[0].checked){
        access.groups[0] = true;
      }
      if($('input#disabledOnly')[0].checked){
        access.groups[1] = true;
      }
      if($('input#landRover')[0].checked){
        access.groups[2] = true;
      }
    }
    // if(Session.get('customeGroupSelected')){
    //   access.customGroups = Session.get('customeGroupSelected')
    // } else {
    //   if(ParkingSpaces.findOne({_id: spacecId}).access){
    //     access.customGroups = ParkingSpaces.findOne({_id: spacecId}).access.customGroups;
    //   }
    // }

    // if(_.some(access.customGroups, Boolean)){
      access.freeGroup = true;
    // }

    Meteor.call('updateAccess', spaceId, access, function(error, result){
      if(error){
        console.log(error)
      } else {
        // Session.set('customeGroupSelected', null);
        Session.set('accessSelected', null);
        Router.go('/manageSpacesSummary/' + spaceId);
      }
    });
  },

  'click .access-back': function(event){
    event.preventDefault();
    Router.go('/manageSpacesSummary/' + Router.current().params._id);
  },

  'click #ratesAndAvailabilityDone': function(event){
    var rates = [{}, {}, {}, {}];
    for(let i=0; i<4; i++){
      if(Session.get('isChecked' + i)){
        if(Session.get('rates' + i)){
          rates[i].available = true;
          rates[i].value = Session.get('rates' + i);
        } else {
          alert('Please enter a price')
          return null;
        }
      } else {
        rates[i].available = false;
        rates[i].value = 0;
      }
    }
    var spaceId = Router.current().params._id;
    Meteor.call('updateRatesAndAvailability', spaceId, rates, function(error, result){
      if(error){
        console.log(error)
      } else {
        Router.go('/manageSpacesSummary/' + spaceId);
      }
    });
  },
  'click .ratesAndAvailability-back': function(event, template){
    event.preventDefault();
    Router.go('/manageSpacesSummary/' + Router.current().params._id);
  },

  'click #addCarSave': function(event, template){
    var userId = Meteor.userId();
    var model = $('input#addCarModel')[0].value;
    var number = $('input#addCarNumber')[0].value;
    if(model && number){
      console.log(model)
      console.log(number)
      var carObj = {};
      carObj.model = model;
      carObj.number = number;
      Meteor.call('addCar', userId, carObj);
      if(Router.current().params.query.back == 'selectCar'){
        Router.go('/selectCar')
      } else {
        Router.go('/myGarage');
      }
    } else {
      alert('Please input all information');
    }

  },
  'click #editCarSave': function(event, template){
    var userId = Meteor.userId();
    var model = $('input#editCarModel')[0].value;
    var number = $('input#editCarNumber')[0].value;
    var oldCarObj = Session.get('editingCarObj');
    if(model && number){
      console.log(model)
      console.log(number)
      var carObj = {};
      carObj.model = model;
      carObj.number = number;
      Meteor.call('editCar', userId, carObj, oldCarObj);
      if(Router.current().params.query.back == 'selectCar'){
        Router.go('/selectCar')
      } else {
        Router.go('/myGarage');
      }
    } else {
      alert('Please input all information');
    }

  },
  'click #addBankAccountDone': function(event, template){
    var userId = Meteor.userId();
    var name = $('input#addBankAccountsName')[0].value;
    var branchLocation = $('input#addBankAccountsBranchLocation')[0].value;
    var payee = $('input#addBankAccountsPayee')[0].value;
    var bankCode = $('input#addBankAccountsBankCode')[0].value;
    var accountNo = $('input#addBankAccountsAccountNo')[0].value;
    if(name && payee && bankCode && accountNo){
      // console.log(model)
      // console.log(number)
      var bankObj = {};
      bankObj.name = name;
      bankObj.branchLocation = branchLocation;
      bankObj.payee = payee;
      bankObj.bankCode = bankCode;
      bankObj.accountNo = accountNo;
      Meteor.call('addBankAccount', userId, bankObj);
      Router.go('/payoutMethods');
    } else {
      alert('Please fill in all required information');
    }

  },
  'click .back-to-map': function(event, template){
    if(Session.get("detailPreviousPath") == 'main'){
      // console.log('show spinner')
      // LoadingSpinnerModal.show();
      Session.set('backFromBuildingList', true);
      var spaceId = Session.get('bookingSpaceId');
      var parkingSpace = ParkingSpaces.findOne({_id: spaceId});
      Session.set('previousLat', parkingSpace.lat);
      Session.set('previousLng', parkingSpace.lng);
    }

  },
  'click .submit-review-back': function(event, template){
    // 'clicked back'
    event.preventDefault();
    Router.go('/manageSpacesList');
  },
  'click #reportIssueTypeNext': function(event, template){
    if($('input[name="issueType"]:checked').length > 0){
      var transactionId = Router.current().params._id;
      var reporter = Meteor.userId();
      var type = $('input[name="issueType"]:checked')[0].value;
      if(type === '4'){
        var issueText = $('input.report-text').val();
        if(!issueText){
          alert('Please input your issue')
          return true
        }
      }
      Session.set('issueObj', {
        transactionId: transactionId,
        reporter: reporter,
        type: type,
        issueText: issueText
      })
      Router.go('/reportPhotoProof');
    } else {
      alert("Please select a issue type")
    }
  },
  'click #reportPhotoProofNext': function(event, template){
    var reportImg = Session.get('reportImg');
    if(reportImg){
      var issueObj = Session.get('issueObj');
      issueObj.reportImg = reportImg;
      Issues.insert(issueObj, function(error, result){
        if(error){
          console.log(error)
        } else {
          Router.go('/reportFinish/' + result)
        }
      });
    } else {
      alert("Please take a picture to prove/show your issue.")
    }
  }
});

document.addEventListener("backbutton", onBackButtonDown, false);

function onBackButtonDown(event) {
  console.log('onBackButtonDown')
  console.log(Session.get('bookingThanks'))
  event.preventDefault();
  event.stopPropagation();
  if(Session.get("detailPreviousPath") == 'main'){
    console.log(Router.current().route.getName())
    if(Router.current().route.getName() == "bookingConfirmation"){
      Router.go('bookingDetails');
    } else {
      console.log('detailPreviousPath')
      Session.set('backFromBuildingList', true);
      var spaceId = Session.get('bookingSpaceId');
      var parkingSpace = ParkingSpaces.findOne({_id: spaceId});
      Session.set('previousLat', parkingSpace.lat);
      Session.set('previousLng', parkingSpace.lng);
      Router.go('main')
      // $('.back-btn').click();
    }
  } else if(Session.get('bookingThanks')){
    Router.go('main')
  } else {
    $('.back-btn').click();
    $('.pull-left').click();
    // window.history.back();
  }
}
