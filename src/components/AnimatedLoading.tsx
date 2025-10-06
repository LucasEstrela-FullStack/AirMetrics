import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';

interface AnimatedLoadingProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const AnimatedLoading: React.FC<AnimatedLoadingProps> = ({
  text = 'Carregando dados do ar...',
  size = 'medium'
}) => {
  const rotationValue = useSharedValue(0);
  const scaleValue = useSharedValue(0.8);
  const opacityValue = useSharedValue(0.5);

  useEffect(() => {
    // Animação de rotação contínua
    rotationValue.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      false
    );

    // Animação de escala pulsante
    scaleValue.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(0.8, { duration: 1000 })
      ),
      -1,
      true
    );

    // Animação de opacidade
    opacityValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotationValue.value * 360}deg` },
      { scale: scaleValue.value }
    ],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 32;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={animatedIconStyle}>
        <Ionicons 
          name="leaf-outline" 
          size={getIconSize()} 
          color="#4CAF50" 
        />
      </Animated.View>
      
      <Animated.Text style={[styles.text, { fontSize: getTextSize() }, animatedTextStyle]}>
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AnimatedLoading;
