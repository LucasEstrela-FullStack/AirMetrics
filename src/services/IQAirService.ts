// src/services/IQAirService.ts
import axios from 'axios';
import config from '../config/environment';

const IQAIR_API_KEY = config.airQuality.iqAirApiKey || '1f663bc6-d673-4c72-b9d9-7f90143c9926'; 
const BASE_URL = config.airQuality.iqAirBaseUrl;

interface IQAirCity {
  city: string;
  state: string;
  country: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  current: {
    pollution: {
      ts: string;
      aqius: number; // AQI US standard
      mainus: string; // Main pollutant
      aqicn: number; // AQI China standard
      maincn: string;
    };
    weather: {
      ts: string;
      tp: number; // Temperature
      pr: number; // Pressure
      hu: number; // Humidity
      ws: number; // Wind speed
      wd: number; // Wind direction
      ic: string; // Weather icon code
    };
  };
}

interface NorthAmericaCity {
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  aqi: number;
  level: string;
  color: string;
  mainPollutant: string;
}

// Principais cidades da América do Norte para monitorar
const NORTH_AMERICA_CITIES = [
  // Estados Unidos
  { city: 'Los Angeles', state: 'California', country: 'USA' },
  { city: 'New York', state: 'New York', country: 'USA' },
  { city: 'Chicago', state: 'Illinois', country: 'USA' },
  { city: 'Houston', state: 'Texas', country: 'USA' },
  { city: 'Phoenix', state: 'Arizona', country: 'USA' },
  { city: 'Philadelphia', state: 'Pennsylvania', country: 'USA' },
  { city: 'San Antonio', state: 'Texas', country: 'USA' },
  { city: 'San Diego', state: 'California', country: 'USA' },
  { city: 'Dallas', state: 'Texas', country: 'USA' },
  { city: 'San Jose', state: 'California', country: 'USA' },
  { city: 'Miami', state: 'Florida', country: 'USA' },
  { city: 'Seattle', state: 'Washington', country: 'USA' },
  { city: 'Denver', state: 'Colorado', country: 'USA' },
  { city: 'Boston', state: 'Massachusetts', country: 'USA' },
  { city: 'Atlanta', state: 'Georgia', country: 'USA' },
  
  // Canadá
  { city: 'Toronto', state: 'Ontario', country: 'Canada' },
  { city: 'Montreal', state: 'Quebec', country: 'Canada' },
  { city: 'Vancouver', state: 'British Columbia', country: 'Canada' },
  { city: 'Calgary', state: 'Alberta', country: 'Canada' },
  { city: 'Ottawa', state: 'Ontario', country: 'Canada' },
  
  // México
  { city: 'Mexico City', state: 'Mexico City', country: 'Mexico' },
  { city: 'Guadalajara', state: 'Jalisco', country: 'Mexico' },
  { city: 'Monterrey', state: 'Nuevo Leon', country: 'Mexico' },
  { city: 'Tijuana', state: 'Baja California', country: 'Mexico' },
  { city: 'Cancun', state: 'Quintana Roo', country: 'Mexico' },
];

class IQAirService {
  private apiKey: string;

