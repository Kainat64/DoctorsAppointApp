/* eslint-disable no-trailing-spaces */
/* eslint-disable semi */
/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const OnlinePrescription = () => {
  return (
    <View style={styles.container}>
  <WebView
  source={{ uri: 'https://doctor365.ie/home-modern/' }}
  startInLoadingState={true}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  injectedJavaScript={`
    const style = document.createElement('style');
    style.innerHTML =  \` .col-xs-12,
    .header-sticky-both .headroom.headroom--not-top .page-header-inner,
    .page-footer { display: none !important; } \`;;
    document.head.appendChild(style);
    true; // Required for injectedJavaScript to work
  `}
/>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnlinePrescription;
