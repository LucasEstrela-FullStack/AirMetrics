// Serviço para integração com NASA AIRS (Atmospheric Infrared Sounder)
// Dados de umidade relativa e temperatura do ar na superfície

import config from '../config/environment';

export interface AIRSConfig {
  baseUrl: string;
  apiKey?: string;
  dataset: string;
  authToken?: string;
}

export interface AIRSData {
  latitude: number;
  longitude: number;
  relativeHumidity: number; // Umidade relativa (%)
  surfaceTemperature: number; // Temperatura da superfície (K)
  airTemperature: number; // Temperatura do ar (K)
  timestamp: string;
  qualityFlag: number; // 0 = baixa qualidade, 1 = alta qualidade
  cloudFraction: number; // Fração de nuvens (0-1)
  pressure: number; // Pressão atmosférica (hPa)
  dewPoint: number; // Ponto de orvalho (K)
}

export interface AIRSForecast {
  date: string;
  time: string;
  relativeHumidity: number;
  surfaceTemperature: number;
  airTemperature: number;
  cloudFraction: number;
  pressure: number;
}

export interface AIRSTimeSeries {
  timestamp: string;
  relativeHumidity: number;
  surfaceTemperature: number;
  airTemperature: number;
  cloudFraction: number;
}

class AIRSService {
  private config: AIRSConfig;
  private cache: Map<string, any> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

  constructor(config: AIRSConfig) {
    this.config = config;
  }

  /**
   * Autentica com NASA EarthData
   */
  async authenticate(): Promise<boolean> {
    try {
      // Simular autenticação - em produção, usar token real
      console.log('🔐 Autenticando com NASA AIRS...');
      
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Autenticação AIRS bem-sucedida');
      return true;
    } catch (error) {
      console.error('❌ Erro na autenticação AIRS:', error);
      return false;
    }
  }

  /**
   * Busca dados AIRS para uma região específica
   */
  async getAIRSData(
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    },
    startDate?: string,
    endDate?: string
  ): Promise<AIRSData[]> {
    const cacheKey = `airs_${JSON.stringify(bounds)}_${startDate}_${endDate}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    try {
      console.log('🌡️ Buscando dados AIRS...');
      
      // Simular dados AIRS baseados em Mato Grosso
      const mockData = this.generateMockAIRSData(bounds, startDate, endDate);
      
      this.cache.set(cacheKey, {
        data: mockData,
        timestamp: Date.now()
      });
      
      return mockData;
    } catch (error) {
      console.error('❌ Erro ao buscar dados AIRS:', error);
      return [];
    }
  }

  /**
   * Busca dados AIRS por coordenadas específicas
   */
  async getAIRSDataByCoordinates(
    latitude: number,
    longitude: number,
    radius: number = 0.1
  ): Promise<AIRSData[]> {
    const bounds = {
      north: latitude + radius,
      south: latitude - radius,
      east: longitude + radius,
      west: longitude - radius
    };

    return this.getAIRSData(bounds);
  }

  /**
   * Obtém previsão de dados AIRS
   */
  async getAIRSForecast(
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    },
    days: number = 7
  ): Promise<AIRSForecast[]> {
    try {
      console.log('📈 Gerando previsão AIRS...');
      
      const forecast: AIRSForecast[] = [];
      const now = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        
        // Simular variação diurna
        for (let hour = 0; hour < 24; hour += 6) {
          const time = new Date(date);
          time.setHours(hour);
          
          // Simular padrões climáticos de Mato Grosso
          const baseTemp = 25 + Math.sin((hour - 6) * Math.PI / 12) * 10; // Variação diurna
          const baseHumidity = 60 + Math.sin((hour - 6) * Math.PI / 12) * 20;
          
          forecast.push({
            date: date.toISOString().split('T')[0],
            time: time.toISOString().split('T')[1].substring(0, 5),
            relativeHumidity: Math.max(20, Math.min(95, baseHumidity + (Math.random() - 0.5) * 20)),
            surfaceTemperature: baseTemp + (Math.random() - 0.5) * 5,
            airTemperature: baseTemp - 2 + (Math.random() - 0.5) * 3,
            cloudFraction: Math.max(0, Math.min(1, Math.random() * 0.8)),
            pressure: 1013 + (Math.random() - 0.5) * 20
          });
        }
      }
      
      return forecast;
    } catch (error) {
      console.error('❌ Erro ao gerar previsão AIRS:', error);
      return [];
    }
  }

  /**
   * Calcula série temporal de dados AIRS
   */
  async getAIRSTimeSeries(
    latitude: number,
    longitude: number,
    days: number = 7
  ): Promise<AIRSTimeSeries[]> {
    try {
      console.log('📊 Calculando série temporal AIRS...');
      
      const timeSeries: AIRSTimeSeries[] = [];
      const now = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        
        // Simular dados históricos
        const baseTemp = 25 + Math.sin(i * Math.PI / 7) * 5;
        const baseHumidity = 60 + Math.sin(i * Math.PI / 7) * 15;
        
        timeSeries.push({
          timestamp: date.toISOString(),
          relativeHumidity: Math.max(20, Math.min(95, baseHumidity + (Math.random() - 0.5) * 15)),
          surfaceTemperature: baseTemp + (Math.random() - 0.5) * 4,
          airTemperature: baseTemp - 2 + (Math.random() - 0.5) * 3,
          cloudFraction: Math.max(0, Math.min(1, Math.random() * 0.7))
        });
      }
      
      return timeSeries.reverse(); // Mais recente primeiro
    } catch (error) {
      console.error('❌ Erro ao calcular série temporal AIRS:', error);
      return [];
    }
  }

  /**
   * Gera dados AIRS simulados
   */
  private generateMockAIRSData(
    bounds: any,
    startDate?: string,
    endDate?: string
  ): AIRSData[] {
    const data: AIRSData[] = [];
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    
    // Gerar pontos de dados
    const pointsCount = Math.floor(Math.random() * 50) + 20;
    
    for (let i = 0; i < pointsCount; i++) {
      const lat = centerLat + (Math.random() - 0.5) * (bounds.north - bounds.south);
      const lng = centerLng + (Math.random() - 0.5) * (bounds.east - bounds.west);
      
      // Simular dados climáticos de Mato Grosso
      const baseTemp = 25 + Math.sin(lat * Math.PI / 180) * 5; // Variação latitudinal
      const baseHumidity = 60 + Math.sin(lng * Math.PI / 180) * 10; // Variação longitudinal
      
      data.push({
        latitude: lat,
        longitude: lng,
        relativeHumidity: Math.max(20, Math.min(95, baseHumidity + (Math.random() - 0.5) * 20)),
        surfaceTemperature: baseTemp + (Math.random() - 0.5) * 8,
        airTemperature: baseTemp - 2 + (Math.random() - 0.5) * 5,
        timestamp: new Date().toISOString(),
        qualityFlag: Math.random() > 0.1 ? 1 : 0, // 90% alta qualidade
        cloudFraction: Math.max(0, Math.min(1, Math.random() * 0.8)),
        pressure: 1013 + (Math.random() - 0.5) * 30,
        dewPoint: baseTemp - 5 + (Math.random() - 0.5) * 3
      });
    }
    
    return data;
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Instância padrão configurada para dados AIRS usando configurações de ambiente
const airsService = new AIRSService({
  baseUrl: config.nasa.airsBaseUrl,
  dataset: config.nasa.airsDataset,
  authToken: config.nasa.earthDataToken
});

export default airsService;
export { AIRSService };
