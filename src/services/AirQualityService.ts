import * as Location from 'expo-location';
import { getAQIColor, getAQILevel, getAQIDescription, getAQIRecommendations } from '../theme';
import config from '../config/environment';

export interface AirQualityData {
  aqi: number;
  level: string;
  color: string;
  description: string;
  recommendations: string[];
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    co?: number;
    so2?: number;
  };
}

export interface ForecastData {
  date: string;
  time?: string;
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

class AirQualityService {
  private static instance: AirQualityService;

  public static getInstance(): AirQualityService {
    if (!AirQualityService.instance) {
      AirQualityService.instance = new AirQualityService();
    }
    return AirQualityService.instance;
  }

  /**
   * Obtém dados de qualidade do ar para a localização atual
   */
  async getCurrentAirQuality(): Promise<AirQualityData> {
    try {
      const location = await this.getCurrentLocation();
      return await this.getAirQualityByLocation(location.latitude, location.longitude);
    } catch (error) {
      console.error('Erro ao obter qualidade do ar atual:', error);
      throw error;
    }
  }

  /**
   * Obtém dados de qualidade do ar para coordenadas específicas
   */
  async getAirQualityByLocation(latitude: number, longitude: number): Promise<AirQualityData> {
    // Em produção, integrar com APIs reais como OpenWeatherMap, AirVisual, FIRMS (NASA), etc.
    // Por enquanto, geramos dados simulados específicos para Mato Grosso
    const aqi = this.generateMTBasedAQI(latitude, longitude);
    const color = getAQIColor(aqi);
    const level = getAQILevel(aqi);
    const description = getAQIDescription(aqi);
    const recommendations = getAQIRecommendations(aqi);

    return {
      aqi,
      level,
      color,
      description,
      recommendations,
      location: {
        latitude,
        longitude,
        address: this.getMTLocationName(latitude, longitude)
      },
      timestamp: new Date().toISOString(),
      pollutants: {
        pm25: this.generateMTPollutant(aqi, 'pm25'),
        pm10: this.generateMTPollutant(aqi, 'pm10'),
        o3: this.generateMTPollutant(aqi, 'o3'),
        no2: this.generateMTPollutant(aqi, 'no2'),
        co: this.generateMTPollutant(aqi, 'co'),
        so2: this.generateMTPollutant(aqi, 'so2'),
      }
    };
  }

  /**
   * Obtém previsão de qualidade do ar
   */
  async getAirQualityForecast(days: number = 7): Promise<ForecastData[]> {
    const forecast: ForecastData[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const aqi = this.generateRandomAQI();
      const color = getAQIColor(aqi);
      const level = getAQILevel(aqi);
      const description = getAQIDescription(aqi);

      forecast.push({
        date: date.toISOString().split('T')[0],
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
        }
      });
    }

    return forecast;
  }

  /**
   * Obtém previsão horária de qualidade do ar para 24 horas
   */
  async getHourlyAirQualityForecast(): Promise<ForecastData[]> {
    const forecast: ForecastData[] = [];

    for (let hour = 0; hour < 24; hour++) {
      const aqi = this.generateRandomAQI();
      const color = getAQIColor(aqi);
      const level = getAQILevel(aqi);
      const description = getAQIDescription(aqi);

      forecast.push({
        date: `${hour}:00`,
        time: `${hour}:00`,
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
        }
      });
    }

    return forecast;
  }

  /**
   * Obtém localização atual do usuário
   */
  private async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permissão de localização negada');
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
  }

  /**
   * Gera AQI baseado na localização de Mato Grosso
   */
  private generateMTBasedAQI(latitude: number, longitude: number): number {
    // Coordenadas de Cuiabá como centro
    const cuiabaLat = -15.6014;
    const cuiabaLng = -56.0979;
    
    // Distância do centro de Cuiabá
    const distance = Math.sqrt(
      Math.pow(latitude - cuiabaLat, 2) + Math.pow(longitude - cuiabaLng, 2)
    );
    
    // Simular efeito de queimadas (maior distância = mais queimadas = pior AQI)
    const baseAQI = 80; // AQI base para Cuiabá
    const fireEffect = Math.min(distance * 1000, 150); // Efeito das queimadas
    const randomVariation = (Math.random() - 0.5) * 40; // Variação aleatória
    
    return Math.max(50, Math.min(300, Math.floor(baseAQI + fireEffect + randomVariation)));
  }

  /**
   * Gera nome da localização em Mato Grosso
   */
  private getMTLocationName(latitude: number, longitude: number): string {
    const locations = [
      'Cuiabá, MT',
      'Várzea Grande, MT',
      'Rondonópolis, MT',
      'Sinop, MT',
      'Tangará da Serra, MT',
      'Cáceres, MT',
      'Sorriso, MT',
      'Lucas do Rio Verde, MT',
      'Primavera do Leste, MT',
      'Barra do Garças, MT',
      'Alta Floresta, MT',
      'Pontes e Lacerda, MT',
      'Nova Mutum, MT',
      'Campo Verde, MT',
      'Sapezal, MT'
    ];
    
    // Selecionar localização baseada nas coordenadas
    const index = Math.floor(Math.abs(latitude + longitude) * 100) % locations.length;
    return locations[index];
  }

  /**
   * Gera poluentes específicos para Mato Grosso
   */
  private generateMTPollutant(aqi: number, pollutant: string): number {
    const baseValues = {
      pm25: aqi * 0.6, // Material particulado alto devido às queimadas
      pm10: aqi * 0.8,
      o3: aqi * 0.7,
      no2: aqi * 0.4,
      co: aqi * 0.1,
      so2: aqi * 0.3
    };
    
    const variation = (Math.random() - 0.5) * 20; // ±10% de variação
    return Math.max(0, Math.floor(baseValues[pollutant as keyof typeof baseValues] + variation));
  }

  /**
   * Gera AQI aleatório para simulação (método legado)
   */
  private generateRandomAQI(): number {
    // Gera AQI entre 20 e 250, com distribuição mais realística
    const random = Math.random();
    
    if (random < 0.4) {
      // 40% chance de AQI bom (20-50)
      return Math.floor(Math.random() * 31) + 20;
    } else if (random < 0.7) {
      // 30% chance de AQI moderado (51-100)
      return Math.floor(Math.random() * 50) + 51;
    } else if (random < 0.9) {
      // 20% chance de AQI insalubre (101-150)
      return Math.floor(Math.random() * 50) + 101;
    } else {
      // 10% chance de AQI muito insalubre (151-250)
      return Math.floor(Math.random() * 100) + 151;
    }
  }

  /**
   * Valida se AQI está dentro dos limites aceitáveis
   */
  static isValidAQI(aqi: number): boolean {
    return aqi >= 0 && aqi <= 500;
  }

  /**
   * Converte AQI para concentração de poluente (aproximado)
   */
  static aqiToConcentration(aqi: number, pollutant: 'pm25' | 'pm10' | 'o3' | 'no2'): number {
    // Valores aproximados baseados na tabela de conversão EPA
    switch (pollutant) {
      case 'pm25':
        return aqi * 0.5; // µg/m³
      case 'pm10':
        return aqi * 0.8; // µg/m³
      case 'o3':
        return aqi * 0.8; // µg/m³
      case 'no2':
        return aqi * 0.5; // µg/m³
      default:
        return 0;
    }
  }
}

export default AirQualityService;

