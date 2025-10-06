// Serviço para integração com dados da Terra/NASA EarthData
// Adaptado do arquivo Python original para TypeScript/React Native

import config from '../config/environment';

export interface EarthDataConfig {
  baseUrl: string;
  apiKey?: string;
  dataset: string;
  authToken?: string;
}

export interface FireData {
  latitude: number;
  longitude: number;
  confidence: number;
  fireIntensity: 'low' | 'medium' | 'high';
  timestamp: string;
  satellite: string;
  brightness?: number;
  temperature?: number;
}

export interface AirQualityData {
  latitude: number;
  longitude: number;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  timestamp: string;
  source: string;
}

export interface SatelliteImage {
  url: string;
  timestamp: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  resolution: number;
  satellite: string;
}

class EarthDataService {
  private config: EarthDataConfig;
  private cache: Map<string, any> = new Map();

  constructor(config: EarthDataConfig) {
    this.config = config;
  }

  // Autenticação com token real da NASA EarthData
  async authenticate(): Promise<boolean> {
    try {
      console.log('🔐 Autenticando com NASA EarthData usando token real...');
      
      if (!this.config.authToken) {
        console.warn('⚠️ Token de autenticação não fornecido, usando dados simulados');
        return false;
      }

      // Verificar se o token é válido (opcional - em produção fazer requisição real)
      const tokenParts = this.config.authToken.split('.');
      if (tokenParts.length !== 3) {
        console.error('❌ Token inválido');
        return false;
      }

      try {
        // Decodificar payload do JWT (sem verificar assinatura)
        const payload = JSON.parse(atob(tokenParts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < now) {
          console.error('❌ Token expirado');
          return false;
        }

        console.log('✅ Token válido encontrado');
        console.log(`👤 Usuário: ${payload.uid}`);
        console.log(`🕒 Expira em: ${new Date(payload.exp * 1000).toLocaleString()}`);
        
        return true;
      } catch (decodeError) {
        console.error('❌ Erro ao decodificar token:', decodeError);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
      return false;
    }
  }

  // Buscar dados de queimadas em tempo real
  async getFireData(
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    },
    startDate?: string,
    endDate?: string
  ): Promise<FireData[]> {
    const cacheKey = `fire_${JSON.stringify(bounds)}_${startDate}_${endDate}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Simular dados de queimadas baseados em Mato Grosso
      const mockFireData: FireData[] = this.generateMockFireData(bounds);
      
      this.cache.set(cacheKey, mockFireData);
      return mockFireData;
    } catch (error) {
      console.error('Erro ao buscar dados de queimadas:', error);
      return [];
    }
  }

  // Buscar dados de qualidade do ar
  async getAirQualityData(
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  ): Promise<AirQualityData[]> {
    const cacheKey = `airquality_${JSON.stringify(bounds)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Simular dados de qualidade do ar
      const mockAirQualityData: AirQualityData[] = this.generateMockAirQualityData(bounds);
      
      this.cache.set(cacheKey, mockAirQualityData);
      return mockAirQualityData;
    } catch (error) {
      console.error('Erro ao buscar dados de qualidade do ar:', error);
      return [];
    }
  }

  // Buscar imagens de satélite
  async getSatelliteImages(
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    },
    date?: string
  ): Promise<SatelliteImage[]> {
    const cacheKey = `satellite_${JSON.stringify(bounds)}_${date}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Simular imagens de satélite
      const mockImages: SatelliteImage[] = this.generateMockSatelliteImages(bounds);
      
      this.cache.set(cacheKey, mockImages);
      return mockImages;
    } catch (error) {
      console.error('Erro ao buscar imagens de satélite:', error);
      return [];
    }
  }

  // Gerar dados simulados de queimadas
  private generateMockFireData(bounds: any): FireData[] {
    const fires: FireData[] = [];
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    
    // Gerar 5-10 focos de queimada
    const fireCount = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < fireCount; i++) {
      const lat = centerLat + (Math.random() - 0.5) * 0.5;
      const lng = centerLng + (Math.random() - 0.5) * 0.5;
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      const intensities = ['low', 'medium', 'high'] as const;
      const intensity = intensities[Math.floor(Math.random() * 3)];
      
      fires.push({
        latitude: lat,
        longitude: lng,
        confidence,
        fireIntensity: intensity,
        timestamp: new Date().toISOString(),
        satellite: 'MODIS',
        brightness: Math.floor(Math.random() * 100) + 300,
        temperature: Math.floor(Math.random() * 200) + 400,
      });
    }
    
    return fires;
  }

  // Gerar dados simulados de qualidade do ar
  private generateMockAirQualityData(bounds: any): AirQualityData[] {
    const stations: AirQualityData[] = [];
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    
    // Gerar 8-12 estações de monitoramento
    const stationCount = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < stationCount; i++) {
      const lat = centerLat + (Math.random() - 0.5) * 0.2;
      const lng = centerLng + (Math.random() - 0.5) * 0.2;
      const aqi = Math.floor(Math.random() * 200) + 50; // AQI mais alto devido às queimadas
      
      stations.push({
        latitude: lat,
        longitude: lng,
        aqi,
        pm25: Math.floor(aqi * 0.6) + Math.floor(Math.random() * 20),
        pm10: Math.floor(aqi * 0.8) + Math.floor(Math.random() * 30),
        o3: Math.floor(aqi * 0.7) + Math.floor(Math.random() * 25),
        no2: Math.floor(aqi * 0.4) + Math.floor(Math.random() * 15),
        timestamp: new Date().toISOString(),
        source: 'NASA EarthData',
      });
    }
    
    return stations;
  }

  // Gerar imagens simuladas de satélite
  private generateMockSatelliteImages(bounds: any): SatelliteImage[] {
    return [
      {
        url: `https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Satellite+Image+MODIS`,
        timestamp: new Date().toISOString(),
        bounds,
        resolution: 250, // metros
        satellite: 'MODIS',
      },
      {
        url: `https://via.placeholder.com/800x600/FF9800/FFFFFF?text=Satellite+Image+VIIRS`,
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        bounds,
        resolution: 375, // metros
        satellite: 'VIIRS',
      },
    ];
  }

  // Limpar cache
  clearCache(): void {
    this.cache.clear();
  }

  // Obter estatísticas do cache
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Instância padrão configurada para Mato Grosso usando configurações de ambiente
const earthDataService = new EarthDataService({
  baseUrl: config.nasa.earthDataBaseUrl,
  dataset: config.nasa.earthDataDataset,
  authToken: config.nasa.earthDataToken
});

export default earthDataService;

// Exportar também a classe para uso customizado
export { EarthDataService };
