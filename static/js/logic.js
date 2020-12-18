// This Query URL will provide access to the GeoJason Data relating to Earthquakes occurring for the past week
var QueryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// A group to append the various layers to be added to the visualisation
var earthquakesLayerGroup = L.layerGroup();

// A black and white map has been added for this visualisation
var GreyScaledMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// This code created the baseline map using the previous tile layer and zooms it at the specified coordinates.
var myMap = L.map("mapid", {
  center: [35.66745393725224, -2.941356660851625],
  zoom: 2,
  layers: [GreyScaledMap, earthquakesLayerGroup]
});

// Reading into the accessed json url
d3.json(QueryURL, function(data) {
  console.log(data);
  // Determine the marker size by magnitude
  function EarthQuakeMarkerSize(magnitude) {
    return magnitude * 4;
  };
  // These color scales have been developed to indicate the intensity of the earthquakes that have occrred within a given region.
  function magnitudeColorIntensity(richter) {
    if (richter > 90){
      return '#005933'
    }

    else if (richter > 70){
      return '#008f52'
    }

    else if (richter > 50){
      return '#00db7e'
    }

    else if (richter > 30){
      return '#17ff9c'
    }

    else if (richter > 10){
      return '#61ffbc'
    }

    else {
      return '#d9ffef'
    }
  }

// This layer will provide a visual on where an earthquake has occrred and the intensity is indicated by the colour scale defined in the previous code
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        // Set the style of the markers based on properties.mag
        {
          radius: EarthQuakeMarkerSize(feature.properties.mag),
          fillColor: magnitudeColorIntensity(feature.geometry.coordinates[2]),
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
  }).addTo(earthquakesLayerGroup);
  // The feature layer will now be added to the declared group layer variable at the start of the document.
  earthquakesLayerGroup.addTo(myMap);

  // Figure legend that provides information on the color scale
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "detail legend"),
    intensity = [-10, 10, 30, 50, 70, 90];
    
    div.innerHTML += "<h3 style='text-align: center'>Magnitude</h3>"
  for (var i =0; i < intensity.length; i++) {
    div.innerHTML += 
    '<i style="background:' + magnitudeColorIntensity(intensity[i] + 1) + '"></i> ' +
        intensity[i] + (intensity[i + 1] ? '&ndash;' + intensity[i + 1] + '<br>' : '+');
      }
    return div;
  };
  legend.addTo(myMap);
});
