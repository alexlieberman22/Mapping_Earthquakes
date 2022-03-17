console.log("working");

let map = L.map('mapid').setView([40.7, -94.5], 4);

let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Mapdata &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});
streets.addTo(map);

let cityData = cities;

cityData.forEach(function(city) {
    console.log(city)
    L.circleMarker(city.location, {radius: city.population/ 100000})
    .bindPopup(`<h2>${city.city}, ${city.state}</h2> <hr> <h3>Population ${city.population}</h3>`)
    .addTo(map)
});