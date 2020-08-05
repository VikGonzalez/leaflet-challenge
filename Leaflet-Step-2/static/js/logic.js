let usgs_link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let fault_data = "static/data/boundaries.json"

function getColor(d) {
  return d > 5.0 ? '#950808' :
         d > 4.0  ? '#FF0000' :
         d > 3.0  ? '#C90EE7' :
         d > 2.0  ? '#F88F11' :
         d > 1.0  ? '#EAAF69' :
                     '#EFD8BE';
}

let satelliteView = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
})

let outdoorsView = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
})

let grayscaleView = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
})

let baseMaps = {
  "Satellite": satelliteView ,
  "Grayscale": grayscaleView,
  "Outdoors": outdoorsView
};

let layers = {
  earthquakes: new L.LayerGroup(),
  faults: new L.LayerGroup()
};

let mymap = L.map('mapid', {
  center: [5.8,-4.1],
  zoom: 2,
  layers:[
    satelliteView,
    layers.earthquakes,
    layers.faults
]}
);

let overlays = {
  "Earthquakes": layers.earthquakes,
  "Faults": layers.faults
};

L.control.layers(baseMaps,overlays,{
  condensed: false
}).addTo(mymap);

d3.json(usgs_link).then(data=>{
  data.features.forEach(element => {
      let lat = element.geometry.coordinates[1]
      let long = element.geometry.coordinates[0]
      let timetag = new Date(element.properties.time).toGMTString()

      let color = getColor(parseFloat(element.properties.mag));

      L.circle(
          [lat,long],
          {
            fillOpacity: 0.8,
            weight: 0.1,
            color : '#FAFAFA',
            fillColor : color,
            radius : Math.exp(element.properties.mag)*500
          }
        ).bindPopup(`<h3><a href=${element.properties.url} target=="_blank">${element.properties.place}</a></h3>
        <hr><p style="margin: 0;"><time>${timetag}</time></p><p style="font-weight: bold; margin: 0;">Magnitude: ${element.properties.mag}</p>`)
        .addTo(mymap);
  });
});

d3.json(fault_data).then(data=>{
  let onEachFeature = (feature, layer) => {layer}
  let fault = L.geoJson(data,{
      style: function(feature){
          return {
              color: '#C311F8', 
              weight: 1.5
          }
      },
  }).addTo(layers.faults)
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> '+
          grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] +'<br>': '+');
  }

  return div;
};

legend.addTo(mymap);

mymap.on('overlayremove', function (eventLayer) {
  console.log(eventLayer)
  if (eventLayer.name === 'Earthquakes') {
      mymap.removeControl(legend);
  };
});

mymap.on('overlayadd', function (eventLayer) {
  console.log(eventLayer)
  if (eventLayer.name === 'Earthquakes') {
      legend.addTo(mymap);
  };
});