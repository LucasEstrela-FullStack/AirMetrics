import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ForecastData {
  date: string;
  day: string;
  aqi: number;
  level: string;
  color: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
  };
}

const ForecastScreen = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<'7days' | '24hours'>('7days');

  useEffect(() => {
    generateMockForecastData();
  }, [timeRange]);

  const generateMockForecastData = () => {
    const data: ForecastData[] = [];
    const today = new Date();

    if (timeRange === '7days') {
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        const aqi = Math.floor(Math.random() * 200) + 30;
        let level, color, description;
        
        if (aqi <= 50) {
          level = 'Bom';
          color = '#4CAF50';
          description = 'Ideal para atividades ao ar livre';
        } else if (aqi <= 100) {
          level = 'Moderado';
          color = '#FF9800';
          description = 'Pessoas sensíveis devem ter cuidado';
        } else if (aqi <= 150) {
          level = 'Insalubre';
          color = '#F44336';
          description = 'Evite atividades ao ar livre';
        } else {
          level = 'Muito Insalubre';
          color = '#9C27B0';
          description = 'Mantenha-se em ambientes fechados';
        }

        data.push({
          date: date.toISOString().split('T')[0],
          day: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          aqi,
          level,
          color,
          description,
          temperature: Math.floor(Math.random() * 15) + 20,
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 15) + 5,
          pollutants: {
            pm25: Math.floor(Math.random() * 40) + 10,
            pm10: Math.floor(Math.random() * 60) + 20,
            o3: Math.floor(Math.random() * 80) + 30,
            no2: Math.floor(Math.random() * 50) + 15,
          },
        });
      }
    } else {
      // 24 horas - dados por hora
      for (let i = 0; i < 24; i++) {
        const hour = i;
        const aqi = Math.floor(Math.random() * 150) + 40;
        let level, color, description;
        
        if (aqi <= 50) {
          level = 'Bom';
          color = '#4CAF50';
        } else if (aqi <= 100) {
          level = 'Moderado';
          color = '#FF9800';
        } else {
          level = 'Insalubre';
          color = '#F44336';
        }
        
        description = `Hora ${hour}:00`;

        data.push({
          date: `${hour}:00`,
          day: `${hour}h`,
          aqi,
          level,
          color,
          description,
          temperature: Math.floor(Math.random() * 10) + 22,
          humidity: Math.floor(Math.random() * 30) + 50,
          windSpeed: Math.floor(Math.random() * 10) + 8,
          pollutants: {
            pm25: Math.floor(Math.random() * 30) + 15,
            pm10: Math.floor(Math.random() * 40) + 25,
            o3: Math.floor(Math.random() * 60) + 35,
            no2: Math.floor(Math.random() * 35) + 20,
          },
        });
      }
    }

    setForecastData(data);
  };

  const getWeatherIcon = (level: string, hour?: number) => {
    if (timeRange === '24hours' && hour !== undefined) {
      if (hour >= 6 && hour < 18) {
        return level === 'Bom' ? 'sunny-outline' : 'partly-sunny-outline';
      } else {
        return 'moon-outline';
      }
    }
    
    switch (level) {
      case 'Bom':
        return 'sunny-outline';
      case 'Moderado':
        return 'partly-sunny-outline';
      default:
        return 'cloudy-outline';
    }
  };

  const getRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return [
        'Ideal para atividades ao ar livre',
        'Ventile bem sua casa',
        'Exercite-se ao ar livre'
      ];
    } else if (aqi <= 100) {
      return [
        'Pessoas sensíveis devem ter cuidado',
        'Evite exercícios intensos ao ar livre',
        'Mantenha janelas abertas'
      ];
    } else if (aqi <= 150) {
      return [
        'Evite atividades ao ar livre',
        'Use máscara se necessário',
        'Mantenha janelas fechadas'
      ];
    } else {
      return [
        'Mantenha-se em ambientes fechados',
        'Use purificador de ar',
        'Evite exercícios ao ar livre'
      ];
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }} nestedScrollEnabled>
      {/* Header com seletor de tempo */}
      <View style={styles.header}>
        <Text style={styles.title}>Previsão da Qualidade do Ar</Text>
        <View style={styles.timeRangeSelector}>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === '7days' && styles.timeRangeButtonActive
            ]}
            onPress={() => setTimeRange('7days')}
          >
            <Text style={[
              styles.timeRangeText,
              timeRange === '7days' && styles.timeRangeTextActive
            ]}>
              7 dias
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === '24hours' && styles.timeRangeButtonActive
            ]}
            onPress={() => setTimeRange('24hours')}
          >
            <Text style={[
              styles.timeRangeText,
              timeRange === '24hours' && styles.timeRangeTextActive
            ]}>
              24h
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        {/* Gráfico de linha simples */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Tendência do AQI</Text>
          <View style={styles.chart}>
            {forecastData.map((item, index) => (
              <View key={index} style={styles.chartPoint}>
                <View style={[
                  styles.chartDot,
                  { backgroundColor: item.color }
                ]} />
                {index < forecastData.length - 1 && (
                  <View style={[
                    styles.chartLine,
                    { backgroundColor: item.color }
                  ]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Lista de previsões */}
        <View style={styles.forecastList}>
          {forecastData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.forecastItem,
                selectedDay === index && styles.forecastItemSelected
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <View style={styles.forecastLeft}>
                <Text style={styles.forecastDay}>{item.day}</Text>
                <Text style={styles.forecastDate}>{item.date}</Text>
              </View>
              
              <View style={styles.forecastCenter}>
                <Ionicons
                  name={getWeatherIcon(item.level, timeRange === '24hours' ? parseInt(item.date.split(':')[0]) : undefined) as any}
                  size={24}
                  color={item.color}
                />
                <Text style={[styles.forecastAQI, { color: item.color }]}>
                  {item.aqi}
                </Text>
              </View>
              
              <View style={styles.forecastRight}>
                <Text style={styles.forecastLevel}>{item.level}</Text>
                <Text style={styles.forecastTemp}>{item.temperature}°C</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Detalhes do dia selecionado */}
        {forecastData[selectedDay] && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              {timeRange === '7days' ? 'Detalhes do Dia' : 'Detalhes da Hora'}
            </Text>
            
            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="thermometer-outline" size={20} color="#FF6B35" />
                <Text style={styles.detailLabel}>Temperatura</Text>
                <Text style={styles.detailValue}>{forecastData[selectedDay].temperature}°C</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={20} color="#2196F3" />
                <Text style={styles.detailLabel}>Umidade</Text>
                <Text style={styles.detailValue}>{forecastData[selectedDay].humidity}%</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
                <Text style={styles.detailLabel}>Vento</Text>
                <Text style={styles.detailValue}>{forecastData[selectedDay].windSpeed} km/h</Text>
              </View>
            </View>

            <View style={styles.pollutantsSection}>
              <Text style={styles.pollutantsTitle}>Poluentes</Text>
              <View style={styles.pollutantsGrid}>
                <View style={styles.pollutantItem}>
                  <Text style={styles.pollutantLabel}>PM2.5</Text>
                  <Text style={styles.pollutantValue}>
                    {forecastData[selectedDay].pollutants.pm25} µg/m³
                  </Text>
                </View>
                <View style={styles.pollutantItem}>
                  <Text style={styles.pollutantLabel}>PM10</Text>
                  <Text style={styles.pollutantValue}>
                    {forecastData[selectedDay].pollutants.pm10} µg/m³
                  </Text>
                </View>
                <View style={styles.pollutantItem}>
                  <Text style={styles.pollutantLabel}>O₃</Text>
                  <Text style={styles.pollutantValue}>
                    {forecastData[selectedDay].pollutants.o3} µg/m³
                  </Text>
                </View>
                <View style={styles.pollutantItem}>
                  <Text style={styles.pollutantLabel}>NO₂</Text>
                  <Text style={styles.pollutantValue}>
                    {forecastData[selectedDay].pollutants.no2} µg/m³
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.recommendationsSection}>
              <Text style={styles.recommendationsTitle}>Recomendações</Text>
              {getRecommendations(forecastData[selectedDay].aqi).map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: 'white',
  },
  chartContainer: {
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
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  chartPoint: {
    alignItems: 'center',
    flex: 1,
  },
  chartDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartLine: {
    height: 2,
    width: '100%',
    marginTop: 2,
  },
  forecastList: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  forecastItemSelected: {
    backgroundColor: '#f8f9fa',
  },
  forecastLeft: {
    flex: 1,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  forecastCenter: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  forecastAQI: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  forecastRight: {
    alignItems: 'flex-end',
  },
  forecastLevel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  forecastTemp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detailCard: {
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
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pollutantsSection: {
    marginBottom: 20,
  },
  pollutantsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pollutantItem: {
    width: '48%',
    marginBottom: 10,
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
  recommendationsSection: {
    marginTop: 10,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
});

export default ForecastScreen;
