import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface SimpleAQICardProps {
  aqi: number;
  level: string;
  description: string;
  color: string;
  showDetails?: boolean;
}

const SimpleAQICard: React.FC<SimpleAQICardProps> = ({
  aqi,
  level,
  description,
  color,
  showDetails = false
}) => {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (aqi > 100) {
      // Animação de pulso simples usando setInterval
      const interval = setInterval(() => {
        setPulseScale(prev => prev === 1 ? 1.05 : 1);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [aqi]);

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons 
              name={getAQIIcon(level) as any} 
              size={30} 
              color="white" 
            />
            <Text style={styles.level}>{level}</Text>
          </View>
          
          <View style={[styles.valueContainer, { transform: [{ scale: pulseScale }] }]}>
            <Text style={styles.aqiValue}>{aqi}</Text>
          </View>
          
          <Text style={styles.aqiLabel}>Índice de Qualidade do Ar</Text>
          
          {showDetails && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </LinearGradient>
    </View>
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
  },
  content: {
    alignItems: 'center',
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
  valueContainer: {
    transition: 'transform 0.3s ease',
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

export default SimpleAQICard;
