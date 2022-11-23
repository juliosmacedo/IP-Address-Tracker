// const app = document.getElementById('root')
// const ipaddress = document.getElementById('ipaddress')
// const place = document.getElementById('location')
// const timezone = document.getElementById('timezone')
// const isp = document.getElementById('isp')

// let y = 6969;
// let x = 6969;



// var request = new XMLHttpRequest()
// const container = document.createElement('div')
// container.setAttribute('class', 'container')
// app.appendChild(container)
// var map = L.map('map').setView([x, y], 9);

// request.open('GET', 'https://geo.ipify.org/api/v2/country,city?apiKey=at_tzLhZoLJVVRP3NZH9XWb4Nspvwzxn', true)



// request.onload = async function () {
//     let data = JSON.parse(this.response)
//     // console.log(data)
//     if (request.status >= 200 && request.status < 400) {
//         y = data.location.lat;
//         x = data.location.lng;
//         ipaddress.textContent = data.ip;
//         place.textContent = data.location.city;
//         timezone.textContent = 'GMT' + data.location.timezone;
//         isp.textContent = data.isp;
//         map._lastCenter.lat = y;
//         map._lastCenter.lng = x;
//         console.log(map)
//       } else {
//         console.log('error')
//       }
      
//       await L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     }).addTo(map);
    
// }
// request.send()

let map
let marker
let popup

window.onload = function () {

    // to put user IP on map on initial page load
    axios.get("https://api.ipify.org?format=json")
        .then(response => getAddressByIP(response.data.ip))
        .catch(error => {

            getAddressByDomain('google.com')
            throw new Error(error.message)
        })



    function search(){
        const inputValue = document.querySelector('input').value

        const inputIncludesLetter = Array.from('abcdefghijklmnopqrstuvwxyz').some(caractere => inputValue.toLowerCase().includes(caractere))

                                //to check if its an IPV6
        inputIncludesLetter && !(inputValue.includes(':')) ? getAddressByDomain(inputValue) : getAddressByIP(inputValue)

        document.querySelector('input').value = ''
    }

    function putLocationOnMap(latitude, longitude, location = 'default') {

        //verification needed to update the map according to the new input information
        if (map) {

            map = map.off()
            map = map.remove();
        }

        //creates the map
        map = L.map('map').setView([latitude, longitude], 13);


        //add a tile layer to add to the map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)


        //creates the marker and places it at the given coordinates
        marker = L.marker([latitude, longitude]).addTo(map);

        marker.bindPopup(location).openPopup();
    }


    async function getAddressByIP(ip) {
        try {
            const requestURL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_tzLhZoLJVVRP3NZH9XWb4Nspvwzxn&ipAddress=' + ip
            const response = await axios.get(requestURL)

            setResponseInDom(response.data)
            putLocationOnMap(response.data.location.lat, response.data.location.lng, `${response.data.location.city}, ${response.data.location.region}`)

        } catch (error) {

            alert('Verify the IP address')
            throw new Error(error.message)
        }
    }


    async function getAddressByDomain(domain) {
        try {

            const requestURL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_tzLhZoLJVVRP3NZH9XWb4Nspvwzxn&domain=' + domain
            const response = await axios.get(requestURL)

            setResponseInDom(response.data)
            putLocationOnMap(response.data.location.lat, response.data.location.lng, `${response.data.location.city}, ${response.data.location.region}`)

        } catch (error) {

            alert('Check the domain name')
            throw new Error(error.message)
        }
    }


    function setResponseInDom(data) {
        document.getElementById("ipaddress").textContent = data.ip;
        document.getElementById("timezone").textContent = "UTC " + data.location.timezone;
        document.getElementById("isp").textContent = data.isp;
        document.getElementById("location").textContent = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
    }


    document.querySelector('input').addEventListener('keypress', evt =>{
        if(evt.key === 'Enter'){
            evt.preventDefault()
            search()
        }
    }) 
    document.getElementById('search-button').addEventListener('click', search)

}