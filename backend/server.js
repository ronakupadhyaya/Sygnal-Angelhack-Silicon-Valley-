const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const wifi = require('node-wifi');
const axios = require('axios');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cors = require('cors')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

//MongoDB connection
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, function(err) {
  if(err) {
    console.log('Error connecting to MongoDB', err);
  } else {
    console.log('Connected to MongoDB:)');
  }
});
var { User } = require('./models.js');

// PASSPORT FLOW
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log(err);
      return done(err);

    }
    // if no user present, auth failed
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    // auth has has succeeded
    return done(null, user);
  });
}));

app.use(session({ secret: 'frank_ocean' }));
app.use(passport.initialize());
app.use(passport.session());

// app.get('/', auth(passport));

app.post('/login', passport.authenticate('local', { failureRedirect: '/failed' }),function(req, res) {
  User.find({username: req.body.username}, function(err, users) {
    users.forEach(function(user) {
      if(user.password === req.body.password) {
        res.json({success: true, user: user});
        return
      }
    })
    res.json({success: false});
  })
});

app.get('/failed', function(req, res) {
  res.json({success: false});
});

app.post('/register', function(req, res) {
  console.log("HERE'S SERVER SIDE REQ", req.body);
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    isSeller: req.body.isSeller
  });
  newUser.save(function(err, user) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log(user);
      res.json({success: true, user: user});
      return;
    }
  });
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
