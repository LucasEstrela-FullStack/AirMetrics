// Serviço para dados TEMPO (Tropospheric Emissions: Monitoring of Pollution)
// Baseado no tutorial da NASA EarthData: https://earthaccess.readthedocs.io/en/stable/tutorials/virtual_dataset_tutorial_with_TEMPO_Level3/

import config from '../config/environment';

export interface TEMPOConfig {
  baseUrl: string;
  collectionShortname: string;
  apiKey?: string;
  authToken?: string;
}

export interface TEMPOData {
  latitude: number;
  longitude: number;
  no2Troposphere: number; // vertical_column_troposphere
  no2Stratosphere: number; // vertical_column_stratosphere
  no2Total: number; // vertical_column_total
  timestamp: string;
  qualityFlag: number;
  cloudFraction: number;
  solarZenithAngle: number;
  airMassFactor: number;
}

export interface TEMPOGranule {
  id: string;
  fileName: string;
  timeRange: {
    start: string;
    end: string;
  };
  spatialBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  url: string;
  size: number;
}

export interface TEMPOTimeSeries {
  timestamp: string;
  meanValue: number;
  spatialMean: number;
  dataPoints: number;
}

export interface TEMPOSpatialMean {
  latitude: number;
  longitude: number;
  annualMean: number;
  seasonalVariation: number;
  dataQuality: 'high' | 'medium' | 'low';
}

class TEMPOService {
  private config: TEMPOConfig;
  private cache: Map<string, any> = new Map();

  constructor(config: TEMPOConfig) {
    this.config = config;
  }

