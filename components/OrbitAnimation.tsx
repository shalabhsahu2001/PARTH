import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const OrbitAnimation: React.FC = () => {
  const electron1Anim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const electron2Anim = useRef<Animated.Value>(new Animated.Value(0)).current;

  const radius = 80; // Distance from nucleus
  const nucleusSize = 20; // Size of the nucleus

  const createAnimation = (electronAnim: Animated.Value) => {
    return Animated.loop(
      Animated.timing(electronAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    );
  };

  useEffect(() => {
    const electron1 = createAnimation(electron1Anim);
    const electron2 = createAnimation(electron2Anim);

    electron1.start();
    electron2.start();

    return () => {
      electron1.stop();
      electron2.stop();
    };
  }, [electron1Anim, electron2Anim]);

  const electron1X = electron1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-radius, radius],
  });

  const electron1Y = electron1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [radius, -radius],
  });

  const electron2X = electron2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [radius, -radius],
  });

  const electron2Y = electron2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-radius, radius],
  });

  return (
    <View style={styles.container}>
      {/* Nucleus */}
      <View style={styles.nucleus} />
      {/* Electrons */}
      <Animated.View
        style={[
          styles.electron,
          {
            transform: [
              { translateX: electron1X },
              { translateY: electron1Y },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.electron,
          {
            transform: [
              { translateX: electron2X },
              { translateY: electron2Y },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nucleus: {
    width: 20, // Size of the nucleus
    height: 20,
    borderRadius: 10, // Half of the width/height for circular shape
    backgroundColor: 'yellow',
    position: 'absolute',
  },
  electron: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    position: 'absolute',
  },
});

export default OrbitAnimation;
