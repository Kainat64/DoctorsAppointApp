import React, { Component } from 'react';
import WebView from 'react-native-webview';

class WebMap extends Component {
  render() {
    return (
      <WebView
        source={{ uri: 'https://infinite.red' }}
        style={{ marginTop: 20 }}
      />
    );
  }
}
export default WebMap;