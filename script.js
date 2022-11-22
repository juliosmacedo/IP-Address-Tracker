const app = document.getElementById('root')
const ipaddress = document.getElementById('ipaddress')
const place = document.getElementById('location')
const timezone = document.getElementById('timezone')
const isp = document.getElementById('isp')

let y = 0;
let x = 0;



var request = new XMLHttpRequest()
const container = document.createElement('div')
container.setAttribute('class', 'container')
app.appendChild(container)
var map = L.map('map').setView([x, y], 11);

request.open('GET', 'https://geo.ipify.org/api/v2/country,city?apiKey=at_tzLhZoLJVVRP3NZH9XWb4Nspvwzxn', true)



request.onload = async function () {
    let data = JSON.parse(this.response)
    // console.log(data)
    if (request.status >= 200 && request.status < 400) {
        y = data.location.lat;
        x = data.location.lng;
        ipaddress.textContent = data.ip;
        place.textContent = data.location.city;
        timezone.textContent = 'GMT' + data.location.timezone;
        isp.textContent = data.isp;
        map._lastCenter.lat = y;
        map._lastCenter.lng = x;
        console.log(map)
      } else {
        console.log('error')
      }

      await L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
}
request.send()






