import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import worldViewService, { WorldViewLayer, WorldViewImage, WorldViewTimeSeries } from '../services/WorldViewService';

const { width } = Dimensions.get('window');

interface WorldViewVisualizationProps {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  onDataLoaded?: (data: WorldViewImage[]) => void;
}

const WorldViewVisualization: React.FC<WorldViewVisualizationProps> = ({ 
  bounds, 
  onDataLoaded 
}) => {
  const [loading, setLoading] = useState(false);
  const [layers, setLayers] = useState<WorldViewLayer[]>([]);
  const [images, setImages] = useState<WorldViewImage[]>([]);
  const [timeSeries, setTimeSeries] = useState<WorldViewTimeSeries[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('');
  const [selectedView, setSelectedView] = useState<'layers' | 'images' | 'timeseries'>('layers');

  useEffect(() => {
    loadWorldViewData();
  }, []);

  const loadWorldViewData = async () => {
    setLoading(true);
    try {
      console.log('🌍 Carregando dados WorldView...');
      
      // Autenticar
      const authenticated = await worldViewService.authenticate();
      if (!authenticated) {
        Alert.alert('Erro', 'Falha na autenticação com NASA WorldView');
        return;
      }

      // Buscar camadas disponíveis
      const availableLayers = await worldViewService.getAvailableLayers();
      setLayers(availableLayers);
      
      if (availableLayers.length > 0) {
        setSelectedLayer(availableLayers[0].id);
      }

      onDataLoaded?.([]);
      
      console.log('✅ Dados WorldView carregados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar dados WorldView:', error);
      Alert.alert('Erro', 'Falha ao carregar dados WorldView');
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async (layerId: string) => {
    try {
      setLoading(true);
      
      const request = {
        layers: [layerId],
        bounds,
        date: new Date().toISOString().split('T')[0],
        format: 'PNG',
        projection: 'EPSG:4326',
        resolution: 1000
      };
      
      const imagesData = await worldViewService.getImages(request);
      setImages(imagesData);
      
    } catch (error) {
      console.error('❌ Erro ao carregar imagens:', error);
      Alert.alert('Erro', 'Falha ao carregar imagens');
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSeries = async (layerId: string) => {
    try {
      setLoading(true);
      
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const timeSeriesData = await worldViewService.getTimeSeries(layerId, bounds, startDate, endDate);
      setTimeSeries([timeSeriesData]);
      
    } catch (error) {
      console.error('❌ Erro ao carregar série temporal:', error);
      Alert.alert('Erro', 'Falha ao carregar série temporal');
    } finally {
      setLoading(false);
    }
  };

  const getLayerIcon = (category: string) => {
    switch (category) {
      case 'Aerosols': return 'cloud';
      case 'Fires': return 'flame';
      case 'Imagery': return 'image';
      default: return 'layers';
    }
  };

  const getLayerColor = (category: string) => {
    switch (category) {
      case 'Aerosols': return '#4CAF50';
      case 'Fires': return '#FF5722';
      case 'Imagery': return '#2196F3';
      default: return '#666';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderLayers = () => (
    <View style={styles.dataContainer}>
      <Text style={styles.sectionTitle}>Camadas Disponíveis</Text>
      
      {layers.map((layer, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.layerCard,
            selectedLayer === layer.id && styles.selectedLayerCard
          ]}
          onPress={() => setSelectedLayer(layer.id)}
        >
          <View style={styles.layerHeader}>
            <View style={styles.layerIconContainer}>
              <Ionicons 
                name={getLayerIcon(layer.category)} 
                size={24} 
                color={getLayerColor(layer.category)} 
              />
            </View>
            <View style={styles.layerInfo}>
              <Text style={styles.layerName}>{layer.name}</Text>
              <Text style={styles.layerDescription}>{layer.description}</Text>
              <Text style={styles.layerCategory}>{layer.category}</Text>
            </View>
          </View>
          
          <View style={styles.layerDetails}>
            <View style={styles.layerDetail}>
              <Text style={styles.layerDetailLabel}>Resolução:</Text>
              <Text style={styles.layerDetailValue}>{layer.resolution}</Text>
            </View>
            <View style={styles.layerDetail}>
              <Text style={styles.layerDetailLabel}>Formato:</Text>
              <Text style={styles.layerDetailValue}>{layer.format}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderImages = () => (
    <View style={styles.dataContainer}>
      <Text style={styles.sectionTitle}>Imagens de Satélite</Text>
      
      {images.map((image, index) => (
        <View key={index} style={styles.imageCard}>
          <View style={styles.imageHeader}>
            <Text style={styles.imageName}>{image.layerName}</Text>
            <Text style={styles.imageDate}>{image.date}</Text>
          </View>
          
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image.thumbnailUrl }}
              style={styles.imageThumbnail}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.imageDetails}>
            <View style={styles.imageDetail}>
              <Ionicons name="resize" size={16} color="#666" />
              <Text style={styles.imageDetailText}>{image.resolution}m</Text>
            </View>
            <View style={styles.imageDetail}>
              <Ionicons name="document" size={16} color="#666" />
              <Text style={styles.imageDetailText}>{formatFileSize(image.size)}</Text>
            </View>
            <View style={styles.imageDetail}>
              <Ionicons name="satellite" size={16} color="#666" />
              <Text style={styles.imageDetailText}>{image.metadata.satellite}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTimeSeries = () => (
    <View style={styles.dataContainer}>
      <Text style={styles.sectionTitle}>Série Temporal</Text>
      
      {timeSeries.map((series, index) => (
        <View key={index} style={styles.timeSeriesCard}>
          <Text style={styles.timeSeriesName}>{series.layerName}</Text>
          <Text style={styles.timeSeriesDateRange}>
            {series.dateRange.start} - {series.dateRange.end}
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {series.images.map((image, imgIndex) => (
              <View key={imgIndex} style={styles.timeSeriesImage}>
                <Image
                  source={{ uri: image.thumbnailUrl }}
                  style={styles.timeSeriesThumbnail}
                  resizeMode="cover"
                />
                <Text style={styles.timeSeriesImageDate}>{image.date}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="satellite" size={32} color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando dados WorldView...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NASA WorldView</Text>
        <Text style={styles.subtitle}>Imagens de Satélite</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedView === 'layers' && styles.activeTab]}
          onPress={() => setSelectedView('layers')}
        >
          <Text style={[styles.tabText, selectedView === 'layers' && styles.activeTabText]}>
            Camadas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedView === 'images' && styles.activeTab]}
          onPress={() => setSelectedView('images')}
        >
          <Text style={[styles.tabText, selectedView === 'images' && styles.activeTabText]}>
            Imagens
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedView === 'timeseries' && styles.activeTab]}
          onPress={() => setSelectedView('timeseries')}
        >
          <Text style={[styles.tabText, selectedView === 'timeseries' && styles.activeTabText]}>
            Temporal
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionContainer}>
        {selectedLayer && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => loadImages(selectedLayer)}
            >
              <Ionicons name="image" size={16} color="white" />
              <Text style={styles.actionButtonText}>Carregar Imagens</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => loadTimeSeries(selectedLayer)}
            >
              <Ionicons name="time" size={16} color="#4CAF50" />
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                Série Temporal
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedView === 'layers' && renderLayers()}
        {selectedView === 'images' && renderImages()}
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
    backgroundColor: '#2196F3',
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
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  secondaryButtonText: {
    color: '#2196F3',
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
    marginBottom: 16,
  },
  layerCard: {
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
  selectedLayerCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  layerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  layerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  layerInfo: {
    flex: 1,
  },
  layerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  layerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  layerCategory: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  layerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  layerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  layerDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  layerDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  imageCard: {
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
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  imageDate: {
    fontSize: 12,
    color: '#666',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  imageThumbnail: {
    width: width - 64,
    height: 200,
    borderRadius: 8,
  },
  imageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageDetailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
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
  timeSeriesName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timeSeriesDateRange: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  timeSeriesImage: {
    marginRight: 12,
    alignItems: 'center',
  },
  timeSeriesThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  timeSeriesImageDate: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

export default WorldViewVisualization;
