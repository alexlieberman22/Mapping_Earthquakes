
let light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Mapdata &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Mapdata &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let baseMaps = {
    Light: light,
    Dark: dark
};

let map = L.map('mapid', {
    center: [30, 30],
    zoom: 2,
    layers: [light]
});

L.control.layers(baseMaps).addTo(map);


let torontoData = "https://raw.githubusercontent.com/alexlieberman22/Mapping_Earthquakes/main/torontoRoutes.json";

d3.json(torontoData).then(function(data) {
    console.log(data);

    L.geoJSON(data, {
        color: "#ffffa1",
        weight: 2,
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3> Airline: ${feature.properties.airline}</h3> <hr> <h3> Destination: ${feature.properties.dst}</h3>`);
        }  
    }).addTo(map);
});