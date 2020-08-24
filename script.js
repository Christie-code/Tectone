//Select elements from the index.html file
const searchEarthquakeInput = document.getElementById('search-earthquake');
const searchButton = document.getElementById('search-button');
const infoContainer = document.getElementById('info-container');
const statusInfo = document.getElementById('status-info');
const dateinfo = document.getElementById('date-info');
const locationInfo = document.getElementById('location-info');
const regionInfo= document.getElementById('region-info');
const depthInfo = document.getElementById('depth-info');
const intensityInfo = document.getElementById('intensity-info');
const reportInfo= document.getElementById('report-info');
const closeInfoDetails = document.getElementById('close');
const closeFilter = document.getElementById('close-filter');
const mapFilter = document.getElementById('filter-button');
const filterContainer = document.getElementById('filter');
const filterFour = document.getElementById('filter4');
const filterSix = document.getElementById('filter6');
const filterEight = document.getElementById('filter8');
const filterTen = document.getElementById('filter10');
const filterHeatmap = document.getElementById('filterHM');
const loader = document.getElementById('loader');
const alert = document.getElementById('alert');
const alertMessage = document.getElementById('alert-message');

// declaring the map variables to use
var map;
var infowindow;
var markers = [];
// Initialize and add the map
function initMap() {
    // The location of Akesan, Lagos
    var akesan = {lat: 6.5371666, lng: 3.2049996};
    // The map, centered at Akesan
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 2, center: akesan, mapTypeId: 'terrain'});
    infowindow = new google.maps.InfoWindow();
    // The marker, positioned at Akesan
//       getEarthquakeData(-90, 90, -180, 180);
}


// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
  }


// get earthquake data from the api and display on the map
const getEarthquakeData = async (minlatitude, maxlatitude, minlongitude, maxlongitude, minmagnitude, maxmagnitude) => {    let url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
//constructing the endpoint to get earthquake data
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
        // fetching data from the api
        const response = await fetch(endpoint);
        if(response.ok) {
            //server returned a positive response
            let jsonResponse = await response.json();
            // custom image for the markers
            const image = "images/marker.png"
            // clear existing markers that was on the screen before displaying new ones
            clearMarkers()
            // check for earthquake data from a search
            if (jsonResponse.features.length == 0) {
                showError("Couldn't get earthquake data for this location, please try another location! 😥");
                return;
            }
            // loop through to get earthquake data to display
            for (var i = 0; i < jsonResponse.features.length; i++) {
                const responseObj = jsonResponse.features[i];
                const coords = responseObj.geometry.coordinates;
                const latLng = new google.maps.LatLng(coords[1],coords[0]);
                
                const marker = new google.maps.Marker({
                  position: latLng,
                  map: map,
                  icon: image,
                });
                markers.push(marker)
                marker.addListener('click', function() {
                    // to display an infowindow: there are 3 basic steps: to close, to set and then to open
                    infowindow.close();
                    infowindow.setContent(`<div id="infowindow">${latLng}</div>`);
                    infowindow.open(map, marker);

                    //convert time from millisecond to date readable format
                    var date = new Date(responseObj.properties.time);
                    //display the earthquake details
                    showEarthquakeDetails(responseObj.properties.status,
                        date.toString(), 
                        responseObj.properties.place, 
                        responseObj.properties.alert, 
                        responseObj.properties.mag, 
                        responseObj.properties.sig, 
                        responseObj.properties.gap)
                  });
              }
              hideLoader()
        } else {
            hideLoader()
            showError("Couldn't get earthquake data for this location, please try another location! 😥");
        }
    } catch(error) {
        console.log(error);
        showError(error);
        hideLoader()
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

// Perform Search
const performSearch = async (location) => {
    let searchEndpoint = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${location}&format=json&limit=1`;
    try {
        const response = await fetch(searchEndpoint);
        if(response.ok) {
            let jsonResponse = await response.json();
            for(let i=0; i < jsonResponse.length; i++) {
                const result = jsonResponse[i];
                const boundingbox = result.boundingbox;
                const minlatitude = boundingbox[0];
                const minlongitude = boundingbox[2];
                const maxlatitude = boundingbox[1];
                const maxlongitude = boundingbox[3];

                getEarthquakeData(minlatitude, maxlatitude, minlongitude, maxlongitude)
                filterFour.addEventListener("click", () => {
                    getEarthquakeData(minlatitude, maxlatitude, minlongitude, maxlongitude);
                });
                filterSix.addEventListener("click", () => {
                    getEarthquakeData(minlatitude, maxlatitude, minlongitude, maxlongitude);
                });
                filterEight.addEventListener("click", () => {
                    getEarthquakeData(minlatitude, maxlatitude, minlongitude, maxlongitude);
                });
                filterTen.addEventListener("click", () => {
                    getEarthquakeData(minlatitude, maxlatitude, minlongitude, maxlongitude);
                });
            }
        } else {
            hideLoader()
            showError("Couldn't get earthquake data for this location, please try another location! 😥");
        }
    } catch(error) {
        console.log(error);
        hideLoader()
        showError(error)
    }
};

searchEarthquakeInput.addEventListener("keyup", function(e) {
    if (e.code === 'Enter') {
        const location = searchEarthquakeInput.value;
        showLoader()
        performSearch(location)      
    }
  });
searchButton.addEventListener("click", () => {
   const location = searchEarthquakeInput.value;
   showLoader()
   performSearch(location)
});

const showEarthquakeDetails = (status, date, location, region, depth,  intensity, report) => {
    infoContainer.classList.add("show");
    infoContainer.classList.remove("hide");
    statusInfo.innerText = status;
    dateinfo.innerText = date;
    locationInfo.innerText = location;
    regionInfo.innerText = region;
    depthInfo.innerText = depth;
    intensityInfo.innerText = intensity;
    reportInfo.innerText = report;

}

const hideEarthquakeDetails = () => {
    infoContainer.classList.add("hide");
    infoContainer.classList.remove("show");
}

const showFilter = () => {
    filterContainer.classList.add("show");
    filterContainer.classList.remove("hide");
}

const hideFilter = () => {
    filterContainer.classList.add("hide");
    filterContainer.classList.remove("show");
}

const showLoader = () => {
    loader.classList.add("show");
    loader.classList.remove("hide");
}

const hideLoader = () => {
    loader.classList.add("hide");
    loader.classList.remove("show");
}

const showError = (message) => {
    alert.classList.add("show-error");
    alert.classList.remove("hide");
    alertMessage.innerText = message;
}

const hideError = (message) => {
    alert.classList.remove("show-error");
    alert.classList.add("hide");
    alertMessage.innerText = "";
}

closeInfoDetails.addEventListener("click", hideEarthquakeDetails);
mapFilter.addEventListener("click", showFilter);
closeFilter.addEventListener("click", hideFilter);
hideLoader();
hideError();

