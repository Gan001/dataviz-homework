// var myMap = L.map("map", {
//     center: [37.09, -95.71],
//     zoom: 5
//   });
  
  // Adding tile layer to the map
//   var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.light",
//     accessToken: API_KEY
//   });

//   var earthQuakeSevenDays = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  
//   //TEST BLOCK looking for coordinates of earthquakes
//   d3.json(earthQuakeSevenDays, data =>{
//     // data.features.forEach(d =>{
//     //   console.log(d.geometry.coordinates);
//     // });
//     var geojsonMarkerOptions = {
//     radius: 8,
//     fillColor: "#ff7800",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };
//     var earthquakes;
//     for (var i = 0; i <=1000;i++){
//       console.log(data.features[i].geometry.coordinates);
//       earthquakes = L.geoJSON(data.features,{
//         pointToLayer: function(features, latlng){return L.circleMarker(latlng, geojsonMarkerOptions)}
//       });
//     }
//     var baseMaps = {
//       'Light': light
//     };

//     var overlayMaps = {
//       Earthquakes: earthquakes
//     };

//     var myMap = L.map("map", {
//       center: [37.09, -95.71],
//       zoom: 5,
//       layers: [light,earthquakes]
//     });

//     L.control.layers(baseMaps,overlayMaps, {
//       collapsed: false
//     }).addTo(myMap);
//   });


//////////////////////////////////////////////////////////////////
//   L.geoJSON(someGeojsonFeature, {
//     pointToLayer: function (feature, latlng) {
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//     }
// }).addTo(map);
function markerSize(magnitude){
  return magnitude *4;
}

function markerColor(magnitude){
  if(magnitude >= 5){
    return '#AA0242';
  }else if(magnitude >= 4){
    return '#C70039';
  }else if(magnitude >= 3){
    return '#FF5733';
  }else if (magnitude >=2){
    return '#FFC300';
  }else if (magnitude >= 1){
    return '#DAF7A6';
  }else{
    return '#59FF33';
  }
}
function createFeatures(data){
  data.forEach(d =>{
    console.log(d.properties.mag);
  });
//var magnitude = data.properties.mag;
// var geojsonMarkerOptions = {
//   radius: 8,
//   fillColor: "#ff7800",
//   color: "#000",
//   weight: 1,
//   opacity: 1,
//   fillOpacity: 0.8
// };
// if(magnitude >= 4.5){
//   var geojsonMarkerOptions = {
//     radius: magnitude,
//     fillColor: "#ff7800",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };
// }


var earthquakes;
    // for (var i = 0; i <=10;i++){
    //   console.log(data[i].properties.mag);
      
    // }
    earthquakes = L.geoJSON(data,{
      pointToLayer: function(features, latlng){return L.circleMarker(latlng,  {
        radius: markerSize(features.properties.mag),
        fillColor: markerColor(features.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })}
    });

    createMap(earthquakes);

}
function makeLegend(map){
  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [1, 2, 3, 4, 5],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ?   '<br>' : '+');
}

return div;
};

legend.addTo(map);
}

function createMap(earthquakes){
  // Adding tile layer to the map
  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var baseMaps = {
    'Light': light
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [light,earthquakes]
  });

  L.control.layers(baseMaps,overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  makeLegend(myMap);
}

var earthQuakeSevenDays = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthQuakeSevenDays, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