  constructor(apiKey: string = IQAIR_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Obtém dados de qualidade do ar para uma cidade específica
   */
  async getCityData(city: string, state: string, country: string): Promise<IQAirCity | null> {
    try {
      const response = await axios.get(`${BASE_URL}/city`, {
        params: {
          city,
          state,
          country,
          key: this.apiKey,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error(`Erro ao obter dados para ${city}, ${state}, ${country}:`, error);
      return null;
    }
  }

  /**
   * Obtém dados de qualidade do ar por coordenadas
   */
  async getDataByCoordinates(latitude: number, longitude: number): Promise<IQAirCity | null> {
    try {
      const response = await axios.get(`${BASE_URL}/nearest_city`, {
        params: {
          lat: latitude,
          lon: longitude,
          key: this.apiKey,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error(`Erro ao obter dados para coordenadas ${latitude}, ${longitude}:`, error);
      return null;
    }
  }

  /**
   * Obtém lista de países disponíveis
   */
  async getCountries(): Promise<string[]> {
    try {
      const response = await axios.get(`${BASE_URL}/countries`, {
        params: { key: this.apiKey },
      });

      return response.data.data.map((country: any) => country.country);
    } catch (error) {
      console.error('Erro ao obter países:', error);
      return [];
    }
  }

  /**
   * Obtém lista de estados de um país
   */
  async getStates(country: string): Promise<string[]> {
    try {
      const response = await axios.get(`${BASE_URL}/states`, {
        params: { 
          country,
          key: this.apiKey 
        },
      });

      return response.data.data.map((state: any) => state.state);
    } catch (error) {
      console.error(`Erro ao obter estados de ${country}:`, error);
      return [];
    }
  }

  /**
   * Obtém lista de cidades de um estado
   */
  async getCities(state: string, country: string): Promise<string[]> {
    try {
      const response = await axios.get(`${BASE_URL}/cities`, {
        params: { 
          state,
          country,
          key: this.apiKey 
        },
      });

      return response.data.data.map((city: any) => city.city);
    } catch (error) {
      console.error(`Erro ao obter cidades de ${state}, ${country}:`, error);
      return [];
    }
  }

  /**
   * Converte AQI para nível e cor
   */
  private getAQIInfo(aqi: number): { level: string; color: string } {
    if (aqi <= 50) {
      return { level: 'Bom', color: '#4CAF50' };
    } else if (aqi <= 100) {
      return { level: 'Moderado', color: '#FFEB3B' };
    } else if (aqi <= 150) {
      return { level: 'Insalubre para Grupos Sensíveis', color: '#FF9800' };
    } else if (aqi <= 200) {
      return { level: 'Insalubre', color: '#F44336' };
    } else if (aqi <= 300) {
      return { level: 'Muito Insalubre', color: '#9C27B0' };
    } else {
      return { level: 'Perigoso', color: '#7B1FA2' };
    }
  }

  /**
   * Obtém dados de todas as principais cidades da América do Norte
   */
  async getNorthAmericaCitiesData(): Promise<NorthAmericaCity[]> {
    const citiesData: NorthAmericaCity[] = [];

    // Fazer requisições em lotes para não sobrecarregar a API
    const batchSize = 5;
    
    for (let i = 0; i < NORTH_AMERICA_CITIES.length; i += batchSize) {
      const batch = NORTH_AMERICA_CITIES.slice(i, i + batchSize);
      
      const promises = batch.map(({ city, state, country }) =>
        this.getCityData(city, state, country)
      );

      const results = await Promise.all(promises);

      results.forEach((data, index) => {
        if (data && data.current && data.current.pollution) {
          const { level, color } = this.getAQIInfo(data.current.pollution.aqius);
          
          citiesData.push({
            name: batch[index].city,
            state: batch[index].state,
            country: batch[index].country,
            latitude: data.location.coordinates[1],
            longitude: data.location.coordinates[0],
            aqi: data.current.pollution.aqius,
            level,
            color,
            mainPollutant: data.current.pollution.mainus,
          });
        }
      });

      // Aguardar um pouco entre os lotes para respeitar rate limits
      if (i + batchSize < NORTH_AMERICA_CITIES.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return citiesData;
  }

  /**
   * Busca cidades próximas por raio (simulado - API não tem essa feature)
   */
  async getNearestCities(latitude: number, longitude: number, radiusKm: number = 100): Promise<NorthAmericaCity[]> {
    // Como a API não tem busca por raio, vamos filtrar as cidades principais
    const allCities = await this.getNorthAmericaCitiesData();
    
    // Filtrar cidades dentro do raio usando fórmula de Haversine
    return allCities.filter(city => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        city.latitude,
        city.longitude
      );
      return distance <= radiusKm;
    });
  }

  /**
   * Calcula distância entre dois pontos usando fórmula de Haversine
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Gera dados mock caso a API não esteja disponível
   */
  generateMockNorthAmericaData(): NorthAmericaCity[] {
    return NORTH_AMERICA_CITIES.map(({ city, state, country }) => {
      // Coordenadas aproximadas (você deve substituir por dados reais)
      const coords = this.getApproximateCoordinates(city, state, country);
      const aqi = Math.floor(Math.random() * 200) + 20;
      const { level, color } = this.getAQIInfo(aqi);

      return {
        name: city,
        state,
        country,
        latitude: coords.lat,
        longitude: coords.lon,
        aqi,
        level,
        color,
        mainPollutant: ['PM2.5', 'PM10', 'O3', 'NO2'][Math.floor(Math.random() * 4)],
      };
    });
  }

  /**
   * Retorna coordenadas aproximadas de cidades (fallback)
   */
  private getApproximateCoordinates(city: string, state: string, country: string): { lat: number; lon: number } {
    const coords: { [key: string]: { lat: number; lon: number } } = {
      'Los Angeles': { lat: 34.0522, lon: -118.2437 },
      'New York': { lat: 40.7128, lon: -74.0060 },
      'Chicago': { lat: 41.8781, lon: -87.6298 },
      'Houston': { lat: 29.7604, lon: -95.3698 },
      'Phoenix': { lat: 33.4484, lon: -112.0740 },
      'Philadelphia': { lat: 39.9526, lon: -75.1652 },
      'San Antonio': { lat: 29.4241, lon: -98.4936 },
      'San Diego': { lat: 32.7157, lon: -117.1611 },
      'Dallas': { lat: 32.7767, lon: -96.7970 },
      'San Jose': { lat: 37.3382, lon: -121.8863 },
      'Miami': { lat: 25.7617, lon: -80.1918 },
      'Seattle': { lat: 47.6062, lon: -122.3321 },
      'Denver': { lat: 39.7392, lon: -104.9903 },
      'Boston': { lat: 42.3601, lon: -71.0589 },
      'Atlanta': { lat: 33.7490, lon: -84.3880 },
      'Toronto': { lat: 43.6532, lon: -79.3832 },
      'Montreal': { lat: 45.5017, lon: -73.5673 },
      'Vancouver': { lat: 49.2827, lon: -123.1207 },
      'Calgary': { lat: 51.0447, lon: -114.0719 },
      'Ottawa': { lat: 45.4215, lon: -75.6972 },
      'Mexico City': { lat: 19.4326, lon: -99.1332 },
      'Guadalajara': { lat: 20.6597, lon: -103.3496 },
      'Monterrey': { lat: 25.6866, lon: -100.3161 },
      'Tijuana': { lat: 32.5149, lon: -117.0382 },
      'Cancun': { lat: 21.1619, lon: -86.8515 },
    };

    return coords[city] || { lat: 40.0, lon: -100.0 };
  }
}

// Exportar instância singleton
export default new IQAirService();
export { IQAirService, NorthAmericaCity };