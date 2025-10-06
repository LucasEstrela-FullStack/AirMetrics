import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';

interface AnimatedAQICardProps {
  aqi: number;
  level: string;
  description: string;
  color: string;
  showDetails?: boolean;
}

const AnimatedAQICard: React.FC<AnimatedAQICardProps> = ({
  aqi,
  level,
  description,
  color,
  showDetails = false
}) => {
  const scaleValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);
  const pulseValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    // Animação de entrada
    scaleValue.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacityValue.value = withTiming(1, { duration: 800 });
    
    // Animação de pulso contínua para AQI alto
    if (aqi > 100) {
      pulseValue.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        true
      );
    }
    
    // Rotação sutil do ícone
    rotateValue.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, [aqi]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scaleValue.value },
      { scale: aqi > 100 ? 1 + pulseValue.value * 0.05 : 1 }
    ],
    opacity: opacityValue.value,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        rotate: `${rotateValue.value * 360}deg` 
      }
    ],
  }));

  const animatedValueStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(aqi > 150 ? 1.1 : 1) }
    ],
  }));

  const getAQIIcon = (level: string) => {
    switch (level) {
      case 'Bom':
        return 'happy-outline';
      case 'Moderado':
        return 'thumbs-up-outline';
      case 'Insalubre para Grupos Sensíveis':
      case 'Insalubre':
        return 'warning-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  const getPulseColor = () => {
    if (aqi > 150) return `${color}40`; // Mais transparente
    if (aqi > 100) return `${color}20`;
    return 'transparent';
  };

  return (
    <Animated.View style={[styles.container, animatedCardStyle]}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.gradient}
      >
        {/* Efeito de pulso para AQI alto */}
        {aqi > 100 && (
          <Animated.View 
            style={[
              styles.pulseEffect,
              { 
                backgroundColor: getPulseColor(),
                transform: [
                  { scale: withRepeat(withTiming(1.5, { duration: 2000 }), -1, true) }
                ]
              }
            ]} 
          />
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Animated.View style={animatedIconStyle}>
              <Ionicons 
                name={getAQIIcon(level) as any} 
                size={30} 
                color="white" 
              />
            </Animated.View>
            <Text style={styles.level}>{level}</Text>
          </View>
          
          <Animated.View style={animatedValueStyle}>
            <Text style={styles.aqiValue}>{aqi}</Text>
          </Animated.View>
          
          <Text style={styles.aqiLabel}>Índice de Qualidade do Ar</Text>
          
          {showDetails && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  pulseEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  level: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  aqiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  aqiLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default AnimatedAQICard;
