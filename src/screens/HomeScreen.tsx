import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import SimpleAQICard from '../components/SimpleAQICard';
import SimpleLoading from '../components/SimpleLoading';
// Navigate to Map/Forecast/Community via stack routes (no tabs here)

const { width } = Dimensions.get('window');

interface AirQualityData {
  aqi: number;
  level: string;
  color: string;
  description: string;
  recommendations: string[];
}

const HomeScreen = () => {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const navigation = useNavigation<any>();
  const [location, setLocation] = useState<string>('Carregando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocationAndAirQuality();
  }, []);

  const getLocationAndAirQuality = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão de localização é necessária para obter dados do ar');
        setLocation('Localização não disponível');
        setLoading(false);
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      // Simular dados de qualidade do ar (em produção, integrar com APIs reais)
      const mockAirQuality = generateMockAirQuality();
      setAirQuality(mockAirQuality);
      setLocation('Cuiabá, MT');
      setLoading(false);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setLocation('Erro ao obter localização');
      setLoading(false);
    }
  };

  const generateMockAirQuality = (): AirQualityData => {
    // AQI mais alto para Mato Grosso devido às queimadas
    const aqi = Math.floor(Math.random() * 200) + 80;
    let level, color, description, recommendations;

    if (aqi <= 50) {
      level = 'Bom';
      color = '#4CAF50';
      description = 'Qualidade do ar satisfatória';
      recommendations = ['Ideal para atividades ao ar livre', 'Ventile bem sua casa'];
    } else if (aqi <= 100) {
      level = 'Moderado';
      color = '#FF9800';
      description = 'Qualidade do ar aceitável para a maioria';
      recommendations = ['Pessoas sensíveis devem evitar atividades prolongadas', 'Mantenha janelas fechadas'];
    } else if (aqi <= 150) {
      level = 'Insalubre para Grupos Sensíveis';
      color = '#F44336';
      description = 'Crianças e idosos devem evitar atividades ao ar livre';
      recommendations = ['Evite exercícios ao ar livre', 'Use máscara se necessário'];
    } else {
      level = 'Insalubre';
      color = '#9C27B0';
      description = 'Toda a população pode sentir efeitos na saúde';
      recommendations = ['Evite sair de casa', 'Use purificador de ar', 'Mantenha janelas fechadas'];
    }

    return { aqi, level, color, description, recommendations };
  };

  const getAQIIcon = (level: string) => {
    switch (level) {
      case 'Bom':
        return 'happy-outline';
      case 'Moderado':
        return 'thumbs-up-outline';
      case 'Insalubre para Grupos Sensíveis':
        return 'warning-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  if (loading) {
    return (
      <SimpleLoading 
        text="Carregando dados do ar de Cuiabá, MT..." 
        size="large"
      />
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header com localização */}
        <View style={styles.header}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        {/* Card principal de qualidade do ar */}
        {airQuality && (
          <SimpleAQICard
            aqi={airQuality.aqi}
            level={airQuality.level}
            description={airQuality.description}
            color={airQuality.color}
            showDetails={true}
          />
        )}

      {/* Recomendações */}
      {airQuality && (
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recomendações</Text>
          {airQuality.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Cards de ação rápida */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Map')}>
          <Ionicons name="map-outline" size={24} color="#2196F3" />
          <Text style={styles.actionText}  >Ver Mapa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Forecast')}>
          <Ionicons name="cloud-outline" size={24} color="#FF9800" />
          <Text style={styles.actionText}>Previsão</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Community')}>
          <Ionicons name="people-outline" size={24} color="#9C27B0" />
          <Text style={styles.actionText}>Comunidade</Text>
        </TouchableOpacity>
      </View>

      {/* Dados adicionais */}
      <View style={styles.additionalData}>
        <Text style={styles.sectionTitle}>Dados Detalhados</Text>
        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>PM2.5</Text>
            <Text style={styles.dataValue}>25 µg/m³</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>PM10</Text>
            <Text style={styles.dataValue}>40 µg/m³</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>O₃</Text>
            <Text style={styles.dataValue}>80 µg/m³</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>NO₂</Text>
            <Text style={styles.dataValue}>30 µg/m³</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  recommendationsCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 0,
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  additionalData: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: (width - 80) / 2,
    marginBottom: 16,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;
