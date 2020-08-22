//Selectors
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

//
var map;
var infowindow;
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
            const image = "images/marker.png"
            
            for (var i = 0; i < jsonResponse.features.length; i++) {
                console.log("Called");
                const coords = jsonResponse.features[i].geometry.coordinates;
                const latLng = new google.maps.LatLng(coords[1],coords[0]);
                
                const marker = new google.maps.Marker({
                  position: latLng,
                  map: map,
                  icon: image,
                });
                marker.addListener('click', function() {
                    infowindow.close();
                    infowindow.setContent(`<div id="infowindow">${latLng}</div>`);
                    infowindow.open(map, marker);
                    showEarthquakeDetails("Revuews by dami", "22 August, 2020", "Akesan", "Lagos", 6, 5, 8)
                  });
              }
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
                const minlongitude = boundingbox[1];
                const maxlatitude = boundingbox[2];
                const maxlongitude = boundingbox[3];
                getEarthquakeData(minlatitude <= maxlatitude ? minlatitude : maxlatitude, 
                    maxlatitude >= minlatitude ? maxlatitude : minlatitude, 
                    minlongitude <= maxlongitude ? minlongitude : maxlongitude,
                    maxlongitude >= minlongitude ? maxlongitude : minlongitude
                    );
                    filterFour.addEventListener("click", () => {
                        getEarthquakeData(minlatitude <= maxlatitude ? minlatitude : maxlatitude, 
                            maxlatitude >= minlatitude ? maxlatitude : minlatitude, 
                            minlongitude <= maxlongitude ? minlongitude : maxlongitude,
                            maxlongitude >= minlongitude ? maxlongitude : minlongitude, 4
                            );
                    });
                    filterSix.addEventListener("click", () => {
                        getEarthquakeData(minlatitude <= maxlatitude ? minlatitude : maxlatitude, 
                            maxlatitude >= minlatitude ? maxlatitude : minlatitude, 
                            minlongitude <= maxlongitude ? minlongitude : maxlongitude,
                            maxlongitude >= minlongitude ? maxlongitude : minlongitude, 6
                            );
                    });
                    filterEight.addEventListener("click", () => {
                        getEarthquakeData(minlatitude <= maxlatitude ? minlatitude : maxlatitude, 
                            maxlatitude >= minlatitude ? maxlatitude : minlatitude, 
                            minlongitude <= maxlongitude ? minlongitude : maxlongitude,
                            maxlongitude >= minlongitude ? maxlongitude : minlongitude, 8
                            );
                    });
                    filterTen.addEventListener("click", () => {
                        getEarthquakeData(minlatitude <= maxlatitude ? minlatitude : maxlatitude, 
                            maxlatitude >= minlatitude ? maxlatitude : minlatitude, 
                            minlongitude <= maxlongitude ? minlongitude : maxlongitude,
                            maxlongitude >= minlongitude ? maxlongitude : minlongitude, undefined, 10
                            );
                    });
            }
        }
    } catch(error) {
        console.log(error);
    }
};


searchButton.addEventListener("click", () => {
   let  location = searchEarthquakeInput.value;
   performSearch(location);
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
    filterContainer.classList.add("show");
    filterContainer.classList.remove("hide");
}

const hideLoader = () => {
    filterContainer.classList.add("hide");
    filterContainer.classList.remove("show");
}

closeInfoDetails.addEventListener("click", hideEarthquakeDetails);
mapFilter.addEventListener("click", showFilter);
closeFilter.addEventListener("click", hideFilter);
