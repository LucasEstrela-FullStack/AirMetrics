import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tempoService, { TEMPOData, TEMPOTimeSeries, TEMPOSpatialMean } from '../services/TEMPOService';

const { width } = Dimensions.get('window');

interface TEMPODataVisualizationProps {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  onDataLoaded?: (data: TEMPOData[]) => void;
}

const TEMPODataVisualization: React.FC<TEMPODataVisualizationProps> = ({ 
  bounds, 
  onDataLoaded 
}) => {
  const [loading, setLoading] = useState(false);
  const [tempoData, setTempoData] = useState<TEMPOData[]>([]);
  const [timeSeries, setTimeSeries] = useState<TEMPOTimeSeries[]>([]);
  const [spatialMeans, setSpatialMeans] = useState<Map<string, TEMPOSpatialMean>>(new Map());
  const [selectedView, setSelectedView] = useState<'temporal' | 'spatial' | 'subset'>('temporal');
  const [granulesCount, setGranulesCount] = useState(0);

  useEffect(() => {
    loadTEMPOData();
  }, []);

  const loadTEMPOData = async () => {
    setLoading(true);
    try {
      console.log('🛰️ Carregando dados TEMPO...');
      
      // Autenticar
      const authenticated = await tempoService.authenticate();
      if (!authenticated) {
        Alert.alert('Erro', 'Falha na autenticação com NASA EarthData');
        return;
      }

      // Buscar grânulos da última semana
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const granules = await tempoService.searchTEMPOGranules(startDate, endDate, bounds);
      setGranulesCount(granules.length);

      // Abrir dataset virtual
      const data = await tempoService.openVirtualMultiFileDataset(granules);
      setTempoData(data);

      // Calcular médias temporais
      const temporalMeans = await tempoService.calculateTemporalMean(data);
      setSpatialMeans(temporalMeans);

      // Calcular médias espaciais
      const spatialMeansData = await tempoService.calculateSpatialMean(data, bounds);
      setTimeSeries(spatialMeansData);

      onDataLoaded?.(data);
      
      console.log('✅ Dados TEMPO carregados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar dados TEMPO:', error);
      Alert.alert('Erro', 'Falha ao carregar dados TEMPO');
    } finally {
      setLoading(false);
    }
  };

  const getNO2Level = (value: number): { level: string; color: string; description: string } => {
    if (value < 0.2) {
      return { level: 'Baixo', color: '#4CAF50', description: 'Qualidade do ar boa' };
    } else if (value < 0.4) {
      return { level: 'Moderado', color: '#FF9800', description: 'Qualidade do ar moderada' };
    } else if (value < 0.6) {
      return { level: 'Alto', color: '#F44336', description: 'Qualidade do ar ruim' };
    } else {
      return { level: 'Muito Alto', color: '#9C27B0', description: 'Qualidade do ar muito ruim' };
    }
  };

  const renderTemporalMean = () => {
    if (spatialMeans.size === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Média Temporal - Mapa Anual</Text>
        <Text style={styles.sectionSubtitle}>
          Médias anuais de NO₂ troposférico (mol/m²)
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.spatialMeansContainer}>
            {Array.from(spatialMeans.entries()).slice(0, 10).map(([location, data]) => {
              const no2Level = getNO2Level(data.annualMean);
              return (
                <View key={location} style={styles.spatialMeanCard}>
                  <View style={styles.spatialMeanHeader}>
                    <View style={[styles.qualityIndicator, { backgroundColor: no2Level.color }]} />
                    <Text style={styles.locationText}>
                      {data.latitude.toFixed(2)}°, {data.longitude.toFixed(2)}°
                    </Text>
                  </View>
                  
                  <Text style={styles.meanValue}>
                    {data.annualMean.toFixed(3)} mol/m²
                  </Text>
                  
                  <Text style={[styles.qualityText, { color: no2Level.color }]}>
                    {no2Level.level}
                  </Text>
                  
                  <View style={styles.dataQualityRow}>
                    <Ionicons 
                      name={data.dataQuality === 'high' ? 'checkmark-circle' : 
                           data.dataQuality === 'medium' ? 'warning' : 'alert-circle'} 
                      size={16} 
                      color={data.dataQuality === 'high' ? '#4CAF50' : 
                            data.dataQuality === 'medium' ? '#FF9800' : '#F44336'} 
                    />
                    <Text style={styles.dataQualityText}>
                      Qualidade: {data.dataQuality}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSpatialMean = () => {
    if (timeSeries.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Média Espacial - Série Temporal</Text>
        <Text style={styles.sectionSubtitle}>
          Médias de área ao longo do tempo
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.timeSeriesContainer}>
            {timeSeries.slice(0, 7).map((data, index) => {
              const no2Level = getNO2Level(data.meanValue);
              return (
                <View key={index} style={styles.timeSeriesCard}>
                  <Text style={styles.timeLabel}>
                    {new Date(data.timestamp).toLocaleDateString('pt-BR')}
                  </Text>
                  
                  <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>
                      {data.meanValue.toFixed(3)}
                    </Text>
                    <Text style={styles.unitText}>mol/m²</Text>
                  </View>
                  
                  <View style={[styles.levelIndicator, { backgroundColor: no2Level.color }]}>
                    <Text style={styles.levelText}>{no2Level.level}</Text>
                  </View>
                  
                  <Text style={styles.dataPointsText}>
                    {data.dataPoints} pontos
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSubset = () => {
    if (tempoData.length === 0) return null;

    // Subset para Cuiabá, MT
    const cuiabaData = tempoData.filter(d => 
      d.latitude >= -15.7 && d.latitude <= -15.5 &&
      d.longitude >= -56.2 && d.longitude <= -56.0
    );

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Subset de Scan Único</Text>
        <Text style={styles.sectionSubtitle}>
          Dados TEMPO para região de Cuiabá, MT (raio: 50km)
        </Text>
        
        <View style={styles.subsetContainer}>
          <View style={styles.subsetStats}>
            <View style={styles.statItem}>
              <Ionicons name="location" size={20} color="#2196F3" />
              <Text style={styles.statLabel}>Pontos de Dados</Text>
              <Text style={styles.statValue}>{cuiabaData.length}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="flask" size={20} color="#4CAF50" />
              <Text style={styles.statLabel}>NO₂ Médio</Text>
              <Text style={styles.statValue}>
                {cuiabaData.length > 0 ? 
                  (cuiabaData.reduce((sum, d) => sum + d.no2Troposphere, 0) / cuiabaData.length).toFixed(3) : 
                  '0.000'
                } mol/m²
              </Text>
            </View>
          </View>
          
          {cuiabaData.slice(0, 5).map((data, index) => {
            const no2Level = getNO2Level(data.no2Troposphere);
            return (
              <View key={index} style={styles.subsetDataCard}>
                <View style={styles.subsetDataHeader}>
                  <Text style={styles.coordinatesText}>
                    {data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°
                  </Text>
                  <View style={[styles.qualityBadge, { backgroundColor: no2Level.color }]}>
                    <Text style={styles.qualityBadgeText}>{no2Level.level}</Text>
                  </View>
                </View>
                
                <View style={styles.subsetDataDetails}>
                  <Text style={styles.detailText}>
                    Troposfera: {data.no2Troposphere.toFixed(3)} mol/m²
                  </Text>
                  <Text style={styles.detailText}>
                    Total: {data.no2Total.toFixed(3)} mol/m²
                  </Text>
                  <Text style={styles.detailText}>
                    Qualidade: {data.qualityFlag ? '✅ Boa' : '❌ Baixa'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="satellite" size={48} color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando dados TEMPO...</Text>
        <Text style={styles.loadingSubtext}>Conectando com NASA EarthData</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="satellite" size={32} color="white" />
          <Text style={styles.headerTitle}>Dados TEMPO</Text>
          <Text style={styles.headerSubtitle}>
            Tropospheric Emissions: Monitoring of Pollution
          </Text>
          <Text style={styles.headerInfo}>
            🛰️ {granulesCount} grânulos • 📊 {tempoData.length} pontos de dados
          </Text>
        </View>
      </LinearGradient>

      {/* Controles de Visualização */}
      <View style={styles.controlsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, selectedView === 'temporal' && styles.controlButtonActive]}
              onPress={() => setSelectedView('temporal')}
            >
              <Ionicons name="map" size={20} color={selectedView === 'temporal' ? 'white' : '#4CAF50'} />
              <Text style={[styles.controlText, selectedView === 'temporal' && styles.controlTextActive]}>
                Média Temporal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, selectedView === 'spatial' && styles.controlButtonActive]}
              onPress={() => setSelectedView('spatial')}
            >
              <Ionicons name="trending-up" size={20} color={selectedView === 'spatial' ? 'white' : '#4CAF50'} />
              <Text style={[styles.controlText, selectedView === 'spatial' && styles.controlTextActive]}>
                Série Temporal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, selectedView === 'subset' && styles.controlButtonActive]}
              onPress={() => setSelectedView('subset')}
            >
              <Ionicons name="locate" size={20} color={selectedView === 'subset' ? 'white' : '#4CAF50'} />
              <Text style={[styles.controlText, selectedView === 'subset' && styles.controlTextActive]}>
                Subset Local
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Conteúdo da Visualização */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedView === 'temporal' && renderTemporalMean()}
        {selectedView === 'spatial' && renderSpatialMean()}
        {selectedView === 'subset' && renderSubset()}
        
        {/* Informações sobre TEMPO */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Sobre TEMPO</Text>
          <Text style={styles.infoText}>
            O TEMPO é uma missão de satélite geoestacionário que fornece medições horárias diurnas 
            da qualidade do ar sobre a América do Norte. Mede poluentes-chave incluindo dióxido de 
            nitrogênio (NO₂), formaldeído e ozônio com alta resolução espacial (~2 x 4.75 km).
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  headerInfo: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginTop: 8,
  },
  controlsContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: 'white',
  },
  controlButtonActive: {
    backgroundColor: '#4CAF50',
  },
  controlText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 6,
    fontWeight: '600',
  },
  controlTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 10,
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
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  spatialMeansContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  spatialMeanCard: {
    width: 150,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  spatialMeanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  qualityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  locationText: {
    fontSize: 10,
    color: '#666',
    flex: 1,
  },
  meanValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  dataQualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataQualityText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  timeSeriesContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  timeSeriesCard: {
    width: 120,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unitText: {
    fontSize: 10,
    color: '#666',
  },
  levelIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 6,
  },
  levelText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  dataPointsText: {
    fontSize: 10,
    color: '#666',
  },
  subsetContainer: {
    marginTop: 10,
  },
  subsetStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  subsetDataCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  subsetDataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  qualityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  qualityBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  subsetDataDetails: {
    paddingLeft: 8,
  },
  detailText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  infoSection: {
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
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default TEMPODataVisualization;
