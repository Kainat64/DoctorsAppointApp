import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const ComingSoonScreen = () => {
  const scaleValue = new Animated.Value(0.8);
  const opacityValue = new Animated.Value(0);
  const rotateValue = new Animated.Value(0);

  React.useEffect(() => {
    // Scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.elastic(2),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 1000,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [
              { scale: scaleValue },
              { rotate: rotateInterpolation },
            ],
            opacity: opacityValue,
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        Coming Soon!
      </Animated.Text>
      <Animated.Text
        style={[
          styles.subText,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7],
            }),
          },
        ]}
      >
       
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#274A8A',
    position: 'absolute',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default ComingSoonScreen;