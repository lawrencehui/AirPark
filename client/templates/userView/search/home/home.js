var timeslot = [
	{type: 0, text:'8am - 10pm'},
	{type: 1, text:'10pm - 8am'},
	{type: 2, text:'8am - 8am'},
	{type: 3, text:'9am - 5pm'}
];

var timeSlotText = [
	'6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm',
	'6pm','7pm','8pm','9pm','10pm'
];

Template.main.helpers({
  // isCurrentLocationActive: function() {
  //   return Session.get("isCurrentLocationActive")? "location-icon-active" : ""
  // },

  selectedDate: function() {
    var calenderSelected = Session.get('calenderDropdownSelected');
    if (_.isEmpty(calenderSelected.date)) {
			if(moment().hours() >= 22){
				calenderSelected.date = moment().add(1, "days").format("YYYY-M-D");
			} else {
				calenderSelected.date = moment().format("YYYY-M-D")
			}

			console.log('testing date');
			console.log(calenderSelected.date);

      Session.set('calenderDropdownSelected', calenderSelected);
      return moment().format("YYYY-M-D");
    } else {
      var dateString = calenderSelected.date;
      // var displayString = dateString.replace(/-/g, " - ");
      return dateString;
    }
  },

  selectedTimeslot: function() {
		// var currentTime = moment().hours();
		// var startTimeIndex = currentTime - 6;
		// var endTimeIndex = startTimeIndex + 1;
		// if(startTimeIndex < 0 || startTimeIndex == 16 || startTimeIndex == 17){
		// 	startTimeIndex = 16;
		// 	endTimeIndex = 0;
		// }
		//
		// var startTime = timeSlotText[startTimeIndex];
		// var endTime = timeSlotText[endTimeIndex];
		//
		// if(Session.get('searchOvernightParking')){
		// 	endTime = '6am';
		// 	if(Session.get('searchHourlyParking')){
		// 		startTime = timeSlotText[Session.get('searchStartTime')];
		// 	} else {
		// 		startTime = '10pm';
		// 	}
		// } else {
		// 	if(Session.get('searchHourlyParking')){
		// 		startTime = timeSlotText[Session.get('searchStartTime')];
		// 		endTime = timeSlotText[Session.get('searchEndTime')];
		// 	}
		// }
		// return startTime + ' - ' + endTime;

    var calenderSelected = Session.get('calenderDropdownSelected');
		console.log(calenderSelected)
		if(calenderSelected.timeslot){
			return timeslot[parseInt(calenderSelected.timeslot)].text
		} else {
			console.log("home.js 71")
			if(moment().hours() < 8){
				calenderSelected.timeslot = "0"
				Session.set('calenderDropdownSelected', calenderSelected)
				return timeslot[0].text
			} else if(moment().hours() < 22){
				calenderSelected.timeslot = "1"
				Session.set('calenderDropdownSelected', calenderSelected)
				return timeslot[1].text
			} else {
				calenderSelected.timeslot = "0"
				Session.set('calenderDropdownSelected', calenderSelected)
				return timeslot[0].text
			}
		}

    // if (_.isEmpty(calenderSelected.timeslot)) {
    //   var todayString = moment().format("DD-MM-YYYY");
    //   var am8 = moment(todayString + ' 08:00', "DD-MM-YYYY HH:mm");
    //   var pm12 = moment(todayString + ' 12:00', "DD-MM-YYYY HH:mm");
    //   var pm4 = moment(todayString + ' 16:00', "DD-MM-YYYY HH:mm");
    //   var pm8 = moment(todayString + ' 20:00', "DD-MM-YYYY HH:mm");
		//
    //   if (moment().isBefore(pm12) && moment().isAfter(am8)) {
    //     calenderSelected.timeslot.push(0);
    //     Session.set('calenderDropdownSelected', calenderSelected);
    //     return "8am - 12pm"
    //   } else if (moment().isBefore(pm4) && moment().isAfter(pm12)) {
    //     calenderSelected.timeslot.push(1);
    //     Session.set('calenderDropdownSelected', calenderSelected);
    //     return "12pm - 4pm"
    //   } else if (moment().isBefore(pm8) && moment().isAfter(pm4)) {
    //     calenderSelected.timeslot.push(2);
    //     Session.set('calenderDropdownSelected', calenderSelected);
    //     return "4pm - 8pm"
    //   } else {
    //     calenderSelected.timeslot.push(0);
    //     Session.set('calenderDropdownSelected', calenderSelected);
    //     return "8am - 12pm"
    //   }
    // } else {
    // var processed = _.map(calenderSelected.timeslot, function(type) {
    //   var result = _.where(timeslot, {type: parseInt(type)});
    //   return result[0].text;
    // });
    // return processed.join(', ');
    // }
  },

  isSelected: function(toggleType){
    console.log(toggleType);
    switch(toggleType) {
      case 0:
        if(Session.get('EVOption')) {
          return "toggleSelected";
        } else {
          return "";
        }
        break;
      case 1:
        if(Session.get('disabledOption')) {
          return "toggleSelected";
        } else {
          return "";
        }
        break;
      case 2:
        if(Session.get('customOption')) {
          return "toggleSelected";
        } else {
          return "";
        }
        break;
    }
  },
	isDropdownOpen: function(){
		if(Session.get('isCalenderDropdownOpen')){
			console.log("drop-down-open")
			return "drop-down-open"
		} else {
			return ""
		}
	}
});

