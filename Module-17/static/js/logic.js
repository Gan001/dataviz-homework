//makes size of marker relative to magnitude
function markerSize(magnitude){
  return magnitude *4;
}

//makes color of marker relative to magnitude
function markerColor(magnitude){
  if(magnitude >= 5){
    return '#A30000';
  }else if(magnitude >= 4){
    return '#D61B1B';
  }else if(magnitude >= 3){
    return '#FFA54E';
  }else if (magnitude >=2){
    return '#FFD881';
  }else if (magnitude >= 1){
    return '#FFFF80';
  }else{
    return '#59FF33';
  }
}

//makes features and circles representing earthquakes
function createFeatures(data){
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // use pointToLayer to update add circles markers to map
  var earthquakes = L.geoJSON(data,{
    onEachFeature: onEachFeature,
    pointToLayer: function(features, latlng) { return L.circleMarker(latlng, {
          radius: markerSize(features.properties.mag),
          fillColor: markerColor(features.properties.mag),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });}
      });
  //send earthquake layers to create map 
  createMap(earthquakes);
}

//make legend for map
function makeLegend(map) {
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + markerColor(grades[i]) + '"></i> ' +
          grades[i] + (grades[i + 1] ?'&ndash;' + grades[i + 1] + '<br>' : '+');
    }   

    return div;
  };

legend.addTo(map);
}

//function to create map
function createMap(earthquakes) {
  // Adding tile layer to the map
  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  //create base map
  var baseMaps = {
    'Light Map': light,
    'Dark Map': dark,
    'Street Map': streets
  };
  
  //create overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
    
  };

  //create map
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [light,earthquakes] 
  });

  //create layer control and add to map
  L.control.layers(baseMaps,overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  //call make legend function to add legend to map
  makeLegend(myMap);
}

//earthquakes over past 7 days
var earthQuakeSevenDays = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//perform get request to query url
d3.json(earthQuakeSevenDays, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

