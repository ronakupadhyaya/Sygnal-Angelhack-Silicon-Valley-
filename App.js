import React from 'react';
import {
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
  Text,
  View
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
    }
  }

  componentDidMount() {

  }



  render() {
    return (
      <View style={{
        flex: 1,
      }}>
        <Text>WiFi Sharing</Text>

      </View>
    );
  }
}

export default App;
