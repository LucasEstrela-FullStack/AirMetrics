import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme';

interface AnimatedSproutProps {
  color: string;
  size: number;
  airQuality: number;
}

const AnimatedSprout: React.FC<AnimatedSproutProps> = ({ 
  color, 
  size, 
  airQuality 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1.2),
      useNativeDriver: true,
    }).start();

    // Animação de pulso contínua
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Animação de balanço suave
    const swayAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Animação de rotação lenta
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    swayAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      swayAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  // Atualizar animações baseado na qualidade do ar
  useEffect(() => {
    let animationSpeed = 2000; // velocidade padrão
    
    if (airQuality <= 50) {
      animationSpeed = 1500; // mais rápido para ar bom
    } else if (airQuality <= 100) {
      animationSpeed = 2000; // velocidade normal
    } else if (airQuality <= 150) {
      animationSpeed = 3000; // mais lento para ar ruim
    } else {
      animationSpeed = 4000; // muito lento para ar muito ruim
    }

    // Restart pulse animation with new speed
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: airQuality > 100 ? 0.95 : 1.1, // menos pulso para ar ruim
          duration: animationSpeed,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: animationSpeed,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
  }, [airQuality]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sway = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const getSproutColor = () => {
    if (airQuality <= 50) {
      return colors.aqi.good; // Verde saudável
    } else if (airQuality <= 100) {
      return colors.aqi.moderate; // Laranja moderado
    } else if (airQuality <= 150) {
      return colors.aqi.unhealthy; // Vermelho insalubre
    } else {
      return colors.aqi.veryUnhealthy; // Roxo muito insalubre
    }
  };

  const getLeafColor = () => {
    const baseColor = getSproutColor();
    // Criar uma cor mais clara para as folhas
    return baseColor + '80'; // adiciona transparência
  };

  const getStemColor = () => {
    const baseColor = getSproutColor();
    // Criar uma cor mais escura para o caule
    return baseColor;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.sproutContainer,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
              { rotate: rotation },
              { rotate: sway },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <SvgLinearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={getLeafColor()} stopOpacity="1" />
              <Stop offset="100%" stopColor={getSproutColor()} stopOpacity="0.8" />
            </SvgLinearGradient>
            <SvgLinearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={getStemColor()} stopOpacity="1" />
              <Stop offset="100%" stopColor={getStemColor()} stopOpacity="0.7" />
            </SvgLinearGradient>
          </Defs>

          {/* Terra/Vaso */}
          <Circle
            cx="50"
            cy="85"
            r="12"
            fill="#8D6E63"
            opacity="0.8"
          />

          {/* Caule principal */}
          <Path
            d="M50 85 Q52 75 50 65 Q48 55 50 45"
            stroke={getStemColor()}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Folha principal (esquerda) */}
          <Path
            d="M50 45 Q35 40 30 50 Q35 55 50 50"
            fill="url(#leafGradient)"
            stroke={getSproutColor()}
            strokeWidth="1"
          />

          {/* Folha principal (direita) */}
          <Path
            d="M50 45 Q65 40 70 50 Q65 55 50 50"
            fill="url(#leafGradient)"
            stroke={getSproutColor()}
            strokeWidth="1"
          />

          {/* Folhas menores */}
          <Path
            d="M50 50 Q40 48 38 52 Q40 54 50 52"
            fill={getLeafColor()}
            stroke={getSproutColor()}
            strokeWidth="0.5"
          />

          <Path
            d="M50 50 Q60 48 62 52 Q60 54 50 52"
            fill={getLeafColor()}
            stroke={getSproutColor()}
            strokeWidth="0.5"
          />

          {/* Broto central */}
          <Circle
            cx="50"
            cy="42"
            r="2"
            fill={getSproutColor()}
            opacity="0.9"
          />

          {/* Efeito de brilho */}
          <Circle
            cx="48"
            cy="40"
            r="1"
            fill={colors.white}
            opacity="0.6"
          />
        </Svg>
      </Animated.View>

      {/* Partículas de poluição (apenas quando AQI > 100) */}
      {airQuality > 100 && (
        <View style={styles.particlesContainer}>
          {[...Array(3)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                {
                  left: Math.random() * size,
                  top: Math.random() * (size * 0.6),
                  backgroundColor: airQuality > 150 ? colors.aqi.veryUnhealthy : colors.aqi.unhealthy,
                  opacity: 0.3,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sproutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});

export default AnimatedSprout;
