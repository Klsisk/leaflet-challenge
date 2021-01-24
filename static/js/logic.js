// Create the tile layer that will be the background of our map
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 12,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      tileSize: 512,
      maxZoom: 12,
      zoomOffset: -1,
      id: "dark-v10",
      accessToken: API_KEY
    });

var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Creating map object
var myMap = L.map("mapid", {
  center: [40.7, -94.5],
  zoom: 3,
  layers: [streetmap]
});

L.control.layers(baseMaps, {
}).addTo(myMap);

// Earthquake url
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Grab GeoJSON data with d3
d3.json(queryUrl, function(data) {
  
  // Function for styling the map
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.75,
      fillColor: chooseColor(feature.property.mag),
      color: "white",
      radius: markerSize(feature.property.mag)
      };
    };

    // Function that will determine the color of magnitude based on magnitude number
    function chooseColor(mag) {
      switch (true) {
        case mag > 5:
          return "#ff0000";
        case mag > 4:
          return "#ff4000";
        case mag > 3:
          return "#ff8000";
        case mag > 2:
          return "#ffbf00";
        case mag > 1:
          return "#ffff00";
        default:
          return "#bfff00";
      }
    }

    // Function for size of marker
    function markerSize(mag) {
      if (mag === 0) {
        return 1;
      }
      return mag * 4;
    }

    L.geoJson(data, {

    // Called on each feature
    onEachFeature: function(feature, layer) {
      
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1> Magnitude: " + feature.properties.mag + "</h1> + <hr> <h2> Location: " + feature.properties.mag + "</h2>");

    }
  }).addTo(myMap);
  
  // Set up the legend
  var legend = L.control({ 
    position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var magnitudeLevels = [0, 1, 2, 3, 4, 5];
    var colors= ["#bfff00", "#ffff00", "#ffbf00", "#ff8000", "#ff4000", "#ff0000"];
  
  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(myMap);
});