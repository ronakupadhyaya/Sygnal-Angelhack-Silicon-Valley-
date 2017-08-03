import React from 'react';
import {
  Map,
  InfoWindow, Marker, GoogleApiWrapper
} from 'google-maps-react';
import ReactDOM from 'react-dom';
import DrawArea from './DrawArea';
import axios from 'axios';

class MapView extends React.Component {
  constructor(props){
    super(props);
    this.state={
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      wifis:[]
    }
    this.onInfoWindowClose=this.onInfoWindowClose.bind(this);
    this.onMarkerClick=this.onMarkerClick.bind(this);
    this.onMapClick=this.onMapClick.bind(this);
  }
  componentWillMount(){
    const self = this;
    axios.get('http://localhost:3000/geolocation')
    .then(response => {
      self.setState({wifis:response.data})
    })
    .then(()=>console.log(self.state))
  }
  onInfoWindowClose(){
     this.setState({
       showingInfoWindow:false
     })
  }
  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }
  onMapClick(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }
  render() {
    const style = {
      width: '50%',
      height: '50%'
    }
    if (!this.props.loaded) {
          return (<div>Loading...</div>)
        }
    return (
      <div style={style}>
          <Map google={this.props.google}
            zoom={20}
            initialCenter={this.state.wifis[0].location}
            onClick={this.onMapClicked}
            >
              {this.state.wifis.map(item=> {
                //determine wifi signal strength
                var signal;
                if(parseInt(item.signal_level)>-65){
                  signal = 'high'
                } else if (parseInt(item.signal_level)>-80){
                  signal='middle'
                } else {
                  signal='low'
                }
                //determine wifi signal coverage
                var area;
                if(parseInt(item.frequency)>5000){
                  area = 'wide';
                } else if (parseInt(item.frequency)>2000){
                  area = 'middle';
                } else {
                  area = 'small';
                }
                return(
                  <Marker onClick={this.onMarkerClick} name={item.ssid}  frequency={item.frequency}
                    signal_level={item.signal_level}
                    position={item.location}
                    icon={{
                      url:'img/small_area_'+area+'_speed_'+signal+'.png',
                      scaledSize: new google.maps.Size(40,40),
                      anchor: new google.maps.Point(32,32)
                    }}
                  />
                )
              }
              )}
              <InfoWindow
                onClose={this.onInfoWindowClose}
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                >
                  <div>
                    <h1>WiFi: {this.state.selectedPlace.name}</h1>
                    <span>Price: ¢{parseInt(this.state.selectedPlace.signal_level)+100}/hour</span>
                    <br/>
                    <button type="button" className="btn btn-success">Buy</button>
                  </div>
                </InfoWindow>
          </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper(
  {
  apiKey: "AIzaSyDaWHUor2AZNZYVvbu1qaaEdCxFTi6Nv_Q"
  }
)(MapView)
