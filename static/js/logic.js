// Create the map object with initial settings
var map = L.map("map", {
    center: [37.7749, -122.4194], // Centered on San Francisco
    zoom: 5
  });
  
  // Add a base tile layer (Mapbox Streets)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(map);
  
  // Define a function to scale marker size based on earthquake magnitude
  function markerSize(magnitude) {
    return magnitude * 4; // Scale factor
  }
  
  // Define a function to assign marker colors based on earthquake depth
  function markerColor(depth) {
    if (depth > 90) return "#FF0000";
    else if (depth > 70) return "#FF4500";
    else if (depth > 50) return "#FF8C00";
    else if (depth > 30) return "#FFD700";
    else if (depth > 10) return "#ADFF2F";
    else return "#00FF00";
  }
  
  // Fetch the earthquake GeoJSON data from the USGS API
  var earthquakeDataUrl =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(earthquakeDataUrl).then(function (data) {
    // Create a GeoJSON layer
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag), // Marker size based on magnitude
          fillColor: markerColor(feature.geometry.coordinates[2]), // Color based on depth
          color: "#000", // Marker border color
          weight: 0.5, // Marker border thickness
          opacity: 1,
          fillOpacity: 0.8 // Marker fill opacity
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          `<h3>${feature.properties.place}</h3>
           <hr>
           <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
           <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>
           <p><strong>Time:</strong> ${new Date(feature.properties.time)}</p>`
        );
      }
    }).addTo(map);
  
    // Add a legend to the map
    var legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];
  
      // Loop through depth intervals and generate a label for each
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          markerColor(depths[i] + 1) +
          '"></i> ' +
          depths[i] +
          (depths[i + 1] ? "&ndash;" + depths[i + 1] + " km<br>" : "+ km");
      }
  
      return div;
    };
  
    legend.addTo(map);
  });
  
  // OPTIONAL PART: Add tectonic plate data (if doing Part 2)
  
  // Define the URL for tectonic plate data
  var tectonicPlatesUrl =
    "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  
  d3.json(tectonicPlatesUrl).then(function (plateData) {
    // Add the tectonic plates data as a layer
    L.geoJSON(plateData, {
      color: "#FF6347", // Line color for tectonic plates
      weight: 2 // Line weight
    }).addTo(map);
  });