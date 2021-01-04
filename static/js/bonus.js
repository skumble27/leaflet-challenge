// Obtaining the data for earthquake incidents and the techtonic plates data
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let techntonicplates = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

// Creating the layer groups
let earthquakeLayer = L.layerGroup();
let techntonicplatesLayer = L.layerGroup();

// Creating the map tile layers 
let satellitTile = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

let greyscaleTile = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

let politicalmapTile = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

let invertedColourTile = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

// Create a letiable in which to hold all the tile layers together
let baseTiles = {
    "Satterlite Tile": satellitTile,
    "Greyscale Tile":greyscaleTile,
    "Political Borders":politicalmapTile,
    "Dark Map":invertedColourTile
};

// Creating a grouped overlay of the earthquake and tectonic plates
let mapOverlay = {
    'Earthquakes':earthquakeLayer,
    'Tectonic Plates':techntonicplatesLayer
};


// Creating the base map that will display the sattelite tile and the earthquake layers
var myMap2 = L.map("bonusmapid",{
    center:[35.66745393725224, -2.941356660851625],
    zoom:2,
    layers:[satellitTile,earthquakeLayer]
});

// Creating a control tool to toggle between the different layers
L.control.layers(baseTiles, mapOverlay,{
    collapsed:true
}).addTo(myMap2);


// Reading the Earthquake Data
d3.json(earthquakeData, function(data){
    console.log(data);

    // Using the earthquake magnitude to measure size of cricles
    function magnitudeMarkerSize(richter){
        return richter *4
    };

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
    // The popup feature will provide the country and time in which the earthquake had occurred. 
    L.geoJson(data, {
        pointToLayer: function(features, latlong){
            return L.circleMarker(latlong,
                {
                    radius: magnitudeMarkerSize(features.properties.mag),
                    fillColor: magnitudeColorIntensity(features.geometry.coordinates[2]),
                    fillOpacity: 0.7,
                    color:'black',
                    stroke:true,
                    weight: 0.5

                })
        },
        onEachFeature: function(features, layer) {
            layer.bindPopup("<h3>Location: " + features.properties.place + "</h3><hr><p>Date: "
            + new Date(features.properties.time) + "</p><hr><p>Magnitude: " + features.properties.mag + "</p>");
          }

    }).addTo(earthquakeLayer);
    earthquakeLayer.addTo(myMap2);

// Adding the data relating to techtonic plates
    d3.json(techntonicplates, function(platedata){
        console.log(platedata);
        L.geoJSON(platedata, {
            color:'#eb34b4',
            weight: 3,
        
        }).addTo(techntonicplatesLayer);
        techntonicplatesLayer.addTo(myMap2);
    });

// Adding a figure legel to the map
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
  legend.addTo(myMap2);


})







