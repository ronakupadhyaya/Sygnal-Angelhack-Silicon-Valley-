import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class MapView extends React.Component {
  
 render() {
    const google = window.google;
    return (
      <Map google={window.google} zoom={14}
        // initialCenter={{          //set inital center
        //     lat: 40.854885,
        //     lng: -88.081807
        //   }}
        // visible={false}
      >

        <Marker name={'Current location'} />
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
            // anchor: new google.maps.Point(32,32),
            // scaledSize: new google.maps.Size(64,64)
          }}
        />

        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>Hey</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.GOOGLE_MAP_API)
})(MapView)
