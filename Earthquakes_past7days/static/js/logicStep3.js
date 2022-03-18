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

// baseMaps for layer options
let baseMaps = {
    Street: streets,
    Satellite: satelliteStreets,
};

// Map element
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

// Add layer control button
L.control.layers(baseMaps).addTo(map);


// url for Earthquake JSON data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Functions for styling
function styleInfo(feature){
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    }
};

function getColor(magnitude){
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

function getRadius(magnitude){
    if (magnitude === 0){
        return 1;
    }
    return magnitude*4;
}

// Read and map data layer
d3.json(url).then(function(data) {
    console.log(data);

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng){return L.circleMarker(latlng);},
        style: styleInfo,
        onEachFeature: function(feature, layer){
            layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`);
        }
    }).addTo(map);

});