import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, getAQIColor, getAQILevel, getAQIDescription } from '../theme';
import AnimatedSprout from '../components/AnimatedSprout';

const { width } = Dimensions.get('window');

interface SoilData {
  moisture: number;
  ph: number;
  temperature: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  airQuality: {
    aqi: number;
    level: string;
    color: string;
  };
}

const SoilScreen: React.FC = () => {
  const [soilData, setSoilData] = useState<SoilData>({
    moisture: 65,
    ph: 6.5,
    temperature: 22,
    nutrients: {
      nitrogen: 45,
      phosphorus: 32,
      potassium: 28,
    },
    airQuality: {
      aqi: 85,
      level: 'Moderado',
      color: getAQIColor(85),
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getSoilHealthStatus = () => {
    const { moisture, ph, nutrients } = soilData;
    
    if (moisture < 30 || moisture > 80) {
      return { status: 'Crítico', color: colors.error, icon: 'warning' };
    } else if (ph < 6.0 || ph > 7.5) {
      return { status: 'Atenção', color: colors.warning, icon: 'alert-circle' };
    } else if (nutrients.nitrogen < 40 || nutrients.phosphorus < 30 || nutrients.potassium < 25) {
      return { status: 'Cuidado', color: colors.warning, icon: 'leaf' };
    } else {
      return { status: 'Saudável', color: colors.success, icon: 'checkmark-circle' };
    }
  };

  const getSproutColor = () => {
    const { airQuality } = soilData;
    
    if (airQuality.aqi <= 50) {
      return colors.aqi.good; // Verde saudável
    } else if (airQuality.aqi <= 100) {
      return colors.aqi.moderate; // Laranja moderado
    } else if (airQuality.aqi <= 150) {
      return colors.aqi.unhealthy; // Vermelho insalubre
    } else {
      return colors.aqi.veryUnhealthy; // Roxo muito insalubre
    }
  };

  const soilHealth = getSoilHealthStatus();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Analisando solo...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com Broto Animado */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Monitor de Solo</Text>
          <Text style={styles.subtitle}>Saúde da sua planta em tempo real</Text>
          
          {/* Broto Animado */}
          <View style={styles.sproutContainer}>
            <AnimatedSprout 
              color={getSproutColor()}
              size={120}
              airQuality={soilData.airQuality.aqi}
            />
          </View>
          
          <View style={styles.airQualityBadge}>
            <Ionicons 
              name="leaf" 
              size={20} 
              color={colors.white} 
            />
            <Text style={styles.airQualityText}>
              AQI: {soilData.airQuality.aqi} - {soilData.airQuality.level}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Status Geral do Solo */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons 
            name={soilHealth.icon as any} 
            size={24} 
            color={soilHealth.color} 
          />
          <Text style={[styles.statusText, { color: soilHealth.color }]}>
            Solo {soilHealth.status}
          </Text>
        </View>
        <Text style={styles.statusDescription}>
          {soilHealth.status === 'Saudável' 
            ? 'Seu solo está em excelente condição para o crescimento das plantas.'
            : 'Seu solo precisa de atenção. Verifique as recomendações abaixo.'
          }
        </Text>
      </View>

      {/* Métricas do Solo */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Métricas do Solo</Text>
        
        <View style={styles.metricsGrid}>
          {/* Umidade */}
          <View style={styles.metricCard}>
            <Ionicons name="water" size={24} color={colors.secondary} />
            <Text style={styles.metricLabel}>Umidade</Text>
            <Text style={styles.metricValue}>{soilData.moisture}%</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${soilData.moisture}%`,
                    backgroundColor: soilData.moisture > 70 ? colors.success : 
                                   soilData.moisture > 40 ? colors.warning : colors.error
                  }
                ]} 
              />
            </View>
          </View>

          {/* pH */}
          <View style={styles.metricCard}>
            <Ionicons name="flask" size={24} color={colors.primary} />
            <Text style={styles.metricLabel}>pH</Text>
            <Text style={styles.metricValue}>{soilData.ph}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(soilData.ph / 8) * 100}%`,
                    backgroundColor: soilData.ph >= 6 && soilData.ph <= 7 ? colors.success : colors.warning
                  }
                ]} 
              />
            </View>
          </View>

          {/* Temperatura */}
          <View style={styles.metricCard}>
            <Ionicons name="thermometer" size={24} color={colors.error} />
            <Text style={styles.metricLabel}>Temperatura</Text>
            <Text style={styles.metricValue}>{soilData.temperature}°C</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(soilData.temperature / 35) * 100}%`,
                    backgroundColor: soilData.temperature >= 18 && soilData.temperature <= 25 ? colors.success : colors.warning
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      {/* Nutrientes */}
      <View style={styles.nutrientsContainer}>
        <Text style={styles.sectionTitle}>Nutrientes Essenciais</Text>
        
        <View style={styles.nutrientCard}>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientLabel}>Nitrogênio (N)</Text>
            <View style={styles.nutrientBar}>
              <View 
                style={[
                  styles.nutrientFill, 
                  { 
                    width: `${soilData.nutrients.nitrogen}%`,
                    backgroundColor: colors.success
                  }
                ]} 
              />
            </View>
            <Text style={styles.nutrientValue}>{soilData.nutrients.nitrogen}%</Text>
          </View>

          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientLabel}>Fósforo (P)</Text>
            <View style={styles.nutrientBar}>
              <View 
                style={[
                  styles.nutrientFill, 
                  { 
                    width: `${soilData.nutrients.phosphorus}%`,
                    backgroundColor: colors.warning
                  }
                ]} 
              />
            </View>
            <Text style={styles.nutrientValue}>{soilData.nutrients.phosphorus}%</Text>
          </View>

          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientLabel}>Potássio (K)</Text>
            <View style={styles.nutrientBar}>
              <View 
                style={[
                  styles.nutrientFill, 
                  { 
                    width: `${soilData.nutrients.potassium}%`,
                    backgroundColor: colors.info
                  }
                ]} 
              />
            </View>
            <Text style={styles.nutrientValue}>{soilData.nutrients.potassium}%</Text>
          </View>
        </View>
      </View>

      {/* Recomendações */}
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Recomendações</Text>
        
        <View style={styles.recommendationCard}>
          <Ionicons name="bulb" size={20} color={colors.warning} />
          <Text style={styles.recommendationText}>
            {soilData.moisture < 40 
              ? 'Regue suas plantas - o solo está seco'
              : soilData.moisture > 80
              ? 'Reduza a rega - o solo está muito úmido'
              : 'Mantenha a rega atual'
            }
          </Text>
        </View>

        <View style={styles.recommendationCard}>
          <Ionicons name="leaf" size={20} color={colors.primary} />
          <Text style={styles.recommendationText}>
            {soilData.airQuality.aqi > 100 
              ? 'Evite atividades ao ar livre - qualidade do ar ruim'
              : 'Qualidade do ar adequada para suas plantas'
            }
          </Text>
        </View>

        <View style={styles.recommendationCard}>
          <Ionicons name="nutrition" size={20} color={colors.secondary} />
          <Text style={styles.recommendationText}>
            {soilData.nutrients.phosphorus < 30 
              ? 'Considere adicionar fertilizante rico em fósforo'
              : 'Níveis de nutrientes adequados'
            }
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text.secondary,
    fontFamily: 'System',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  sproutContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  airQualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  airQualityText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusCard: {
    backgroundColor: colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statusDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: colors.surface,
    width: (width - 50) / 3,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  nutrientsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  nutrientCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutrientItem: {
    marginBottom: 15,
  },
  nutrientLabel: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  nutrientBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  nutrientFill: {
    height: '100%',
    borderRadius: 4,
  },
  nutrientValue: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  recommendationsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 10,
    lineHeight: 20,
  },
});

export default SoilScreen;
