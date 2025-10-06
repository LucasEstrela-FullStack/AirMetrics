import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import earthDataService, { FireData, AirQualityData } from '../services/EarthDataService';
import TEMPODataVisualization from '../components/TEMPODataVisualization';
import TokenStatus from '../components/TokenStatus';

const { width, height } = Dimensions.get('window');

interface AirQualityMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  aqi: number;
  level: string;
  color: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
  };
  type: 'station' | 'fire' | 'hotspot';
  fireIntensity?: 'low' | 'medium' | 'high';
  confidence?: number;
}

const MapScreenFallback = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [airQualityMarkers, setAirQualityMarkers] = useState<AirQualityMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<AirQualityMarker | null>(null);
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTEMPOData, setShowTEMPOData] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    try {
      await getCurrentLocation();
      await loadEarthData();
      generateMockAirQualityData();
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão de localização é necessária');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  };

  const loadEarthData = async () => {
    try {
      // Autenticar com NASA EarthData
      const authenticated = await earthDataService.authenticate();
      if (!authenticated) {
        console.warn('Falha na autenticação com NASA EarthData');
        return;
      }

      // Definir bounds para Mato Grosso
      const bounds = {
        north: -7.0,
        south: -18.0,
        east: -50.0,
        west: -62.0,
      };

      // Carregar dados de queimadas
      const fireDataResult = await earthDataService.getFireData(bounds);
      setFireData(fireDataResult);

      // Carregar dados de qualidade do ar
      const airQualityData = await earthDataService.getAirQualityData(bounds);
      console.log('Dados de qualidade do ar carregados:', airQualityData.length, 'estações');

    } catch (error) {
      console.error('Erro ao carregar dados da Terra:', error);
    }
  };

  const generateMockAirQualityData = () => {
    // Cuiabá, MT como centro
    const cuiabaLat = -15.6014;
    const cuiabaLng = -56.0979;
    
    const markers: AirQualityMarker[] = [];
    
    // Estações de monitoramento (8)
    for (let i = 0; i < 8; i++) {
      const lat = cuiabaLat + (Math.random() - 0.5) * 0.2;
      const lng = cuiabaLng + (Math.random() - 0.5) * 0.2;
      const aqi = Math.floor(Math.random() * 200) + 50; // AQI mais alto devido às queimadas
      
      let level, color;
      if (aqi <= 50) {
        level = 'Bom';
        color = '#4CAF50';
      } else if (aqi <= 100) {
        level = 'Moderado';
        color = '#FF9800';
      } else if (aqi <= 150) {
        level = 'Insalubre';
        color = '#F44336';
      } else {
        level = 'Muito Insalubre';
        color = '#9C27B0';
      }

      markers.push({
        id: `station_${i}`,
        coordinate: { latitude: lat, longitude: lng },
        aqi,
        level,
        color,
        type: 'station',
        pollutants: {
          pm25: Math.floor(aqi * 0.6) + Math.floor(Math.random() * 20),
          pm10: Math.floor(aqi * 0.8) + Math.floor(Math.random() * 30),
          o3: Math.floor(aqi * 0.7) + Math.floor(Math.random() * 25),
          no2: Math.floor(aqi * 0.4) + Math.floor(Math.random() * 15),
        },
      });
    }
    
    // Pontos de queimadas ativas (5)
    for (let i = 0; i < 5; i++) {
      const lat = cuiabaLat + (Math.random() - 0.5) * 0.5; // Mais espalhados
      const lng = cuiabaLng + (Math.random() - 0.5) * 0.5;
      const aqi = Math.floor(Math.random() * 150) + 150; // AQI muito alto
      
      const fireIntensities = ['low', 'medium', 'high'] as const;
      const fireIntensity = fireIntensities[Math.floor(Math.random() * 3)];
      
      let color;
      switch (fireIntensity) {
        case 'low':
          color = '#FF9800';
          break;
        case 'medium':
          color = '#F44336';
          break;
        case 'high':
          color = '#9C27B0';
          break;
      }

      markers.push({
        id: `fire_${i}`,
        coordinate: { latitude: lat, longitude: lng },
        aqi,
        level: 'Queimada Ativa',
        color,
        type: 'fire',
        fireIntensity,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confiança
        pollutants: {
          pm25: Math.floor(aqi * 0.8) + Math.floor(Math.random() * 40),
          pm10: Math.floor(aqi * 1.0) + Math.floor(Math.random() * 50),
          o3: Math.floor(aqi * 0.6) + Math.floor(Math.random() * 30),
          no2: Math.floor(aqi * 0.3) + Math.floor(Math.random() * 20),
        },
      });
    }
    
    // Hotspots de calor (2)
    for (let i = 0; i < 2; i++) {
      const lat = cuiabaLat + (Math.random() - 0.5) * 0.3;
      const lng = cuiabaLng + (Math.random() - 0.5) * 0.3;
      const aqi = Math.floor(Math.random() * 100) + 100;

      markers.push({
        id: `hotspot_${i}`,
        coordinate: { latitude: lat, longitude: lng },
        aqi,
        level: 'Hotspot de Calor',
        color: '#FF5722',
        type: 'hotspot',
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confiança
        pollutants: {
          pm25: Math.floor(aqi * 0.5) + Math.floor(Math.random() * 25),
          pm10: Math.floor(aqi * 0.7) + Math.floor(Math.random() * 35),
          o3: Math.floor(aqi * 0.8) + Math.floor(Math.random() * 40),
          no2: Math.floor(aqi * 0.5) + Math.floor(Math.random() * 25),
        },
      });
    }
    
    setAirQualityMarkers(markers);
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#4CAF50';
    if (aqi <= 100) return '#FF9800';
    if (aqi <= 150) return '#F44336';
    return '#9C27B0';
  };

  if (showTEMPOData) {
    return (
      <TEMPODataVisualization
        bounds={{
          north: -7.0,
          south: -18.0,
          east: -50.0,
          west: -62.0,
        }}
        onDataLoaded={(data) => console.log('Dados TEMPO carregados:', data.length)}
      />
    );
  }

  return (
    <ScrollView style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mapa da Qualidade do Ar - Mato Grosso</Text>
        <Text style={styles.subtitle}>
          {location ? 'Cuiabá, MT - Monitoramento de Queimadas' : 'Detectando localização...'}
        </Text>
        
        {/* Botão TEMPO */}
        <TouchableOpacity
          style={styles.tempoButton}
          onPress={() => setShowTEMPOData(!showTEMPOData)}
        >
          <Ionicons name="rocket-outline" size={20} color="white" />
          <Text style={styles.tempoButtonText}>
            {showTEMPOData ? 'Ocultar' : 'Mostrar'} Dados TEMPO
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mapa simulado */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={48} color="#666" />
          <Text style={styles.mapPlaceholderText}>
            Mapa Interativo
          </Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Em desenvolvimento - Versão web
          </Text>
        </View>
      </View>

      {/* Status do Token */}
      <TokenStatus />

      {/* Estatísticas rápidas */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Resumo - Mato Grosso</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="location-outline" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{airQualityMarkers.filter(m => m.type === 'station').length}</Text>
            <Text style={styles.statLabel}>Estações</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={24} color="#F44336" />
            <Text style={styles.statNumber}>{fireData.length}</Text>
            <Text style={styles.statLabel}>Queimadas Ativas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="thermometer-outline" size={24} color="#FF5722" />
            <Text style={styles.statNumber}>{airQualityMarkers.filter(m => m.type === 'hotspot').length}</Text>
            <Text style={styles.statLabel}>Hotspots</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="warning-outline" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>{airQualityMarkers.filter(m => m.aqi > 100).length}</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>
        </View>
      </View>

      {/* Dados de Queimadas da NASA */}
      {fireData.length > 0 && (
        <View style={styles.fireDataSection}>
          <Text style={styles.sectionTitle}>🔥 Dados de Queimadas - NASA EarthData</Text>
          <Text style={styles.dataSourceText}>
            Fonte: NASA MODIS/VIIRS • Última atualização: {new Date().toLocaleTimeString()}
          </Text>
          
          {fireData.slice(0, 3).map((fire, index) => (
            <View key={index} style={styles.fireDataCard}>
              <View style={styles.fireDataHeader}>
                <Ionicons 
                  name="flame" 
                  size={20} 
                  color={
                    fire.fireIntensity === 'high' ? '#9C27B0' :
                    fire.fireIntensity === 'medium' ? '#F44336' : '#FF9800'
                  } 
                />
                <Text style={styles.fireDataTitle}>
                  Foco {index + 1} - Intensidade {fire.fireIntensity === 'high' ? 'Alta' : 
                    fire.fireIntensity === 'medium' ? 'Média' : 'Baixa'}
                </Text>
              </View>
              
              <View style={styles.fireDataDetails}>
                <Text style={styles.fireDataText}>
                  📍 {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)}
                </Text>
                <Text style={styles.fireDataText}>
                  🎯 Confiança: {fire.confidence}%
                </Text>
                <Text style={styles.fireDataText}>
                  🛰️ Satélite: {fire.satellite}
                </Text>
                {fire.brightness && (
                  <Text style={styles.fireDataText}>
                    💡 Brilho: {fire.brightness}K
                  </Text>
                )}
              </View>
            </View>
          ))}
          
          {fireData.length > 3 && (
            <Text style={styles.moreFiresText}>
              +{fireData.length - 3} focos adicionais detectados
            </Text>
          )}
        </View>
      )}

      {/* Lista de pontos de monitoramento */}
      <View style={styles.stationsSection}>
        <Text style={styles.sectionTitle}>Pontos de Monitoramento</Text>
        
        {airQualityMarkers.map((marker, index) => (
          <TouchableOpacity
            key={marker.id}
            style={styles.stationCard}
            onPress={() => setSelectedMarker(marker)}
          >
            <View style={styles.stationHeader}>
              <View style={styles.stationInfo}>
                <View style={styles.stationNameRow}>
                  {marker.type === 'station' && <Ionicons name="radio-outline" size={16} color="#2196F3" />}
                  {marker.type === 'fire' && <Ionicons name="flame" size={16} color="#F44336" />}
                  {marker.type === 'hotspot' && <Ionicons name="thermometer" size={16} color="#FF5722" />}
                  <Text style={styles.stationName}>
                    {marker.type === 'station' ? `Estação ${index + 1}` :
                     marker.type === 'fire' ? `Queimada ${index - 7}` :
                     `Hotspot ${index - 12}`}
                  </Text>
                </View>
                <Text style={styles.stationCoordinates}>
                  {marker.coordinate.latitude.toFixed(4)}, {marker.coordinate.longitude.toFixed(4)}
                </Text>
                {marker.confidence && (
                  <Text style={styles.confidenceText}>
                    Confiança: {marker.confidence}%
                  </Text>
                )}
              </View>
              <View style={[styles.aqiBadge, { backgroundColor: marker.color }]}>
                <Text style={styles.aqiText}>AQI {marker.aqi}</Text>
              </View>
            </View>
            
            <View style={styles.stationDetails}>
              <Text style={[styles.levelText, { color: marker.color }]}>
                {marker.level}
              </Text>
              
              {marker.fireIntensity && (
                <Text style={styles.fireIntensityText}>
                  Intensidade: {marker.fireIntensity === 'low' ? 'Baixa' :
                               marker.fireIntensity === 'medium' ? 'Média' : 'Alta'}
                </Text>
              )}
              
              <View style={styles.pollutantsRow}>
                <View style={styles.pollutantItem}>
                  <Text style={styles.pollutantLabel}>PM2.5</Text>
                  <Text style={styles.pollutantValue}>{marker.pollutants.pm25}</Text>
                </View>
                <View style={styles.pollutantItem}>
                  <Text style={styles.pollutantLabel}>PM10</Text>
                  <Text style={styles.pollutantValue}>{marker.pollutants.pm10}</Text>
                </View>
                <View style={styles.pollutantItem}>
                  <Text style={styles.pollutantLabel}>O₃</Text>
                  <Text style={styles.pollutantValue}>{marker.pollutants.o3}</Text>
                </View>
                <View style={styles.pollutantItem}>
                  <Text style={styles.pollutantLabel}>NO₂</Text>
                  <Text style={styles.pollutantValue}>{marker.pollutants.no2}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Legenda */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legenda</Text>
        
        <View style={styles.legendSection}>
          <Text style={styles.legendSubtitle}>Qualidade do Ar</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Bom (0-50)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Moderado (51-100)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Insalubre (101-150)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#9C27B0' }]} />
              <Text style={styles.legendText}>Muito Insalubre (151+)</Text>
            </View>
          </View>
        </View>

        <View style={styles.legendSection}>
          <Text style={styles.legendSubtitle}>Tipos de Monitoramento</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <Ionicons name="radio-outline" size={16} color="#2196F3" />
              <Text style={styles.legendText}>Estação de Monitoramento</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="flame" size={16} color="#F44336" />
              <Text style={styles.legendText}>Queimada Ativa</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="thermometer" size={16} color="#FF5722" />
              <Text style={styles.legendText}>Hotspot de Calor</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Modal de detalhes */}
      {selectedMarker && (
        <View style={styles.detailModal}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>Detalhes da Estação</Text>
            <TouchableOpacity onPress={() => setSelectedMarker(null)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailContent}>
            <Text style={[styles.aqiValue, { color: selectedMarker.color }]}>
              {selectedMarker.aqi}
            </Text>
            <Text style={styles.aqiLevel}>{selectedMarker.level}</Text>
            
            <View style={styles.pollutantsGrid}>
              <View style={styles.pollutantDetail}>
                <Text style={styles.pollutantLabel}>PM2.5</Text>
                <Text style={styles.pollutantValue}>{selectedMarker.pollutants.pm25} µg/m³</Text>
              </View>
              <View style={styles.pollutantDetail}>
                <Text style={styles.pollutantLabel}>PM10</Text>
                <Text style={styles.pollutantValue}>{selectedMarker.pollutants.pm10} µg/m³</Text>
              </View>
              <View style={styles.pollutantDetail}>
                <Text style={styles.pollutantLabel}>O₃</Text>
                <Text style={styles.pollutantValue}>{selectedMarker.pollutants.o3} µg/m³</Text>
              </View>
              <View style={styles.pollutantDetail}>
                <Text style={styles.pollutantLabel}>NO₂</Text>
                <Text style={styles.pollutantValue}>{selectedMarker.pollutants.no2} µg/m³</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  mapContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  statsSection: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  stationsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  stationCard: {
    backgroundColor: 'white',
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stationInfo: {
    flex: 1,
  },
  stationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
  confidenceText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  stationCoordinates: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  aqiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  aqiText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  stationDetails: {
    marginTop: 10,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  fireIntensityText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  pollutantsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pollutantItem: {
    alignItems: 'center',
    flex: 1,
  },
  pollutantLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  pollutantValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  legend: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  legendSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  detailModal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailContent: {
    alignItems: 'center',
  },
  aqiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  aqiLevel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  pollutantDetail: {
    width: '48%',
    marginBottom: 15,
  },
  fireDataSection: {
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
  dataSourceText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  fireDataCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  fireDataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fireDataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  fireDataDetails: {
    paddingLeft: 28,
  },
  fireDataText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  moreFiresText: {
    fontSize: 12,
    color: '#F44336',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  legendSection: {
    marginBottom: 20,
  },
  tempoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tempoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MapScreenFallback;
