console.log("working");

// Map Tiles
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Mapdata &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Mapdata &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Mapdata &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// Map element
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// baseMaps for layer options
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Terrain": outdoors
};

// overlays for layer options
let allEarthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();
let majorEarthquakes = new L.LayerGroup();

let overlays = {
  "Earthquakes": allEarthquakes,
  "Tectonic Plates": tectonicPlates,
  "Major Earthquakes": majorEarthquakes
};

// Add layer control button
L.control.layers(baseMaps, overlays).addTo(map);


// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

 // Functions for styling
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function getColor(magnitude) {
    if (magnitude > 5){
      return "#ea2c2c";
    }
    else if (magnitude > 4){
        return "#ea822c";
    }
    else if (magnitude > 3){
        return "#ee9c00";
    }
    else if (magnitude > 2){
        return "#eecc00";
    }
    else if (magnitude > 1){
        return "#d4ee00";
    }
    else{
        return "#98ee00";
    }
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // Have each feature be a circleMarker on the map
    pointToLayer: function(feature, latlng) {
        console.log(data);
        return L.circleMarker(latlng);
      },
    // Add the styling 
    style: styleInfo,
    // Create a popup for each circleMarker 
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`);
    }
  }).addTo(allEarthquakes);

  // Add the earthquake layer to map
  allEarthquakes.addTo(map);


  // Create a legend control object
  let legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

// Loop through to generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
      console.log(colors[i]);
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }

    return div;
  };

  // Add legend to the map
  legend.addTo(map);
});


// 3. Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson').then(function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Change the color function to use three colors for the major earthquakes 
  function getColor(magnitude) {
    if (magnitude > 6){
      return "#9a0000";
    }
    else if (magnitude > 5){
        return "#ea2c2c";
    }
    else{
        return "#ee9c00";
    }
  }

 function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }


  L.geoJson(data, {
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng);
      },

      style: styleInfo,

      onEachFeature: function(feature, layer) {
        layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`);
      }
  }).addTo(majorEarthquakes);

  majorEarthquakes.addTo(map);
});


// make a call to get Tectonic Plate geoJSON data.
d3.json('static/js/boundaries.json').then(function(data) {
  L.geoJson(data, {
    
    pointToLayer: function(feature, lineString){
      console.log(data);
      return L.ployline(lineString);
    },

    style:  {
        color: 'red',
        weight: 4
      }

  }).addTo(tectonicPlates)

  tectonicPlates.addTo(map);
});


