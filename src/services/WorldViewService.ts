// Serviço para integração com NASA WorldView
// Visualizações de imagens de satélite globais

import config from '../config/environment';

export interface WorldViewConfig {
  baseUrl: string;
  apiKey?: string;
  authToken?: string;
}

export interface WorldViewLayer {
  id: string;
  name: string;
  description: string;
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
  resolution: string;
  format: string;
  projection: string;
}

export interface WorldViewImage {
  id: string;
  layerId: string;
  layerName: string;
  date: string;
  time: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  imageUrl: string;
  thumbnailUrl: string;
  resolution: number;
  format: string;
  size: number; // em bytes
  metadata: {
    satellite: string;
    instrument: string;
    processingLevel: string;
    quality: number;
  };
}

export interface WorldViewRequest {
  layers: string[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  date: string;
  format: string;
  projection: string;
  resolution: number;
}

export interface WorldViewTimeSeries {
  layerId: string;
  layerName: string;
  images: WorldViewImage[];
  dateRange: {
    start: string;
    end: string;
  };
}

class WorldViewService {
  private config: WorldViewConfig;
  private cache: Map<string, any> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hora

  constructor(config: WorldViewConfig) {
    this.config = config;
  }

  /**
   * Autentica com NASA WorldView
   */
  async authenticate(): Promise<boolean> {
    try {
      console.log('🌍 Autenticando com NASA WorldView...');
      
      // Simular autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Autenticação WorldView bem-sucedida');
      return true;
    } catch (error) {
      console.error('❌ Erro na autenticação WorldView:', error);
      return false;
    }
  }

  /**
   * Lista camadas disponíveis
   */
  async getAvailableLayers(): Promise<WorldViewLayer[]> {
    try {
      console.log('📋 Buscando camadas disponíveis...');
      
      // Simular camadas relevantes para qualidade do ar
      const layers: WorldViewLayer[] = [
        {
          id: 'MODIS_Terra_Aerosol_Optical_Depth',
          name: 'MODIS Terra Aerosol Optical Depth',
          description: 'Profundidade óptica de aerossóis do MODIS Terra',
          category: 'Aerosols',
          dateRange: {
            start: '2000-02-24',
            end: new Date().toISOString().split('T')[0]
          },
          resolution: '1km',
          format: 'PNG',
          projection: 'EPSG:4326'
        },
        {
          id: 'MODIS_Aqua_Aerosol_Optical_Depth',
          name: 'MODIS Aqua Aerosol Optical Depth',
          description: 'Profundidade óptica de aerossóis do MODIS Aqua',
          category: 'Aerosols',
          dateRange: {
            start: '2002-07-04',
            end: new Date().toISOString().split('T')[0]
          },
          resolution: '1km',
          format: 'PNG',
          projection: 'EPSG:4326'
        },
        {
          id: 'MODIS_Terra_Fires_Active',
          name: 'MODIS Terra Active Fires',
          description: 'Focos de incêndio ativos do MODIS Terra',
          category: 'Fires',
          dateRange: {
            start: '2000-11-01',
            end: new Date().toISOString().split('T')[0]
          },
          resolution: '1km',
          format: 'PNG',
          projection: 'EPSG:4326'
        },
        {
          id: 'MODIS_Aqua_Fires_Active',
          name: 'MODIS Aqua Active Fires',
          description: 'Focos de incêndio ativos do MODIS Aqua',
          category: 'Fires',
          dateRange: {
            start: '2002-07-04',
            end: new Date().toISOString().split('T')[0]
          },
          resolution: '1km',
          format: 'PNG',
          projection: 'EPSG:4326'
        },
        {
          id: 'VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1',
          name: 'VIIRS Corrected Reflectance',
          description: 'Reflectância corrigida do VIIRS',
          category: 'Imagery',
          dateRange: {
            start: '2012-01-20',
            end: new Date().toISOString().split('T')[0]
          },
          resolution: '375m',
          format: 'PNG',
          projection: 'EPSG:4326'
        }
      ];
      
      return layers;
    } catch (error) {
      console.error('❌ Erro ao buscar camadas:', error);
      return [];
    }
  }

