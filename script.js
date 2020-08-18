var map;
// Initialize and add the map
function initMap() {
    // The location of Akesan, Lagos
    var akesan = {lat: 6.5371666, lng: 3.2049996};
    // The map, centered at Akesan
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 2, center: akesan, mapTypeId: 'terrain'});
    // The marker, positioned at Akesan
    map.data.setStyle(function(feature) {
        var magnitude = feature.getProperty('mag');
        return {
          icon: getCircle(magnitude)
        };
      });
      getEarthquakeData(-90, 90, -180, 180);
}

//
const getEarthquakeData = async (minlatitude, maxlatitude, minlongitude, maxlongitude, minmagnitude, maxmagnitude) => {    let url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
    if(minlatitude !== undefined) {
        url = url + '&minlatitude=' + minlatitude;
    }
    if(maxlatitude !== undefined) {
        url = url + '&maxlatitude=' + maxlatitude;
    }
    if(minlongitude !== undefined) {
        url = url + '&minlongitude=' + minlongitude;
    }
    if(maxlongitude !== undefined) {
        url= url + '&maxlongitude=' + maxlongitude;
    }
    if(minmagnitude !== undefined) {
        url = url + '&minlatitude=' + minmagnitude;
    }
    if(maxmagnitude !== undefined) {
        url = url + '&maxmagnitude=' + maxmagnitude;
    }
    const endpoint = url;
    try {
        const response = await fetch(endpoint);
        if(response.ok) {
            let jsonResponse = await response.json();
            map.data.addGeoJson(jsonResponse); 
        }
    } catch(error) {
        console.log(error);
    }
}


// Loop through the results array and place a marker for each
// set of coordinates.
function getCircle(magnitude) {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'red',
      fillOpacity: .2,
      scale: Math.pow(2, magnitude) / 2,
      strokeColor: 'white',
      strokeWeight: .5
    };
  }

//   function eqfeed_callback(results) {
//     map.data.addGeoJson(results);
//   }