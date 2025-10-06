import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface AQICardProps {
  aqi: number;
  level: string;
  description: string;
  color: string;
  showDetails?: boolean;
}

const AQICard: React.FC<AQICardProps> = ({
  aqi,
  level,
  description,
  color,
  showDetails = false
}) => {
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
    <LinearGradient
      colors={[color, `${color}CC`]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Ionicons 
          name={getAQIIcon(level) as any} 
          size={30} 
          color="white" 
        />
        <Text style={styles.level}>{level}</Text>
      </View>
      
      <Text style={styles.aqiValue}>{aqi}</Text>
      <Text style={styles.aqiLabel}>Índice de Qualidade do Ar</Text>
      
      {showDetails && (
        <Text style={styles.description}>{description}</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    margin: 20,
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

export default AQICard;
