const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const wifi = require('node-wifi');
const axios = require('axios');

let wifisNearby = [];
let formatedWifis = [];
wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null
});

// Scan networks
wifi.scan(function(err, networks) {
    if (err) {
        console.log(err);
    } else {
        wifisNearby = networks;
        for(var i = 0; i<wifisNearby.length-1; i++){
          formatedWifis.push({
            mac:[
             {macAddress:wifisNearby[i].mac},
             {macAddress:wifisNearby[i+1].mac}],
            ssid: wifisNearby[i].ssid,
            frequency: wifisNearby[i].frequency,
            signal_level:wifisNearby[i].signal_level
          });
        }
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.get('/geolocation',(req, res)=> {
  var fn = function getGeo(obj) {
    return new Promise((resolve, reject) => {
      axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDaWHUor2AZNZYVvbu1qaaEdCxFTi6Nv_Q',{
        considerIp: "false",
        wifiAccessPoints: obj.mac
      })
      .then((resp)=>resolve(resp))
      .catch(err => {
        console.log(err);
        resolve(err);
      })
    })
  }

  const locationsArr = formatedWifis.map(fn);
  Promise.all(locationsArr)
  .then(resp => {
    let geowifiArr = [];
    for(var i = 0; i<resp.length;i++){
      if(resp[i].data){
        const geowifi = Object.assign(
          {},
          resp[i].data,
          {ssid:formatedWifis[i].ssid},
          {frequency: wifisNearby[i].frequency},
          {signal_level:wifisNearby[i].signal_level}
        )
        console.log(geowifi);
        geowifiArr.push(geowifi);
      }
    }
    res.send(geowifiArr)
  })
});


app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