  /**
   * Busca imagens para uma região e data específicas
   */
  async getImages(
    request: WorldViewRequest
  ): Promise<WorldViewImage[]> {
    const cacheKey = `worldview_${JSON.stringify(request)}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    try {
      console.log('🖼️ Buscando imagens WorldView...');
      
      // Simular imagens baseadas na requisição
      const images = this.generateMockImages(request);
      
      this.cache.set(cacheKey, {
        data: images,
        timestamp: Date.now()
      });
      
      return images;
    } catch (error) {
      console.error('❌ Erro ao buscar imagens:', error);
      return [];
    }
  }

  /**
   * Obtém série temporal de imagens
   */
  async getTimeSeries(
    layerId: string,
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    },
    startDate: string,
    endDate: string
  ): Promise<WorldViewTimeSeries> {
    try {
      console.log('📈 Gerando série temporal WorldView...');
      
      const images: WorldViewImage[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Gerar imagens para cada dia no intervalo
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const image = this.generateMockImage(layerId, bounds, date.toISOString().split('T')[0]);
        images.push(image);
      }
      
      return {
        layerId,
        layerName: this.getLayerName(layerId),
        images,
        dateRange: {
          start: startDate,
          end: endDate
        }
      };
    } catch (error) {
      console.error('❌ Erro ao gerar série temporal:', error);
      return {
        layerId,
        layerName: '',
        images: [],
        dateRange: { start: startDate, end: endDate }
      };
    }
  }

  /**
   * Gera imagens simuladas
   */
  private generateMockImages(request: WorldViewRequest): WorldViewImage[] {
    const images: WorldViewImage[] = [];
    
    request.layers.forEach(layerId => {
      const image = this.generateMockImage(
        layerId,
        request.bounds,
        request.date
      );
      images.push(image);
    });
    
    return images;
  }

  /**
   * Gera uma imagem simulada
   */
  private generateMockImage(
    layerId: string,
    bounds: any,
    date: string
  ): WorldViewImage {
    const layerName = this.getLayerName(layerId);
    
    return {
      id: `${layerId}_${date}_${Date.now()}`,
      layerId,
      layerName,
      date,
      time: '12:00:00',
      bounds,
      imageUrl: `https://worldview.earthdata.nasa.gov/api/v1/image/${layerId}/${date}`,
      thumbnailUrl: `https://worldview.earthdata.nasa.gov/api/v1/thumbnail/${layerId}/${date}`,
      resolution: this.getLayerResolution(layerId),
      format: 'PNG',
      size: Math.floor(Math.random() * 5000000) + 1000000, // 1-5MB
      metadata: {
        satellite: this.getSatelliteName(layerId),
        instrument: this.getInstrumentName(layerId),
        processingLevel: 'L3',
        quality: Math.random() > 0.1 ? 1 : 0
      }
    };
  }

  /**
   * Obtém nome da camada
   */
  private getLayerName(layerId: string): string {
    const names: { [key: string]: string } = {
      'MODIS_Terra_Aerosol_Optical_Depth': 'MODIS Terra Aerosol Optical Depth',
      'MODIS_Aqua_Aerosol_Optical_Depth': 'MODIS Aqua Aerosol Optical Depth',
      'MODIS_Terra_Fires_Active': 'MODIS Terra Active Fires',
      'MODIS_Aqua_Fires_Active': 'MODIS Aqua Active Fires',
      'VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1': 'VIIRS Corrected Reflectance'
    };
    
    return names[layerId] || layerId;
  }

  /**
   * Obtém resolução da camada
   */
  private getLayerResolution(layerId: string): number {
    if (layerId.includes('VIIRS')) return 375;
    if (layerId.includes('MODIS')) return 1000;
    return 1000;
  }

  /**
   * Obtém nome do satélite
   */
  private getSatelliteName(layerId: string): string {
    if (layerId.includes('Terra')) return 'Terra';
    if (layerId.includes('Aqua')) return 'Aqua';
    if (layerId.includes('VIIRS')) return 'Suomi NPP';
    return 'Unknown';
  }

  /**
   * Obtém nome do instrumento
   */
  private getInstrumentName(layerId: string): string {
    if (layerId.includes('MODIS')) return 'MODIS';
    if (layerId.includes('VIIRS')) return 'VIIRS';
    return 'Unknown';
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

// Instância padrão configurada para NASA WorldView usando configurações de ambiente
const worldViewService = new WorldViewService({
  baseUrl: config.nasa.worldViewBaseUrl,
  authToken: config.nasa.earthDataToken
});

export default worldViewService;
export { WorldViewService };