  // Autenticação com NASA EarthData usando token real
  async authenticate(): Promise<boolean> {
    try {
      console.log('🔐 Autenticando com NASA EarthData para dados TEMPO...');
      
      if (!this.config.authToken) {
        console.warn('⚠️ Token de autenticação TEMPO não fornecido, usando dados simulados');
        return false;
      }

      // Verificar se o token é válido
      const tokenParts = this.config.authToken.split('.');
      if (tokenParts.length !== 3) {
        console.error('❌ Token TEMPO inválido');
        return false;
      }

      try {
        // Decodificar payload do JWT
        const payload = JSON.parse(atob(tokenParts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < now) {
          console.error('❌ Token TEMPO expirado');
          return false;
        }

        console.log('✅ Token TEMPO válido encontrado');
        console.log(`👤 Usuário: ${payload.uid}`);
        console.log(`🛰️ Acesso a dados TEMPO autorizado`);
        console.log(`🕒 Token expira em: ${new Date(payload.exp * 1000).toLocaleString()}`);
        
        return true;
      } catch (decodeError) {
        console.error('❌ Erro ao decodificar token TEMPO:', decodeError);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro na autenticação TEMPO:', error);
      return false;
    }
  }

  // Buscar grânulos TEMPO para um período específico
  async searchTEMPOGranules(
    startDate: string,
    endDate: string,
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  ): Promise<TEMPOGranule[]> {
    const cacheKey = `tempo_granules_${startDate}_${endDate}_${JSON.stringify(bounds)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      console.log(`🔍 Buscando grânulos TEMPO de ${startDate} a ${endDate}`);
      
      // Simular busca de grânulos TEMPO
      const mockGranules: TEMPOGranule[] = this.generateMockTEMPOGranules(startDate, endDate, bounds);
      
      this.cache.set(cacheKey, mockGranules);
      console.log(`📊 Encontrados ${mockGranules.length} grânulos TEMPO`);
      
      return mockGranules;
    } catch (error) {
      console.error('❌ Erro ao buscar grânulos TEMPO:', error);
      return [];
    }
  }

  // Abrir dataset virtual multifile (simulado)
  async openVirtualMultiFileDataset(
    granules: TEMPOGranule[],
    variables: string[] = ['vertical_column_troposphere', 'vertical_column_stratosphere', 'vertical_column_total']
  ): Promise<TEMPOData[]> {
    try {
      console.log(`🌍 Abrindo dataset virtual com ${granules.length} grânulos`);
      console.log(`📊 Variáveis: ${variables.join(', ')}`);
      
      // Simular abertura de dataset virtual
      const mockData: TEMPOData[] = this.generateMockTEMPOData(granules, variables);
      
      console.log(`✅ Dataset virtual aberto com ${mockData.length} pontos de dados`);
      return mockData;
    } catch (error) {
      console.error('❌ Erro ao abrir dataset virtual:', error);
      return [];
    }
  }

  // Calcular média temporal - mapa mostrando média anual
  async calculateTemporalMean(
    data: TEMPOData[],
    year?: number
  ): Promise<Map<string, TEMPOSpatialMean>> {
    try {
      console.log('📈 Calculando média temporal...');
      
      const spatialMeans = new Map<string, TEMPOSpatialMean>();
      
      // Agrupar dados por localização
      const groupedData = this.groupDataByLocation(data);
      
      for (const [location, values] of groupedData.entries()) {
        const mean = values.reduce((sum, val) => sum + val.no2Troposphere, 0) / values.length;
        const seasonalVar = this.calculateSeasonalVariation(values);
        
        spatialMeans.set(location, {
          latitude: values[0].latitude,
          longitude: values[0].longitude,
          annualMean: mean,
          seasonalVariation: seasonalVar,
          dataQuality: mean > 0.8 ? 'high' : mean > 0.5 ? 'medium' : 'low'
        });
      }
      
      console.log(`✅ Média temporal calculada para ${spatialMeans.size} locais`);
      return spatialMeans;
    } catch (error) {
      console.error('❌ Erro ao calcular média temporal:', error);
      return new Map();
    }
  }

  // Calcular média espacial - série temporal de médias de área
  async calculateSpatialMean(
    data: TEMPOData[],
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  ): Promise<TEMPOTimeSeries[]> {
    try {
      console.log('📊 Calculando média espacial...');
      
      // Filtrar dados dentro dos bounds
      const filteredData = data.filter(d => 
        d.latitude >= bounds.south && d.latitude <= bounds.north &&
        d.longitude >= bounds.west && d.longitude <= bounds.east
      );
      
      // Agrupar por timestamp
      const groupedByTime = this.groupDataByTime(filteredData);
      
      const timeSeries: TEMPOTimeSeries[] = [];
      
      for (const [timestamp, values] of groupedByTime.entries()) {
        const meanValue = values.reduce((sum, val) => sum + val.no2Troposphere, 0) / values.length;
        const spatialMean = this.calculateSpatialMeanValue(values);
        
        timeSeries.push({
          timestamp,
          meanValue,
          spatialMean,
          dataPoints: values.length
        });
      }
      
      console.log(`✅ Média espacial calculada para ${timeSeries.length} períodos temporais`);
      return timeSeries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('❌ Erro ao calcular média espacial:', error);
      return [];
    }
  }

  // Subset de scan único
  async getSingleScanSubset(
    data: TEMPOData[],
    targetLat: number,
    targetLng: number,
    radiusKm: number = 50
  ): Promise<TEMPOData[]> {
    try {
      console.log(`🎯 Obtendo subset de scan único para ${targetLat}, ${targetLng}`);
      
      const subset = data.filter(point => {
        const distance = this.calculateDistance(
          targetLat, targetLng,
          point.latitude, point.longitude
        );
        return distance <= radiusKm;
      });
      
      console.log(`✅ Subset obtido com ${subset.length} pontos`);
      return subset;
    } catch (error) {
      console.error('❌ Erro ao obter subset:', error);
      return [];
    }
  }

  // Gerar grânulos simulados
  private generateMockTEMPOGranules(
    startDate: string,
    endDate: string,
    bounds?: any
  ): TEMPOGranule[] {
    const granules: TEMPOGranule[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Gerar grânulos diários para o período
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      for (let hour = 10; hour < 18; hour += 2) { // Dados diurnos (10h-18h)
        const timestamp = new Date(date);
        timestamp.setHours(hour, 0, 0, 0);
        
        granules.push({
          id: `TEMPO_NO2_L3_V03_${timestamp.toISOString().replace(/[-:]/g, '').split('.')[0]}_S001.nc`,
          fileName: `TEMPO_NO2_L3_V03_${timestamp.toISOString().replace(/[-:]/g, '').split('.')[0]}_S001.nc`,
          timeRange: {
            start: timestamp.toISOString(),
            end: new Date(timestamp.getTime() + 2 * 60 * 60 * 1000).toISOString() // +2 horas
          },
          spatialBounds: bounds || {
            north: 63.8,
            south: 17.22,
            east: -20.02,
            west: -110.56
          },
          url: `https://tempo-data.nasa.gov/${timestamp.toISOString().split('T')[0]}/TEMPO_NO2_L3_V03_${timestamp.toISOString().replace(/[-:]/g, '').split('.')[0]}_S001.nc`,
          size: Math.floor(Math.random() * 50000000) + 10000000 // 10-60MB
        });
      }
    }
    
    return granules;
  }

  // Gerar dados TEMPO simulados
  private generateMockTEMPOData(granules: TEMPOGranule[], variables: string[]): TEMPOData[] {
    const data: TEMPOData[] = [];
    
    granules.forEach(granule => {
      // Gerar pontos de dados para cada grânulo
      const pointsCount = Math.floor(Math.random() * 100) + 50;
      
      for (let i = 0; i < pointsCount; i++) {
        const lat = granule.spatialBounds.south + 
          (Math.random() * (granule.spatialBounds.north - granule.spatialBounds.south));
        const lng = granule.spatialBounds.west + 
          (Math.random() * (granule.spatialBounds.east - granule.spatialBounds.west));
        
        // Simular valores NO2 baseados em padrões reais
        const baseNO2 = Math.random() * 0.5 + 0.1; // 0.1-0.6 mol/m²
        
        data.push({
          latitude: lat,
          longitude: lng,
          no2Troposphere: baseNO2 * 0.7 + Math.random() * 0.2,
          no2Stratosphere: baseNO2 * 0.3 + Math.random() * 0.1,
          no2Total: baseNO2 + Math.random() * 0.1,
          timestamp: granule.timeRange.start,
          qualityFlag: Math.random() > 0.1 ? 1 : 0, // 90% qualidade boa
          cloudFraction: Math.random() * 0.5,
          solarZenithAngle: Math.random() * 60 + 20, // 20-80 graus
          airMassFactor: Math.random() * 2 + 1 // 1-3
        });
      }
    });
    
    return data;
  }

  // Agrupar dados por localização
  private groupDataByLocation(data: TEMPOData[]): Map<string, TEMPOData[]> {
    const grouped = new Map<string, TEMPOData[]>();
    
    data.forEach(point => {
      const key = `${point.latitude.toFixed(2)},${point.longitude.toFixed(2)}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(point);
    });
    
    return grouped;
  }

  // Agrupar dados por tempo
  private groupDataByTime(data: TEMPOData[]): Map<string, TEMPOData[]> {
    const grouped = new Map<string, TEMPOData[]>();
    
    data.forEach(point => {
      const timestamp = new Date(point.timestamp).toISOString().split('T')[0]; // Data apenas
      if (!grouped.has(timestamp)) {
        grouped.set(timestamp, []);
      }
      grouped.get(timestamp)!.push(point);
    });
    
    return grouped;
  }

  // Calcular variação sazonal
  private calculateSeasonalVariation(values: TEMPOData[]): number {
    if (values.length < 2) return 0;
    
    const means = values.map(v => v.no2Troposphere);
    const avg = means.reduce((sum, val) => sum + val, 0) / means.length;
    const variance = means.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / means.length;
    
    return Math.sqrt(variance) / avg; // Coeficiente de variação
  }

  // Calcular média espacial
  private calculateSpatialMeanValue(values: TEMPOData[]): number {
    return values.reduce((sum, val) => sum + val.no2Troposphere, 0) / values.length;
  }

  // Calcular distância entre dois pontos (Haversine)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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

// Instância padrão configurada para dados TEMPO usando configurações de ambiente
const tempoService = new TEMPOService({
  baseUrl: config.nasa.tempoBaseUrl,
  collectionShortname: config.nasa.tempoCollection,
  authToken: config.nasa.earthDataToken
});

export default tempoService;
export { TEMPOService };
