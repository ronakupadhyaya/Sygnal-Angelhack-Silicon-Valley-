import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

class MapView extends React.Component {
 constructor(props){
   super(props);
   this.state = {
     showingInfoWindow: false,
     activeMarker: {},
     selectedPlace: {},
     google:{}
   }
   this.onMarkerClick = this.onMarkerClick.bind(this);
   this.onMapClicked = this.onMapClicked.bind(this);
 }

  componentDidMount(){
    this.setState({google:this.props.google})
  }

  onMarkerClick(props, marker, e) {
     this.setState({
       selectedPlace: props,
       activeMarker: marker,
       showingInfoWindow: true
     });
   }

   onMapClicked(props) {
     if (this.state.showingInfoWindow) {
       this.setState({
         showingInfoWindow: false,
         activeMarker: null
       })
     }
   }

 render() {
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={20}
          style={{width: '95%', height: '55%', position: 'relative', margin: '20px'}}
          onClick={() => this.onMapClicked}
          initialCenter={{          //set inital center
            lat:37.563181799999995,
            lng: -122.3245266
          }}
        >
          <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>

        <Marker onClick={this.onMarkerClick} name='ATT256'  frequency='2437' signal_level='-91'
           position={{lat:37.5631114,lng:122.32467109999999}}
        />
        <Marker onClick={this.onMarkerClick} name='Roblox_Public'  frequency='2412' signal_level='-79'
           position={{lat:37.5634544,lng:-122.32466679999999}}
        />
        <Marker onClick={this.onMarkerClick} name='DUH-Employees'  frequency='2412' signal_level='-56'
           position={{lat:37.5635112,lng:-122.32476770000001}}
        />
        <Marker onClick={this.onMarkerClick} name='Roblox'  frequency='2412' signal_level='-81'
           position={{lat:37.563420099999995,lng:-122.32461680000002}}
        />
        <Marker onClick={this.onMarkerClick} name='Roblox2'  frequency='5240' signal_level='-90'
           position={{lat:37.5631646,lng:-122.3244847}}
        />
        <Marker onClick={this.onMarkerClick} name='Sonos'  frequency='5280' signal_level='-89'
           position={{lat:37.5632324,lng:-122.32459340000001}}
        />
        <Marker onClick={this.onMarkerClick} name='DUH-Residence'  frequency='5660' signal_level='-56'
           position={{lat:37.563337499999996,lng:-122.32473739999999}}
           icon={{
             url:'img/small_area_wide_speed_high.png'
           }}
        />
        <Marker onClick={this.onMarkerClick} name='Nest'  frequency='5660' signal_level='-54'
          position={{lat:37.563340499999995,lng:-122.32473059999998}}
          icon={{
            url:'img/small_area_small_speed_high.png'
          }}
        />
        <Marker onClick={this.onMarkerClick} name='draper-university'  frequency='5660' signal_level='-54'
           position={{lat:37.563340499999995,lng:-122.32473059999998}}
           icon={{
             url:'img/small_area_middle_speed_high.png'
           }}
        />
        <Marker onClick={this.onMarkerClick} name='DU-Dorm'  frequency='5660' signal_level='-55'
           position={{lat:37.5633141,lng:-122.3247718}}
           icon={{
             url:'img/small_area_middle_speed_high.png'
           }}
        />
        <Marker onClick={this.onMarkerClick} name='DA-Guest'  frequency='5280' signal_level='-78'
           position={{lat:37.563220199999996,lng:-122.32454349999999}}
           icon={{
             url:'img/small_area_small_speed_low.png'
           }}
        />
        <Marker onClick={this.onMarkerClick} name='DA-WiFi'  frequency='5280' signal_level='-78'
           position={{lat:37.5632982,lng:-122.32454349999999}}
           icon={{
             url:'img/small_area_middle_speed_low.png'
           }}
        />
        <Marker onClick={this.onMarkerClick} name='Roblox_Public'  frequency='2412' signal_level='-85'
           position={{lat:37.563544799999995,lng:-122.3246326}}
           icon={{
             url:'img/small_area_wide_speed_low.png',
            //  scaledSize: new google.maps.Size(64,64)
           }}
        />
          {/* <Marker name={'Current location'} />
          <Marker
            title={'The marker`s title will appear as a tooltip.'}
            name={'SOMA'}
            position={{lat: 37.778519, lng: -122.405640}} />
          <Marker
            name={'Dolores park'}
            position={{lat: 37.759703, lng: -122.428093}} />
          <Marker
            name={'Your position'}
            position={{lat: 37.762391, lng: -122.439192}}
            icon={{
              url: "https://camo.githubusercontent.com/bd7861a37af9413a9206c38535d8684a7f32ead1/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313036373930372f313733313732362f37393330373439652d363330662d313165332d383330312d3832383539366130653630322e706e67",
            }}
          /> */}

          {/* <InfoWindow onClose={this.onInfoWindowClose}>
              <div>
                <h1>Hey</h1>
              </div>
          </InfoWindow> */}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDaWHUor2AZNZYVvbu1qaaEdCxFTi6Nv_Q")
})(MapView)
