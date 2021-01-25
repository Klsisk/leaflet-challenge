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
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "white",
      radius: markerSize(feature.properties.mag)
      };
    };

    // Function that will determine the color of magnitude based on magnitude number
    function chooseColor(mag) {
      switch (true) {
        case mag > 90:
          return "red";
        case mag > 70:
          return "orangered";
        case mag > 50:
          return "orange";
        case mag > 30:
          return "yellow";
        case mag > 10:
          return "chartreuse";
        default:
          return "lime";
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
      // We turn each feature into a circleMarker on the map.
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // We set the style for each circleMarker using our styleInfo function.
      style: mapStyle,
      // Called on each feature
      onEachFeature: function(feature, layer) {
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup("<h2> Magnitude: " + feature.properties.mag + "</h2> <hr> <h3>Location: " + feature.properties.place + 
        "</h3> <h3>Depth: " + feature.geometry.coordinates[2] + "</h3>");
      }
    }).addTo(myMap);
  
    // Set up the legend
    var legend = L.control({ 
      position: "bottomright" });
      
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors= ["lime", "chartreuse", "yellow", "orange", "orangered", "red"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
          '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

      return div;
    };

    legend.addTo(myMap); 
  
  })
