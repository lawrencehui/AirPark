Template.pickLocationView.helpers({
  isCurrentLocationActive: function() {
    return Session.get("isCurrentLocationActive")? "location-icon-active" : ""
  }
});

Template.pickLocationView.events({
  'click #currentLocationBtn': function(event) {
    console.log('currentLocationBtn clicked');

    var position = Geolocation.currentLocation();

    // navigator.geolocation.getCurrentPosition(onSuccess,onError);
    if (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      var initialLocation = new google.maps.LatLng(lat,lng);

      var lat_lng_str = lat + ", " + lng;
      // console.log(lat_lng_str);

      // $("#searchBar").geocomplete("find", lat_lng_str);
      var map = $("#searchBar").geocomplete('map');
      var GeoMarker = new GeolocationMarker(map);

      map.setCenter(initialLocation);
      map.setZoom(18);

      Session.set("isCurrentLocationActive", true);
    }
  },
  'blur #searchBar': function(event) {
    console.log('blur event callled');
    Session.set("locationText", $('#searchBar').val() );
  },
  'click button[type="reset"]': function(event) {
    $('#searchBar').focus();
    console.log('reset form called');
  }
});


Template.pickLocationView.onCreated(function() {
  GoogleMaps.ready('searchLocationMap', function(map) {
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
  Session.set("isCurrentLocationActive", false);

  // if(Router.current().params.query.edit){
  //   var spaceId = Router.current().params.query.spaceId
  //   Meteor.subscribe('ParkingSpacesByID', spaceId, {
  //     onError: function(error){
  //       console.log(error)
  //     },
  //     onReady: function(){
  //       var currentSpace = ParkingSpaces.findOne({_id: spaceId});
  //       Session.set('locationText', currentSpace.locationText);
  //       Session.set('Lat_value', currentSpace.lat);
  //       Session.set('Lng_value', currentSpace.lng);
  //       $('#searchBar').val(currentSpace.locationText);
  //     }
  //   })
  // }
});

Template.pickLocationView.onRendered(function() {
  // deferFocus($('#searchBar'));

  $(document).on({'DOMNodeInserted': function() {
                    $('.pac-item, .pac-item span', this).addClass('needsclick');
                    }
                  }, '.pac-container');

  this.autorun(function () {

    console.log('Lat session in autorun: ' + Session.get("Lat_value"));
    console.log('Lng session in autorun: ' + Session.get("Lng_value"));

    if (GoogleMaps.loaded()) {

      $("#searchBar").geocomplete({
          map: $("#map1"),
          // location: new google.maps.LatLng(22.3094695, 114.2230657),
          markerOptions: {
            draggable: true
          },
          mapOptions: {
            zoom: 16,
            streetViewControl: false,
            mapTypeControl: false
          }
        })
        .bind("geocode:result", function(event, result){
          console.log("clicked geocode:result");
          $('div.content.overflow-scroll.has-header').css("bottom",0);
          // console.log(result);
          $("#searchBar").geocomplete("map").setZoom(18);
          Session.set("Lat_value", result.geometry.location.lat());
          Session.set("Lng_value", result.geometry.location.lng());
          Session.set('locationText', $('#searchBar').val());
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

      if (position && Session.get("isCurrentLocationActive") === false ) {
        // console.dir(position);

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        var lat_lng_str = lat + ", " + lng;
        // console.log(lat_lng_str);
        Session.set("Lat_value", lat);
        Session.set("Lng_value", lng);

        $("#searchBar").geocomplete("find", lat_lng_str);
        Session.set("isCurrentLocationActive", true);
      }
      console.log('geo complete is loaded');
    }
  });
});
