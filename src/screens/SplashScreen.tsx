import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedDots from '../components/AnimatedDots';

const { width, height } = Dimensions.get('window');

interface       ScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [logoScale, setLogoScale] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);

  useEffect(() => {
    const logoAnimation = setTimeout(() => {
      setLogoScale(1);
      setLogoOpacity(1);
    }, 300);

    const textAnimation = setTimeout(() => {
      setTextOpacity(1);
    }, 800);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(logoAnimation);
      clearTimeout(textAnimation);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoCircle,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}
          >
              <Image
  source={require('../../assets/splash-icon.png')}
  resizeMode="contain"
  style={{ width: 100, height: 100 }}
/> 

              
          </View>
            
          <View style={[styles.textContainer, { opacity: textOpacity }]}>
            <View style={styles.appNameContainer}>
              <Text style={styles.appName}>AIRMETRICS</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Air Quality App</Text>
            </View>
          </View>
        </View>

        <View style={[styles.loadingContainer, { opacity: textOpacity }]}>
          <AnimatedDots color="white" size={8} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },

  textContainer: {
    alignItems: 'center',
  },
  appNameContainer: {
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    letterSpacing: 1,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});

export default SplashScreen;