Template.main.events({
  'click .date-time-filter-container': function(event, template) {
		var changeFilter = false;
		if(Session.get('isDateFilter')){
			if($(event.target).hasClass('time-container') || $(event.target).parent().hasClass('time-container')){
				changeFilter = true;
			}
		} else {
			if($(event.target).hasClass('date-container') || $(event.target).parent().hasClass('date-container')){
				changeFilter = true;
			}
		}
		if($(event.target).hasClass('date-container') || $(event.target).parent().hasClass('date-container')){
			Session.set('isDateFilter', true)
		} else {
			Session.set('isDateFilter', false)
		}
    var isDropdownOpen = Session.get('isCalenderDropdownOpen');
    if (isDropdownOpen) {
			if(!changeFilter){
				var view = Blaze.getView($(".drop-down-container").children().get(0));
				var calenderSelected = Session.get('calenderDropdownSelected');
				var type = $('input[name="searchTimeslot"]:checked')[0].dataset.type;
				calenderSelected.timeslot = type
				// calenderSelected.timeslot = parseInt($(event.currentTarget)[0].dataset.type)
				if(type === '3'){
					calenderSelected.timeslotArray = [3,4,5,6,7,8,9,10];
				}
				console.log(calenderSelected)
				Session.set('calenderDropdownSelected', calenderSelected)

	      Blaze.remove(view);
	      Session.set('isCalenderDropdownOpen', false);

				//set marker session

				// var calenderSelected = Session.get('calenderDropdownSelected');
				//
				// // var currentTime = moment().hours();
				// // var startTime = currentTime - 6;
				// // var endTime = startTime + 1;
				// // if(startTime < 0 || startTime == 16 || startTime == 17){
				// // 	startTime = 16;
				// // 	endTime = 24;
				// // }
				// //
				// // if(Session.get('searchOvernightParking')){
				// // 	endTime = 24;
				// // 	if(Session.get('searchHourlyParking')){
				// // 		startTime = parseInt(Session.get('searchStartTime'));
				// // 	} else {
				// // 		startTime = 16;
				// // 	}
				// // } else {
				// // 	if(Session.get('searchHourlyParking')){
				// // 		startTime = parseInt(Session.get('searchStartTime'));
				// // 		endTime = parseInt(Session.get('searchEndTime'));
				// // 	}
				// // }
				// var oldSelectedDate = calenderSelected.date;
				// var selectedTimeslot = parseInt(calenderSelected.timeslot);
				// var allTimeslotsArray = [];
				//
				// var sortedTimeslots = Timeslots.find({
				// 	timeslotDate: oldSelectedDate,
				// 	isBooked: false,
				// 	isOccupied: false,
				// 	dayOff: false
	      // }).fetch();
				//
				// if(selectedTimeslot === 3){
				// 	var timeslotArray = calenderSelected.timeslotArray;
				// 	console.log(timeslotArray)
				// 	var allTimeslotsArray = [];
				// 	lodash.forEach(timeslotArray, function(timeslotIndex){
				// 		var spaceIdArray = []
				// 		// var allTimeslots = Timeslots.find({
				// 		// 	timeslotDate: oldSelectedDate,
				// 		// 	timeslotType: timeslotIndex,
				// 		// 	isBooked: false,
				// 		// 	isOccupied: false,
				// 		// 	dayOff: false
			  //     // }).fetch();
				// 		var allTimeslotsObj = lodash.filter(sortedTimeslots, {'timeslotType': selectedTimeslot})
				// 		spaceIdArray = _.map(allTimeslotsObj, 'spaceId');
				// 		allTimeslotsArray.push(spaceIdArray)
				//
				// 	})
				// 	var allTimeslots = _.intersection.apply(_, allTimeslotsArray);
				//
				// } else {
				// 	// var allTimeslots = Timeslots.find({
				// 	// 	'timeslotDate': oldSelectedDate,
				// 	// 	'timeslotType': selectedTimeslot,
				// 	// 	'isBooked': false,
				// 	// 	'isOccupied': false,
				// 	// 	'dayOff': false
				// 	// }).fetch()
				// 	var allTimeslotsObj = lodash.filter(sortedTimeslots, {'timeslotType': selectedTimeslot})
				// 	allTimeslots = _.map(allTimeslotsObj, 'spaceId');
				// }
				// console.log(allTimeslots)
				//
				// // for(var i = startTime; i < endTime; i++){
				// // 	var spaceIdArray = []
				// // 	var allTimeslotsTime = lodash.filter(allTimeslots, {'timeslotType': i});
				// // 	spaceIdArray = _.map(allTimeslotsTime, 'spaceId');
				// // 	allTimeslotsArray.push(spaceIdArray)
				// // }
				// // allTimeslotsArray = _.intersection.apply(_, allTimeslotsArray);
				// Session.set('allTimeslots', allTimeslots)
			}
    } else {
      Blaze.renderWithData(Template.calenderDropdown, {}, $('.drop-down-container').get(0));
      Session.set('isCalenderDropdownOpen', true);
    }
  },
  'click .filter-btn': function(e) {
    var toggleType = parseInt($(e.target).attr('data-toggle-type'));

    switch(toggleType) {
      case 0:
        Session.set('EVOption', !Session.get('EVOption'));
        break;
      case 1:
        Session.set('disabledOption', !Session.get('disabledOption'));
        break;
      case 2:
        Session.set('customOption', !Session.get('customOption'));
        break;
    }
  },
	// 'click #currentLocationBtn': function(event) {
	// 	console.log('currentLocationBtn clicked');
	//
	// 	var position = Geolocation.currentLocation();
	//
	// 	// navigator.geolocation.getCurrentPosition(onSuccess,onError);
	// 	if (position) {
	// 		var lat = position.coords.latitude;
	// 		var lng = position.coords.longitude;
	//
	// 		var initialLocation = new google.maps.LatLng(lat,lng);
	//
	// 		var lat_lng_str = lat + ", " + lng;
	// 		console.log(lat_lng_str);
	//
	// 		// $("#searchBar").geocomplete("find", lat_lng_str);
	// 		var map = $("#searchBar").geocomplete('map');
	//
  //     // var map = new google.maps.Map(document.getElementById('map_canvas'),
  //     //   mapOptions);
  //     // var GeoMarker = new GeolocationMarker(map);
	//
	// 		var GeoMarker = new GeolocationMarker();
  //     // GeoMarker.setCircleOptions({fillColor: '#808080'});
  //     GeoMarker.setMap(map);
	//
  //     console.dir(GeoMarker);
	// 		map.setCenter(initialLocation);
	// 		map.setZoom(18);
	//
	// 		Session.set("isCurrentLocationActive", true);
	// 	}
	// },
	'blur #searchBar': function(event) {
		console.log('blur event callled');
		Session.set("locationText", $('#searchBar').val() );
	},
	'click button[type="reset"]': function(event) {
		$('#searchBar').focus();
		console.log('reset form called');
	}
})

