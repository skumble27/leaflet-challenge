// Creating a Query URL to read the Geojson Data
var sevenDayEarthQuakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Creating an inital Map Object that will zoom to the West Coast of the United States where a majority of the US earthquakes occur
var myMap = L.map("map", {
  center: [34.0, -118.2],
  zoom: 5
});

// A Background Map has been added in which to use as a template to view the location where the earthquakes have
var baseGreyMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Creating a layergroup to map out earthquake occurrings geographically
var earthquakeLayer = L.layerGroup();

// Reading the GeoJason Data
d3.json(sevenDayEarthQuakeURL, function(data){
  
  // Checking to see if the data loads
  console.log(data);

  // Creating a color function
  function magnitudeColor(richter){
    if (richter > 90){
      return "red";

    }

    else if (richter > 70){

      return "orangered";
    }

    else if (richter > 60){

      return "orange";
    }

    else if (richter > 50){

      return "gold";

    }

    else if (richter > 30){

      return "yellow";
    }

    else {
      return "green";
    }

  }

  // Create a GeoJSON layer containing the features array
  // Each feature a popup describing the place and time of the earthquake
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        // Set the style of the markers based on properties.mag
        {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
      + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);
  // Sending our earthquakes layer to the createMap function
  earthquakes.addTo(myMap);

    // Add legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
    
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  for (var i =0; i < depth.length; i++) {
    div.innerHTML += 
    '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
    return div;
  };
  legend.addTo(myMap);
})


