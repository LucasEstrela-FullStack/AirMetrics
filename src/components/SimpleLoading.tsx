import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SimpleLoadingProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const SimpleLoading: React.FC<SimpleLoadingProps> = ({
  text = 'Carregando dados do ar...',
  size = 'medium'
}) => {
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.5);

  useEffect(() => {
    // Animação de rotação simples
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 10) % 360);
    }, 50);

    // Animação de opacidade
    const opacityInterval = setInterval(() => {
      setOpacity(prev => prev === 0.5 ? 1 : 0.5);
    }, 1000);

    return () => {
      clearInterval(rotationInterval);
      clearInterval(opacityInterval);
    };
  }, []);

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
      <View style={[
        styles.iconContainer,
        { 
          transform: [{ rotate: `${rotation}deg` }],
          opacity: opacity
        }
      ]}>
        <Ionicons 
          name="leaf-outline" 
          size={getIconSize()} 
          color="#4CAF50" 
        />
      </View>
      
      <Text style={[styles.text, { fontSize: getTextSize() }]}>
        {text}
      </Text>
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
  iconContainer: {
    marginBottom: 16,
  },
  text: {
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SimpleLoading;