Template.main.onCreated(function() {
	// LoadingSpinnerModal.show();
	console.log("onCreated")
  GoogleMaps.ready('map2', function(map) {
  });

  Session.set("isCurrentLocationActive", false);
  Session.set("isCalenderDropdownOpen", false);
  Session.set('EVOption', false);
  Session.set('disabledOption', false);
  Session.set('customOption', false);
  Session.set('clusterMarkersStore', null);
	Session.set('bookingThanks', false);
	Session.set('detailPreviousPath', false);

  var obj = {
    date: null,
    timeslot: null
  };
  Session.setDefault('calenderDropdownSelected', obj);

  if(Session.get('locationText')){
    $('#searchBar').val(Session.get('locationText'));
  }

	Meteor.subscribe('ownProfile')
});

Template.main.onRendered(function() {
  // deferFocus($('#searchBar'));
	// if(Session.get("locationText")){
	// 	$('#searchBar').val(Session.get("locationText"));
	// }
	console.log('onRendered')

	Session.set('isDateFilter', true)

  $(document).on({'DOMNodeInserted': function() {
                    $('.pac-item, .pac-item span', this).addClass('needsclick');
                    }
                  }, '.pac-container');


  var markerCluster;

  this.autorun(function () {
    console.log('autorun load map');




    if (GoogleMaps.loaded()) {
			// Meteor.setTimeout(function(){
				// LoadingSpinnerModal.hide();
			// }, 10000);


      $.getScript("javascript/markerwithlabel.js");
      $.getScript("geolocation-marker.js");

      //methods for geocomoplete
      $("#searchBar").geocomplete({
        map: $("#map2"),
        // location: new google.maps.LatLng(22.3094695, 114.2230657),
        markerOptions: {
          draggable: false,
          disabled: false
        },
        mapOptions: {
          zoom: 16,
          streetViewControl: false,
          mapTypeControl: false,
          styles : [{ featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }]
                   }]
        }
      })
      .bind("geocode:result", function(event, result){
        console.log("clicked geocode:result");
        $('div.content.overflow-scroll.has-header').css("bottom",0);
        // console.log(result);
        $("#searchBar").geocomplete("map").setZoom(18);
        // $("#searchBar").unbind("geocode:result");
      })
      .bind("geocode:dragged", function(event, latLng){
        console.log('marker dragged');
        console.log('Lat: ' + latLng.lat());
        console.log('Lng: ' + latLng.lng());
        Session.set("Lat_value", latLng.lat());
        Session.set("Lng_value", latLng.lng());
        // $("#searchBar").unbind("geocode:dragged");
      });

      var position = Geolocation.currentLocation();

			if(Session.get('backFromBuildingList')){
				console.log('set previous location')
				var lat = Session.get("previousLat");
        var lng = Session.get("previousLng");
				console.log(lat)
				console.log(lng)

        var lat_lng_str = lat + ", " + lng;

        var initialLocation = new google.maps.LatLng(lat,lng);

        var map = $("#searchBar").geocomplete('map');

        var GeoMarker = new GeolocationMarker();
        // GeoMarker.setCircleOptions({fillColor: '#808080'});
        GeoMarker.setMap(map);
        map.setCenter(initialLocation);
        map.setZoom(16);

        // $("#searchBar").geocomplete("find", lat_lng_str);
        Session.set("backFromBuildingList", false);
				Session.set("isCurrentLocationActive", true);
			}

      if (position && Session.get("isCurrentLocationActive") === false && !Session.get('backFromBuildingList')) {
        // console.dir(position);

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        var lat_lng_str = lat + ", " + lng;

        var initialLocation = new google.maps.LatLng(lat,lng);

        Session.set("Lat_value", lat);
        Session.set("Lng_value", lng);

        var map = $("#searchBar").geocomplete('map');

        var GeoMarker = new GeolocationMarker();
        // GeoMarker.setCircleOptions({fillColor: '#808080'});
        GeoMarker.setMap(map);
        map.setCenter(initialLocation);
        map.setZoom(16);

        // $("#searchBar").geocomplete("find", lat_lng_str);
        Session.set("isCurrentLocationActive", true);
      }

      //reactively add markers to the map

			// var currentTime = moment().hours();
			// var startTime = currentTime - 6;
			// var endTime = startTime + 1;
			// if(startTime < 0 || startTime == 16 || startTime == 17){
			// 	startTime = 16;
			// 	endTime = 24;
			// }
			//
			// if(Session.get('searchOvernightParking')){
			// 	endTime = 24;
			// 	if(Session.get('searchHourlyParking')){
			// 		startTime = parseInt(Session.get('searchStartTime'));
			// 	} else {
			// 		startTime = 16;
			// 	}
			// } else {
			// 	if(Session.get('searchHourlyParking')){
			// 		startTime = parseInt(Session.get('searchStartTime'));
			// 		endTime = parseInt(Session.get('searchEndTime'));
			// 	}
			// }
			// console.log(startTime)
			// console.log(endTime)

      // // var parkingSpaces = Template.instance().data.parkingSpaces.fetch();
      // var calenderSelected = Session.get('calenderDropdownSelected');
      // var oldSelectedDate = calenderSelected.date;
      // // var selectedDate = calenderSelected.date.split(/[-]/);
      // // selectedDate = moment(new Date(selectedDate[0], selectedDate[1]-1, selectedDate[2]));
      // // var selecedTimeSlot = calenderSelected.timeslot;
      // // var selecedTimeSlotStrArray = _.map(selecedTimeSlot, function(num){
      // //   return num.toString();
      // // })
			//
			// console.log('oldSelectedDate')
			// console.log(oldSelectedDate);
      // // var allTimeslots = Template.instance().data.timeslots.fetch();
			//
			// var allTimeslotsArray = [];
			//
			// for(var i = startTime; i < endTime; i++){
			// 	var spaceIdArray = []
			// 	var allTimeslots = Timeslots.find({
			// 		timeslotDate: oldSelectedDate,
			// 		timeslotType: i,
			// 		isBooked: false,
			// 		dayOff: false
	    //   }).fetch();
			// 	spaceIdArray = _.map(allTimeslots, 'spaceId');
			// 	allTimeslotsArray.push(spaceIdArray)
			// }
			//
			// console.log(allTimeslotsArray)
			//
			//
			// var allTimeslots = _.intersection.apply(_, allTimeslotsArray);

			// var allTimeslots = [];
		}
	})


	this.autorun(function () {
    console.log('add marker');
    if (GoogleMaps.loaded()) {
			var calenderSelected = Session.get('calenderDropdownSelected');
			var oldSelectedDate = calenderSelected.date;
			var selectedTimeslot = parseInt(calenderSelected.timeslot);
			var allTimeslotsArray = [];

			var sortedTimeslots = Timeslots.find({
				timeslotDate: oldSelectedDate,
				isBooked: false,
				isOccupied: false,
				dayOff: false
      }).fetch();

			// console.log(sortedTimeslots)
			// console.log(selectedTimeslot)

			if(selectedTimeslot === 3){
				var timeslotArray = calenderSelected.timeslotArray;
				// console.log(timeslotArray)
				var allTimeslotsArray = [];
				lodash.forEach(timeslotArray, function(timeslotIndex){
					var spaceIdArray = []
					// console.log(oldSelectedDate)
					// console.log(timeslotIndex)
					// var allTimeslotsObj = Timeslots.find({
					// 	timeslotDate: oldSelectedDate,
					// 	timeslotType: timeslotIndex,
					// 	isBooked: false,
					// 	isOccupied: false,
					// 	dayOff: false
		      // }).fetch();
					var allTimeslotsObj = lodash.filter(sortedTimeslots, {'timeslotType': selectedTimeslot})
					// console.log(allTimeslotsObj)
					spaceIdArray = _.map(allTimeslotsObj, 'spaceId');
					allTimeslotsArray.push(spaceIdArray)

				})
				var allTimeslots = _.intersection.apply(_, allTimeslotsArray);

			} else {
				// var allTimeslots = Timeslots.find({
				// 	'timeslotDate': oldSelectedDate,
				// 	'timeslotType': selectedTimeslot,
				// 	'isBooked': false,
				// 	'isOccupied': false,
				// 	'dayOff': false
				// }).fetch()
				// console.log(sortedTimeslots)
				// console.log(selectedTimeslot)
				var allTimeslotsObj = lodash.filter(sortedTimeslots, {'timeslotType': selectedTimeslot})
				// console.log(allTimeslotsObj)
				allTimeslots = _.map(allTimeslotsObj, 'spaceId');
			}
			// console.log(allTimeslots)
			//
			// var allTimeslots = Session.get('allTimeslots');
			//
      // console.log('allTimeslots');
      // console.dir(allTimeslots);

      var join_results = _.map(allTimeslots, function(spaceId) {
				// var timeslotType = timeslotObj.timeslotType;
				var calenderSelected = Session.get('calenderDropdownSelected');
				var timeslotType = parseInt(calenderSelected.timeslot);
				var timeslotArray = calenderSelected.timeslotArray;

        var parkingSpace = getParkSpaceObjFromSpaceId(spaceId);
        // var lat = parkingSpace.lat;
        // var lng = parkingSpace.lng;
        // var hasEVCharger = parkingSpace.hasEVCharger;
        // var hasDisableParking = parkingSpace.hasDisableParking;
        // var hasOversizeParking = parkingSpace.hasOversizeParking;

				var isFree = false;

				if(parkingSpace.access){
					if(parkingSpace.access.freeGroup){
						var ownerProfile = Profile.findOne({userId: parkingSpace.ownerId});
						var userProfile = Profile.findOne({userId: Meteor.userId()});
						if(ownerProfile && userProfile){
							if(ownerProfile.freeGroup){
								if(_.indexOf(ownerProfile.freeGroup, userProfile.email) > -1){
									console.log('free')
									isFree = true;
								}
							}
						}
					}
				}

				var price = 0;
				var averagePrice = 0;
				if(!isFree){
					// if(parkingSpace.rates[2].available){
					// 	price = (parseInt(endTime) - parseInt(startTime)) * parkingSpace.rates[2].value;
					// 	averagePrice = parkingSpace.rates[2].value;
					// } else {
					// 	if(endTime == 24){
					// 		price = 8 * parkingSpace.rates[1].value + (16 - parseInt(startTime)) * parkingSpace.rates[0].value;
					// 		averagePrice = Math.round(price / (24 - parseInt(startTime)));
					// 	} else {
					// 		price = (parseInt(endTime) - parseInt(startTime)) * parkingSpace.rates[0].value;
					// 		averagePrice = parkingSpace.rates[0].value;
					// 	}
					// }

					price = parkingSpace.rates[timeslotType].value;
					averagePrice = parkingSpace.rates[timeslotType].value;
				}
				console.log(price);

        return {  lat: parkingSpace.lat,
                  lng: parkingSpace.lng,
                  spaceId: spaceId,
                  timeslotPrice: price,
                  averagePrice: averagePrice,
                  hasEVCharger: parkingSpace.hasEVCharger,
                  hasDisableParking: parkingSpace.hasDisableParking,
                  hasOversizeParking: parkingSpace.hasOversizeParking,
									timeslotType: timeslotType,
									timeslotArray: timeslotArray
									// startTime: startTime,
									// endTime: endTime
                };
      });

      console.dir(join_results);

			console.log(Session.get('customOption'));
			var results = _.filter(join_results, function(obj){
				console.log(obj)
				if(Session.get('EVOption') && !obj.hasEVCharger){
					return false;
				}
				if(Session.get('disabledOption') && !obj.hasDisableParking){
					return false;
				}
				if(Session.get('customOption') && obj.timeslotPrice){
					return false;
				}
				return true
			})
      // var results = _.where(join_results, { hasEVCharger: Session.get('EVOption'),
      //                         hasDisableParking: Session.get('disabledOption'),
      //                         hasOversizeParking: Session.get('overSizedOption')
      //                       });

      console.dir(results);
      var infowindow = new google.maps.InfoWindow();
      var mapInstance = $("#searchBar").geocomplete('map');

      var markers = [];
      if (markerCluster) {
        markerCluster.clearMarkers();
      }
      var iconBase = '/images/pin_2x.png';

      results.forEach(function(space) {
        var marker = new MarkerWithLabel({
          position: new google.maps.LatLng(space.lat, space.lng),
          // label: '$' + space.lastPrice,
          icon: { url: iconBase,
                  scaledSize: new google.maps.Size(48, 48),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(24, 24)
                },
          id: space.spaceId,
          lastPrice: parseInt(space.averagePrice),
          labelContent: '$' + space.averagePrice,
          labelAnchor: new google.maps.Point(16, 22),
          labelClass: "labels", // the CSS class for the label
          labelStyle: {opacity: 1.0}
        });
        attachMarkerListener(marker);
        markers.push(marker);

      });

      function getParkSpaceObjFromSpaceId(spaceId) {
        return ParkingSpaces.findOne({_id: spaceId});
      }

      function attachMarkerListener(marker) {
        // console.dir(marker);
        // var infowindow = new google.maps.InfoWindow({
        //   content: 'lat: ' + marker.position.lat() + ' , lng: ' + marker.position.lng()
        // });

        marker.addListener('click', function(){
					console.log(marker)
          // infowindow.open(marker.get('map'), marker);
					Session.set("detailPreviousPath", 'main');
					var spaceId = marker.id;
			    Session.set("bookingSpaceId", spaceId)
					Session.set("bookingDate", oldSelectedDate)
					Session.set("bookingTimeslotType", selectedTimeslot)
					Session.set("bookingTimeslotArray", timeslotArray)
					// Session.set("bookingStartTime", startTime)
					// Session.set("bookingEndTime", endTime)
          Router.go('bookingDetails');
        });
      }

      function lowestPrc(markers) {
        // var currentLowest = 10000;
        var lowest = _.minBy(markers, function(o){return o.lastPrice;}).lastPrice;
        // console.dir(lowest);
        var index = 0;

        return {
          text: '$' + lowest,
          index: index
        }
      };

      markerCluster = new MarkerClusterer(mapInstance, markers, { 'calculator': lowestPrc,
                                                                      'zoomOnClick': false,
                                                                      'averageCenter': true,
                                                                      styles: [{  height: 60,
                                                                                  width: 60,
                                                                                  url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
                                                                                  fontFamily: 'BebasNeue-Bold',
                                                                                  textSize: 14,
                                                                                  backgroundPosition: "4 3" }]
                                                                     });
      // marker.setMap($("#searchBar").geocomplete('map'));
      google.maps.event.addListener(markerCluster, "click", function (cluster) {
        console.dir(cluster);
        var markers = cluster.getMarkers();
        // console.dir(markers);
        var pluckedMarkers = _.map(markers, 'id');
        console.dir(pluckedMarkers);
        Session.set('clusterMarkersStore', pluckedMarkers);
				Session.set("bookingDate", oldSelectedDate)
				Session.set("bookingTimeslotType", selectedTimeslot)
				Session.set("bookingTimeslotArray", timeslotArray)
				// Session.set("bookingStartTime", startTime)
				// Session.set("bookingEndTime", endTime)
        Router.go('buildingList');
      });
    }
  });

	Meteor.subscribe('UserSearchSpaces', function(){
		console.log("autorun set marker")
		//set marker session
		var calenderSelected = Session.get('calenderDropdownSelected');
		// var currentTime = moment().hours();
		// var startTime = currentTime - 6;
		// var endTime = startTime + 1;
		// if(startTime < 0 || startTime == 16 || startTime == 17){
		// 	startTime = 16;
		// 	endTime = 24;
		// }
		// if(Session.get('searchOvernightParking')){
		// 	endTime = 24;
		// 	if(Session.get('searchHourlyParking')){
		// 		startTime = parseInt(Session.get('searchStartTime'));
		// 	} else {
		// 		startTime = 16;
		// 	}
		// } else {
		// 	if(Session.get('searchHourlyParking')){
		// 		startTime = parseInt(Session.get('searchStartTime'));
		// 		endTime = parseInt(Session.get('searchEndTime'));
		// 	}
		// }
		// console.log(startTime)
		// console.log(endTime)


		var oldSelectedDate = calenderSelected.date;
		var selectedTimeslot = parseInt(calenderSelected.timeslot);
		var allTimeslotsArray = [];

		var sortedTimeslots = Timeslots.find({
			timeslotDate: oldSelectedDate,
			isBooked: false,
			isOccupied: false,
			dayOff: false
		}).fetch();

		if(selectedTimeslot === 3){
			var timeslotArray = calenderSelected.timeslotArray;
			console.log(timeslotArray)
			var allTimeslotsArray = [];
			lodash.forEach(timeslotArray, function(timeslotIndex){
				var spaceIdArray = []
				// var allTimeslots = Timeslots.find({
				// 	timeslotDate: oldSelectedDate,
				// 	timeslotType: timeslotIndex,
				// 	isBooked: false,
				// 	isOccupied: false,
				// 	dayOff: false
				// }).fetch();
				var allTimeslotsObj = lodash.filter(sortedTimeslots, {'timeslotType': selectedTimeslot})
				spaceIdArray = _.map(allTimeslotsObj, 'spaceId');
				allTimeslotsArray.push(spaceIdArray)

			})
			var allTimeslots = _.intersection.apply(_, allTimeslotsArray);

		} else {
			// var allTimeslots = Timeslots.find({
			// 	'timeslotDate': oldSelectedDate,
			// 	'timeslotType': selectedTimeslot,
			// 	'isBooked': false,
			// 	'isOccupied': false,
			// 	'dayOff': false
			// }).fetch()
			var allTimeslotsObj = lodash.filter(sortedTimeslots, {'timeslotType': selectedTimeslot})
			allTimeslots = _.map(allTimeslotsObj, 'spaceId');
		}
		console.log(allTimeslots)
		//
		// for(var i = startTime; i < endTime; i++){
		// 	var spaceIdArray = []
		// 	var allTimeslotsTime = lodash.filter(allTimeslots, {'timeslotType': i});
		// 	spaceIdArray = _.map(allTimeslotsTime, 'spaceId');
		// 	allTimeslotsArray.push(spaceIdArray)
		// }
		//
		// console.log(allTimeslotsArray)
		//
		//
		// allTimeslotsArray = _.intersection.apply(_, allTimeslotsArray);

		Session.set('allTimeslots', allTimeslots)
	})
});
