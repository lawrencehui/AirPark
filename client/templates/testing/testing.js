Template.testing.onRendered(function () {

  this.autorun(() => {
    // Wait for API to be loaded
    if (GoogleMaps.loaded()) {

      // Example 1 - Autocomplete only
      $('#place1').geocomplete();

      // Example 2 - Autocomplete + map
      $('#searchBar').geocomplete({
        map: $("#map")
      });

      // Example 3 - Autocomplete + map + form
      $('#place3').geocomplete({
        map: "#map2",
        details: "form"
      });

    }
  });

});
