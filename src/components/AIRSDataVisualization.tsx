import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import airsService, { AIRSData, AIRSForecast, AIRSTimeSeries } from '../services/AIRSService';

const { width } = Dimensions.get('window');

interface AIRSDataVisualizationProps {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  onDataLoaded?: (data: AIRSData[]) => void;
}

const AIRSDataVisualization: React.FC<AIRSDataVisualizationProps> = ({ 
  bounds, 
  onDataLoaded 
}) => {
  const [loading, setLoading] = useState(false);
  const [airsData, setAirsData] = useState<AIRSData[]>([]);
  const [forecast, setForecast] = useState<AIRSForecast[]>([]);
  const [timeSeries, setTimeSeries] = useState<AIRSTimeSeries[]>([]);
  const [selectedView, setSelectedView] = useState<'current' | 'forecast' | 'timeseries'>('current');
  const [dataPoints, setDataPoints] = useState(0);

  useEffect(() => {
    loadAIRSData();
  }, []);

  const loadAIRSData = async () => {
    setLoading(true);
    try {
      console.log('🌡️ Carregando dados AIRS...');
      
      // Autenticar
      const authenticated = await airsService.authenticate();
      if (!authenticated) {
        Alert.alert('Erro', 'Falha na autenticação com NASA AIRS');
        return;
      }

      // Buscar dados atuais
      const currentData = await airsService.getAIRSData(bounds);
      setAirsData(currentData);
      setDataPoints(currentData.length);

      // Buscar previsão
      const forecastData = await airsService.getAIRSForecast(bounds, 7);
      setForecast(forecastData);

      // Buscar série temporal
      const centerLat = (bounds.north + bounds.south) / 2;
      const centerLng = (bounds.east + bounds.west) / 2;
      const timeSeriesData = await airsService.getAIRSTimeSeries(centerLat, centerLng, 7);
      setTimeSeries(timeSeriesData);

      onDataLoaded?.(currentData);
      
      console.log('✅ Dados AIRS carregados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar dados AIRS:', error);
      Alert.alert('Erro', 'Falha ao carregar dados AIRS');
    } finally {
      setLoading(false);
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return '#4A90E2'; // Azul - frio
    if (temp < 25) return '#7ED321'; // Verde - agradável
    if (temp < 35) return '#F5A623'; // Laranja - quente
    return '#D0021B'; // Vermelho - muito quente
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return '#F5A623'; // Laranja - seco
    if (humidity < 60) return '#7ED321'; // Verde - normal
    if (humidity < 80) return '#4A90E2'; // Azul - úmido
    return '#9013FE'; // Roxo - muito úmido
  };

  const renderCurrentData = () => (
    <View style={styles.dataContainer}>
      <Text style={styles.sectionTitle}>Dados Atuais AIRS</Text>
      <Text style={styles.dataCount}>{dataPoints} pontos de dados</Text>
      
      {airsData.slice(0, 5).map((data, index) => (
        <View key={index} style={styles.dataCard}>
          <View style={styles.dataHeader}>
            <Text style={styles.dataLocation}>
              {data.latitude.toFixed(3)}°, {data.longitude.toFixed(3)}°
            </Text>
            <View style={styles.qualityIndicator}>
              <Ionicons 
                name={data.qualityFlag ? 'checkmark-circle' : 'warning'} 
                size={16} 
                color={data.qualityFlag ? '#4CAF50' : '#FF9800'} 
              />
            </View>
          </View>
          
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Temperatura</Text>
              <Text style={[styles.dataValue, { color: getTemperatureColor(data.surfaceTemperature) }]}>
                {data.surfaceTemperature.toFixed(1)}°C
              </Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Umidade</Text>
              <Text style={[styles.dataValue, { color: getHumidityColor(data.relativeHumidity) }]}>
                {data.relativeHumidity.toFixed(1)}%
              </Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Pressão</Text>
              <Text style={styles.dataValue}>
                {data.pressure.toFixed(1)} hPa
              </Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Nuvens</Text>
              <Text style={styles.dataValue}>
                {(data.cloudFraction * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderForecast = () => (
    <View style={styles.dataContainer}>
      <Text style={styles.sectionTitle}>Previsão AIRS (7 dias)</Text>
      
      {forecast.slice(0, 7).map((item, index) => (
        <View key={index} style={styles.forecastCard}>
          <View style={styles.forecastHeader}>
            <Text style={styles.forecastDate}>{item.date}</Text>
            <Text style={styles.forecastTime}>{item.time}</Text>
          </View>
          
          <View style={styles.forecastData}>
            <View style={styles.forecastItem}>
              <Ionicons name="thermometer" size={16} color={getTemperatureColor(item.surfaceTemperature)} />
              <Text style={styles.forecastValue}>{item.surfaceTemperature.toFixed(1)}°C</Text>
            </View>
            
            <View style={styles.forecastItem}>
              <Ionicons name="water" size={16} color={getHumidityColor(item.relativeHumidity)} />
              <Text style={styles.forecastValue}>{item.relativeHumidity.toFixed(1)}%</Text>
            </View>
            
            <View style={styles.forecastItem}>
              <Ionicons name="cloud" size={16} color="#666" />
              <Text style={styles.forecastValue}>{(item.cloudFraction * 100).toFixed(0)}%</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTimeSeries = () => (
    <View style={styles.dataContainer}>
      <Text style={styles.sectionTitle}>Série Temporal AIRS</Text>
      
      {timeSeries.slice(0, 7).map((item, index) => (
        <View key={index} style={styles.timeSeriesCard}>
          <Text style={styles.timeSeriesDate}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
          
          <View style={styles.timeSeriesData}>
            <View style={styles.timeSeriesItem}>
              <Text style={styles.timeSeriesLabel}>Temp:</Text>
              <Text style={[styles.timeSeriesValue, { color: getTemperatureColor(item.surfaceTemperature) }]}>
                {item.surfaceTemperature.toFixed(1)}°C
              </Text>
            </View>
            
            <View style={styles.timeSeriesItem}>
              <Text style={styles.timeSeriesLabel}>Umidade:</Text>
              <Text style={[styles.timeSeriesValue, { color: getHumidityColor(item.relativeHumidity) }]}>
                {item.relativeHumidity.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="cloud-download" size={32} color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando dados AIRS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NASA AIRS</Text>
        <Text style={styles.subtitle}>Dados Atmosféricos</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedView === 'current' && styles.activeTab]}
          onPress={() => setSelectedView('current')}
        >
          <Text style={[styles.tabText, selectedView === 'current' && styles.activeTabText]}>
            Atual
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedView === 'forecast' && styles.activeTab]}
          onPress={() => setSelectedView('forecast')}
        >
          <Text style={[styles.tabText, selectedView === 'forecast' && styles.activeTabText]}>
            Previsão
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedView === 'timeseries' && styles.activeTab]}
          onPress={() => setSelectedView('timeseries')}
        >
          <Text style={[styles.tabText, selectedView === 'timeseries' && styles.activeTabText]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedView === 'current' && renderCurrentData()}
        {selectedView === 'forecast' && renderForecast()}
        {selectedView === 'timeseries' && renderTimeSeries()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  dataContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dataCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  dataCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  qualityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '48%',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  forecastCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  forecastDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  forecastTime: {
    fontSize: 12,
    color: '#666',
  },
  forecastData: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastValue: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeSeriesCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeSeriesDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  timeSeriesData: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeSeriesItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSeriesLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  timeSeriesValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AIRSDataVisualization;
