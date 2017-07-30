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
        console.log(wifisNearby);
        for(var i = 0; i<wifisNearby.length-1; i++){
          formatedWifis.push([wifisNearby[i].mac,wifisNearby[i+1].mac]);
    }
        console.log(formatedWifis);
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.get('/geolocation',(req, res)=> {
  var fn = function getGeo(obj) {
    return new Promise((resolve, reject) => {
      resolve(axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDaWHUor2AZNZYVvbu1qaaEdCxFTi6Nv_Q',{
        considerIp: "false",
        wifiAccessPoints: [{macAddress:obj[0]},{macAddress:obj[1]}]
      }));
      reject("rejected");
    })
  }
  function reflect(promise){
    return promise.then(function(v){ return {v:v, status: "resolved" }},
    function(e){ return {e:e, status: "rejected" }});
  }


    formatedWifis.map(item=>{
      reflect(fn(item)).then(function(v){
        console.log(v.status);
        if(v.status==='resolved'){
          console.log(v)
          return v;
        }
      })
    })

  // .then(resp => res.send(resp))
  // .catch(err => {if(err){console.log(err)}})

  // console.log("locations is",locations);

  // var locations = formatedWifis.map(fn);
  // var geoLocations = Promise.all(locations);
  // geoLocations
  // .then(resp => res.send(resp))
  // .catch(err => {
  //   if(err) {
  //     console.log('Error:', err)
  //   }
  // })

  // axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDaWHUor2AZNZYVvbu1qaaEdCxFTi6Nv_Q',{
  //   considerIp: false,
  //   wifiAccessPoints: [
  //     {macAddress:"0c:27:24:50:4a:88"},
  //     {macAddress:"82:15:54:60:96:0e"}
  //   ]
  // })
  // .then(response => {
  //   console.log(response)
  //   res.send(response.data)
  // })
});

// app.use('/api', api);

app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
