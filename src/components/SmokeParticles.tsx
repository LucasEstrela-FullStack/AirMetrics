import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SmokeParticleProps {
  delay: number;
  duration: number;
  startX: number;
  opacity: number;
}

const SmokeParticle: React.FC<SmokeParticleProps> = ({
  delay,
  duration,
  startX,
  opacity
}) => {
  const translateY = useSharedValue(height);
  const translateX = useSharedValue(startX);
  const scale = useSharedValue(0.5);
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-height, { duration }),
          withTiming(height, { duration: 0 })
        ),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startX + (Math.random() - 0.5) * 100, { duration: duration / 2 }),
          withTiming(startX, { duration: duration / 2 })
        ),
        -1,
        false
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 3 }),
          withTiming(1.5, { duration: duration / 3 }),
          withTiming(0.5, { duration: duration / 3 })
        ),
        -1,
        false
      )
    );

    opacityValue.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(opacity, { duration: duration / 4 }),
          withTiming(opacity * 0.5, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 4 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacityValue.value,
  }));

  return (
    <Animated.View style={[styles.particle, animatedStyle]} />
  );
};

interface SmokeParticlesProps {
  intensity: 'low' | 'medium' | 'high';
  color?: string;
}

const SmokeParticles: React.FC<SmokeParticlesProps> = ({
  intensity,
  color = '#666'
}) => {
  const particleCount = intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25;
  
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: particleCount }).map((_, index) => (
        <SmokeParticle
          key={index}
          delay={index * 200}
          duration={8000 + Math.random() * 4000}
          startX={Math.random() * width}
          opacity={0.1 + Math.random() * 0.3}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default SmokeParticles;
