mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: site.geometry.coordinates, // starting position [lng, lat]
  // center: site.geometry.coordinates, // starting position [lng, lat]
  zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    // .setLngLat([-117.7946942, 33.6839473])
    .setLngLat(site.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
          .setHTML(
              `<h6><strong>${site.title}</strong></h6><p><em>${site.location}</em></p>`
          )
  )
    .addTo(map)