Meteor.methods({
  'createNewUser': function(newUser) {
    console.log(newUser);
    var userId
    try {
      userId = Accounts.createUser({
        email: newUser.email,
        password: newUser.password
        // profile: {
        //   fullname: newUser.fullname,
        //   email: newUser.email
        // }
      });
    } catch (error) {
      throw new Meteor.Error(500, 'Error:', error);
    }
    console.log(userId);
    if (userId) {
      Profile.insert({
        userId: userId,
        email: newUser.email,
        firstName: newUser.firstname,
        lastName: newUser.lastname
      });
      return true
    }
  },
  'createParkingSpace': function(newSpace) {
    var result = ParkingSpaces.insert(newSpace);
    console.log(result);
    return result;
  },
  'updateParkingSpaceImg': function(currentSpaceId, imgId) {
    ParkingSpaces.update(currentSpaceId, {$set: {parkingSpaceImg: imgId, lastUpdatedAt: new Date()} } );
  },
  'updateParkingBuildingImg': function(currentSpaceId, imgId) {
    ParkingSpaces.update(currentSpaceId, {$set: {parkingBuildingImg: imgId, lastUpdatedAt: new Date()} } );
  },
  'updateParkingVerificationImg': function(currentSpaceId, imgId) {
    ParkingSpaces.update(currentSpaceId, {$set: {parkingVerificationImg: imgId, lastUpdatedAt: new Date()} } );
  },
  'updatePriceForDate': function(spaceId, date, type, price, timestamp_start, timestamp_end) {
    Timeslots.findAndModify({
              query: {spaceId: spaceId,
                      timeslotDate: date,
                      timeslotType: type },
              update: {$set:{ timeslotPrice: price,
                              isBooked: false,
                              timestampStart: timestamp_start,
                              timestampEnd: timestamp_end      } },
              upsert: true
            });
  },
  'removePriceForDate': function(spaceId, date, type) {
    Timeslots.findAndModify({
              query: {spaceId: spaceId,
                      timeslotDate: date,
                      timeslotType: type },
              remove: true
            });
  },
  //braintree methods

  'generateClientToken': function() {
    var syncMethod = Meteor.wrapAsync(brainTree.clientToken.generate);
    var result = syncMethod({});
    return result.clientToken;
  },

  'createNewCustomer': function(nonce, cardholderName) {
    var syncMethod = Meteor.wrapAsync(brainTree.customer.create);
    var profile = Profile.findOne({userId: Meteor.userId()});
    try {
      var result = syncMethod({
                                firstName: profile.firstName || '',
                                lastName: profile.lastName || '',
                                creditCard: {
                                  cardholderName:cardholderName,
                                  paymentMethodNonce: nonce
                                }

                              });
    } catch (error) {
      throw new Meteor.Error(500, 'Error:', error);
    }

    return result;
  },

  'getCustomerObj': function() {
    var syncMethod = Meteor.wrapAsync(brainTree.customer.find);
    var customerId = Profile.findOne({userId: Meteor.userId()}).btCustomerId;
    try {
      var result = syncMethod(customerId);
    } catch (error) {
      console.log(error)
      throw new Meteor.Error(500, 'Error:', error);
    }

    return result;
  },

  'updateCustomerWithNewPaymentMethod': function(btCustomerId, nonce, cardholderName) {
    var syncMethod = Meteor.wrapAsync(brainTree.customer.update);
    try {
      var result = syncMethod(btCustomerId,
                              {
                                creditCard: {
                                  cardholderName:cardholderName,
                                  paymentMethodNonce: nonce
                                }

                              });
    } catch (error) {
      throw new Meteor.Error(500, 'Error:', error);
    }

    return result;
  },

  'updateProfileWithBtCustomerId': function(customerId) {
    Profile.update({userId: Meteor.userId()}, {$set: {btCustomerId: customerId}}, function(error, result) {
      if (error) {
        throw new Meteor.Error(500, 'Error:', error);
      } else {
        return result
      }
    });
  },
  'chargeCreditCardWithAmount': function(amount, token) {
    var syncMethod = Meteor.wrapAsync(brainTree.transaction.sale);
    try {
      var result = syncMethod({
                                amount: amount+".00",
                                paymentMethodToken: token
                              });
    } catch (error) {
      throw new Meteor.Error(500, 'Error:', error);
    }

    return result;
  },
  'deleteCreditCard': function(token){
    var syncMethod = Meteor.wrapAsync(brainTree.paymentMethod.delete);
    console.log(token)
    try {
      var result = syncMethod(token);
    } catch (error) {
      console.log(error)
      throw new Meteor.Error(500, 'Error:', error);
    }

    return result;
  },
  'cancelTransaction': function(transactionId) {
    var transactionObj = Transactions.findOne({_id: transactionId});
    var btTransactionId = transactionObj.btTransactionId;
    console.log(transactionObj)
    console.log(btTransactionId)
    var syncMethod = Meteor.wrapAsync(brainTree.transaction.void);
    try {
      console.log(btTransactionId)
      var result = syncMethod(btTransactionId);
      // var result = syncMethod({transactionId: btTransactionId});
      console.log(result)
    } catch (error) {
      console.log(error)
      throw new Meteor.Error(500, 'Error:', error);
    }
    console.log(transactionObj.timeslotIdArray)
    Timeslots.update({_id: {$in: transactionObj.timeslotIdArray}}, {$set: {isBooked: false}});
    var timeslotObj = Timeslots.findOne({_id: transactionObj.timeslotIdArray[0]});
    var bookedSlot = Timeslots.find({spaceId: timeslotObj.spaceId, timeslotDate: timeslotObj.timeslotDate, isBooked: true}).fetch();
    var occupiedSlotArray = [];
    _.each(bookedSlot, function(bookedObj){
      if(bookedObj.timeslotType == 0){
        occupiedSlotArray.concat([2,3,4,5,6,7,8,9,10])
      } else if(bookedObj.timeslotType == 1){
        occupiedSlotArray.concat([2]);
      } else if(bookedObj.timeslotType == 2){
        occupiedSlotArray.concat([0,1,3,4,5,6,7,8,9,10]);
      } else if(bookedObj.timeslotType > 2){
        occupiedSlotArray.concat([0,2]);
      }
    })
    occupiedSlotArray = _.uniq(occupiedSlotArray);

    Timeslots.update({spaceId: timeslotObj.spaceId, timeslotDate: timeslotObj.timeslotDate, timeslotType: {$in: occupiedSlotArray}}, {$set: {isOccupied: true}}, {multi: true});
    Transactions.remove({_id: transactionId})
    return true
  },
  'addTransactionOnPaymentSuccess': function(transactionObj){
    console.dir(transactionObj);
    var transactionId = Transactions.insert(transactionObj);
    console.log('new transaction is created.');
    return transactionId;
  },
  'markTimeslotArrayAsBooked': function(timeslotIdArray) {
    console.log(timeslotIdArray);
    var timeslotObj = Timeslots.findOne({_id: timeslotIdArray[0]});
    var occupiedSlotArray;
    if(timeslotObj.timeslotType == 0){
      occupiedSlotArray = [2,3,4,5,6,7,8,9,10];
    } else if(timeslotObj.timeslotType == 1){
      occupiedSlotArray = [2];
    } else if(timeslotObj.timeslotType == 2){
      occupiedSlotArray = [0,1,3,4,5,6,7,8,9,10];
    } else if(timeslotObj.timeslotType > 2){
      occupiedSlotArray = [0,1,2];
    }
    Timeslots.update({spaceId: timeslotObj.spaceId, timeslotDate: timeslotObj.timeslotDate, timeslotType: {$in: occupiedSlotArray}}, {$set: {isOccupied: true}}, {multi: true});
    Timeslots.update({_id: {$in: timeslotIdArray}}, {$set: {isBooked: true} }, {multi: true}, function(error, result) {
      if(error){
        throw new Meteor.Error(500, 'Error:', error);
      } else {
        console.log('a timeslot ' + ' is marked as booked');
      }
    });
  },
  'updateReportImg': function(reportImgObj){
    Transactions.update({_id: reportImgObj.transactionId}, {$set: {reportImgId: reportImgObj.reportImgId}}, function(err, result) {
      if(err){
        console.log(err);
        throw new Meteor.Error(500, 'Error:', error);
      } else {
        console.log('a timeslot is marked as booked');
      }
    });
  },
  'updateParkingSpace': function(spaceId, updateObj){
    ParkingSpaces.update({_id: spaceId}, {$set: updateObj}, function(error, result){
      if(error){
        console.log(error);
        throw new Meteor.Error(500, 'Error: ', error);
      } else {
        ParkingSpaces.update({_id: spaceId}, {$set: {lastUpdatedAt: new Date()}});
        return true;
      }
    });
  },
  'pendingParkingSpace': function(spaceId){
    ParkingSpaces.update({_id: spaceId}, {$set: {status: 2}}, function(error, result){
      if(error){
        console.log(error);
        throw new Meteor.Error(500, 'Error: ', error);
      } else {
        return true;
      }
    })
  },
  'saveAvailability': function(availability){
    Profile.update({userId: Meteor.userId()}, {$set: {availability: availability}}, function(error, result){
      if(error){
        console.log(error);
        throw new Meteor.Error(500, 'Error: ', error);
      } else {
        return true;
      }
    });
  },
  // 'insertGroupEmail': function(groupIndex, email){
  //   // console.log('called insertGroupEmail')
  //   // console.log(groupIndex)
  //   Profile.update({userId: Meteor.userId()}, {$push: {freeGroup: email}});
  //   if(groupIndex == 0){
  //     Profile.update({userId: Meteor.userId()}, {$push: {'customGroup.family': email}}, function(error, result){
  //       if(error){
  //         console.log(error);
  //         throw new Meteor.Error(500, 'Error: ', error);
  //       } else {
  //         return true;
  //       }
  //     });
  //   } else if(groupIndex == 1){
  //     Profile.update({userId: Meteor.userId()}, {$push: {'customGroup.friends': email}}, function(error, result){
  //       if(error){
  //         console.log(error);
  //         throw new Meteor.Error(500, 'Error: ', error);
  //       } else {
  //         return true;
  //       }
  //     });
  //   } else if(groupIndex == 2){
  //     Profile.update({userId: Meteor.userId()}, {$push: {'customGroup.others': email}}, function(error, result){
  //       if(error){
  //         console.log(error);
  //         throw new Meteor.Error(500, 'Error: ', error);
  //       } else {
  //         return true;
  //       }
  //     });
  //   } else {
  //     throw new Meteor.Error(500, 'Wrong custom group index');
  //   }
  // },
  'insertGuestEmail': function(email){
    Profile.update({userId: Meteor.userId()}, {$addToSet: {freeGroup: email}});
  },
  // 'deleteGroupEmail': function(groupIndex, obj){
  //   console.log('called deleteGroupEmail')
  //   console.log(obj)
  //   Profile.update({userId: Meteor.userId()}, {$pull: {freeGroup: obj.email}}, {multi: false});
  //   if(groupIndex == 0){
  //     Profile.update({userId: Meteor.userId()}, {$pull: {'customGroup.family': obj.email}}, {multi: false}, function(error, result){
  //       if(error){
  //         console.log(error);
  //         throw new Meteor.Error(500, 'Error: ', error);
  //       } else {
  //         console.log('removed family' + result)
  //         return true;
  //       }
  //     });
  //   } else if(groupIndex == 1){
  //     Profile.update({userId: Meteor.userId()}, {$pull: {'customGroup.friends': obj.email}}, {multi: false}, function(error, result){
  //       if(error){
  //         console.log(error);
  //         throw new Meteor.Error(500, 'Error: ', error);
  //       } else {
  //         console.log('removed friends' + result)
  //         return true;
  //       }
  //     });
  //   } else if(groupIndex == 2){
  //     Profile.update({userId: Meteor.userId()}, {$pull: {'customGroup.others': obj.email}}, {multi: false}, function(error, result){
  //       if(error){
  //         console.log(error);
  //         throw new Meteor.Error(500, 'Error: ', error);
  //       } else {
  //         console.log('removed others' + result)
  //         return true;
  //       }
  //     });
  //   } else {
  //     throw new Meteor.Error(500, 'Wrong custom group index');
  //   }
  // },
  'deleteGuestEmail': function(email){
    Profile.update({userId: Meteor.userId()}, {$pull: {freeGroup: email}}, {multi: false});
  },
  'updateAccess': function(spaceId, access){
    console.log(access);
    ParkingSpaces.update({_id: spaceId}, {$set: {access: access, lastUpdatedAt: new Date()}}, function(error, result){
      if(error){
        console.log(error);
        throw new Meteor.Error(500, 'Error: ', error);
      } else {
        return true;
      }
    })
  },
  'updateRatesAndAvailability': function(spaceId, rates){
    console.log(rates);
    ParkingSpaces.update({_id: spaceId}, {$set: {rates: rates, lastUpdatedAt: new Date()}}, function(error, result){
      if(error){
        console.log(error);
        throw new Meteor.Error(500, 'Error: ', error);
      } else {
        return true;
      }
    })
  },
  'generateTimeSlot': function(spaceId, availability, startDate, endDate){
    // var startDate = moment();
    // var endDate = moment().add(1, 'months').endOf('month');

    var currentFreeSlotTime = moment(startDate).startOf('day');
    var startWeekday = moment(currentFreeSlotTime).isoWeekday();

    _.forEach(availability, function(element, index, list){
      if(element.available){
        var weekdayIndex = index;
        if(index == 0){
          weekdayIndex = 7;
        }
        var weekdayFreeSlotTime = moment(currentFreeSlotTime).isoWeekday(weekdayIndex);
        if(weekdayIndex < startWeekday){
          weekdayFreeSlotTime.add(7, 'days');
        }
        var timeslotObj = {};

        while(weekdayFreeSlotTime.valueOf() < endDate.valueOf()){
          var date = moment(weekdayFreeSlotTime).format('YYYY-M-D');
          timeslotObj.spaceId = spaceId;
          timeslotObj.timeslotDate = date;
          timeslotObj.timestampDate = moment(weekdayFreeSlotTime).valueOf();
          timeslotObj.isBooked = false;

          // var dateTimeStamp = moment(weekdayFreeSlotTime).startOf('day').valueOf();
          // console.log(dateTimeStamp);
          // console.log(element.startTime);
          // console.log(element.endTime);
          // timeslotObj.timestampStart = dateTimeStamp + (parseInt(element.startTime) + 6) * 3600000;
          // if(parseInt(element.endTime) == 0){
          //   timeslotObj.timestampEnd = dateTimeStamp + 30 * 3600000;
          // } else {
          //   timeslotObj.timestampEnd = dateTimeStamp + (parseInt(element.endTime) + 6) * 3600000;
          // }

          // timeslotObj.timeslotStart = element.startTime;
          // timeslotObj.timeslotEnd = element.endTime;

          // for (var i=element.startTime; i < element.endTime; i++){
          //   timeslotObj.timeslotType = i;
          //   Timeslots.insert(timeslotObj);
          // }

          _.each(element.timeSlots, function(timeSlotsElement, timeSlotsIndex, timeSlotsList){
            if(timeSlotsElement){
              timeslotObj.timeslotType = timeSlotsIndex;
              if(timeSlotsIndex === 0){
                timeslotObj.timestampStart = moment(weekdayFreeSlotTime).hours(8).valueOf();
                timeslotObj.timestampEnd = moment(weekdayFreeSlotTime).hours(22).valueOf();
              } else if(timeSlotsIndex === 1){
                timeslotObj.timestampStart = moment(weekdayFreeSlotTime).hours(22).valueOf();
                timeslotObj.timestampEnd = moment(weekdayFreeSlotTime).hours(30).valueOf();
              } else if(timeSlotsIndex === 2){
                timeslotObj.timestampStart = moment(weekdayFreeSlotTime).hours(8).valueOf();
                timeslotObj.timestampEnd = moment(weekdayFreeSlotTime).hours(30).valueOf();
              } else if(timeSlotsIndex > 2 && timeSlotsIndex < 11) {
                timeslotObj.timestampStart = moment(weekdayFreeSlotTime).hours(timeSlotsIndex + 6).valueOf();
                timeslotObj.timestampEnd = moment(weekdayFreeSlotTime).hours(timeSlotsIndex + 7).valueOf();
              }
              if(moment().valueOf() < timeslotObj.timestampStart){
                Timeslots.insert(timeslotObj);
              }
            }
          })

          // Timeslots.insert(timeslotObj);
          weekdayFreeSlotTime.add(7, 'days');
        }
      }
    })
  },
  'removeAllTimeSlot': function(spaceId){
    var currentTime = moment().valueOf();
    Timeslots.remove({spaceId: spaceId, timestampStart: {$gte: currentTime}, isBooked: false});
  },
  'toggleDayOff': function(spaceId, date, dayOff){
    console.log('toggleDayOff')
    Timeslots.update({spaceId: spaceId, timeslotDate: date}, {$set: {dayOff: dayOff}}, {multi: true});
  },
  'changeStartEndTime': function(spaceId, date, startTime, endTime){
    console.log('changeStartEndTime')
    Timeslots.remove({spaceId: spaceId, timeslotDate: date, isBooked: false});
    console.log('removed')
    var timestampDate = moment(date, 'YYYY-M-D').valueOf();
    // console.log(timestampDate);
    var timeslotObj = {};
    timeslotObj.spaceId = spaceId;
    timeslotObj.timeslotDate = date;
    timeslotObj.timestampDate = timestampDate;
    timeslotObj.isBooked = false;
    timeslotObj.dayOff = false;
    // console.log(timeslotObj)
    // console.log(startTime)
    // console.log(endTime)

    for (var i = parseInt(startTime); i < parseInt(endTime); i++){
      timeslotObj.timeslotType = i;
      // console.log(timeslotObj)
      Timeslots.insert(timeslotObj, function(error, result){
        if(error){
          console.log(error)
        }
      });
    }
  },

  // 'changeStartTime': function(spaceId, date, startTime){
  //   for (var i=0; i < startTime; i++){
  //     Timeslots.remove({spaceId: spaceId, timeslotDate: date, timeslotType: i, isBooked: false});
  //   }
  //
  //   Timeslots.update({spaceId: spaceId, timeslotDate: date}, {$set: {timeslotStart: startTime}}, {multi: true});
  // },
  // 'changeEndTime': function(spaceId, date, endTime){
  //   Timeslots.update({spaceId: spaceId, timeslotDate: date}, {$set: {timeslotEnd: endTime}}, {multi: true});
  // },
  'setSpaceAvailability': function(spaceId, availability){
    console.log('setSpaceAvailability')
    var weeklyAvailability = {};
    weeklyAvailability.available = false;
    ParkingSpaces.update({_id: spaceId}, {$set: {availability: availability, weeklyAvailability: weeklyAvailability, lastUpdatedAt: new Date()}})
  },
  'setSpaceWeeklyAvailability': function(spaceId, availability){
    console.log('setSpaceWeeklyAvailability')
    var weeklyAvailability = {};
    weeklyAvailability.available = true;
    weeklyAvailability.endTime = moment().add(7, 'days').endOf('day').valueOf();
    weeklyAvailability.availability = availability
    ParkingSpaces.update({_id: spaceId}, {$set: {weeklyAvailability: weeklyAvailability, lastUpdatedAt: new Date()}})
  },
  'addCar': function(userId, carObj){
    Profile.update({userId: userId}, {$addToSet: {garages: carObj}})
  },
  'editCar': function(userId, carObj, oldCarObj){
    Profile.update({userId: userId}, {$pull: {garages: oldCarObj}});
    Profile.update({userId: userId}, {$addToSet: {garages: carObj}})
  },
  'deleteCar': function(userId, carObj){
    Profile.update({userId: userId}, {$pull: {garages: carObj}});
  },
  'setRating': function(spaceId, userId, rating){
    ParkingSpaces.update({_id: spaceId}, {$pull: {ratings: {userId: userId}}});
    ParkingSpaces.update({_id: spaceId}, {$addToSet: {ratings: {userId: userId, rate: rating}}});
  },
  'addBankAccount': function(userId, bankObj){
    Profile.update({userId: userId}, {$addToSet: {bankAccounts: bankObj}})
  },
  'removeBankAccount': function(userId, bankObj){
    Profile.update({userId: userId}, {$pull: {bankAccounts: bankObj}})
  },
  'requestPayout': function(userId, accountObj, amount){
    // console.log(accountObj);
    var payoutObj = {}
    payoutObj.requestedAt = moment().valueOf();
    payoutObj.userId = userId;
    payoutObj.account = accountObj;
    payoutObj.amount = amount;
    // console.log(payoutObj)
    Payouts.insert(payoutObj);
  },
  'toggleStatus': function(spaceId, status){
    ParkingSpaces.update({_id: spaceId}, {$set: {status: status}});
  },
  'checkIsFree': function(spaceId, userId){
    var parkingSpace = ParkingSpaces.findOne({_id: spaceId});
		console.log(parkingSpace)
		if(parkingSpace.access){
			if(parkingSpace.access.freeGroup){
				var ownerProfile = Profile.findOne({userId: parkingSpace.ownerId});
				var userProfile = Profile.findOne({userId: userId});
        console.log(ownerProfile)
				console.log(userProfile)
				if(ownerProfile.freeGroup){
					if(_.indexOf(ownerProfile.freeGroup, userProfile.email) > -1){
            console.log('really free')
						return true;
					}
				}
			}
		}
    throw new Meteor.error('Not Free')
  },
  'deleteSpace': function(spaceId){
    // ParkingSpaces.update({_id: spaceId}, {$set: {status: 6, lastUpdatedAt: new Date()}});
    ParkingSpaces.remove({_id: spaceId});
  }
});
