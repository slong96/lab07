let url = 'https://api.wheretheiss.at/v1/satellites/25544'

let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')
let timeIssLocationFetch = document.querySelector('#time')

let update = 10000 // 10 seconds
let maxFailedAttempts = 3
let issMarker // variable declared
let icon = L.icon({
  iconUrl: 'issPicture.png',
  iconSize: [50, 50],
  iconAnchor: [25, 25]
})

// [0,0] is to see the whole world. 1 is zoom level
let map = L.map('iss-map').setView([0,0], 1)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

iss(maxFailedAttempts) // call function one time to start

function iss(attempts) {
  if (attempts <= 0) {
    alert('Failed after several attempts.')
    return
  }
  // res is response
  // call back function
  fetch(url).then( (res) => {
    // process response into JSON
    return res.json() 
  }).then( (issData) => {
    // TODO display data on web page
    console.log(issData) 
    let lat = issData.latitude
    let long = issData.longitude
    issLat.innerHTML = lat
    issLong.innerHTML = long

    // create marker if it doesn't exist
    // move marker if it does exist
    if (!issMarker) {
      // create marker
      issMarker = L.marker([lat, long], {icon: icon}).addTo(map)
    } else {
      issMarker.setLatLng([lat, long])
    }

    // time
    let now = Date()
    timeIssLocationFetch.innerHTML = `This data was fetched on ${now}`

  }).catch( (err) => {
    attempts--
    console.log('ERROR', err)
  }).finally( () => {
    // finally runs the fetch() whether it worked or failed.
    setTimeout(iss, update, attempts)
  })
}