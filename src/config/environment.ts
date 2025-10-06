// Configuração de variáveis de ambiente para AirMetrics
// Centraliza todas as configurações de API e ambiente

export interface EnvironmentConfig {
  // NASA APIs
  nasa: {
    earthDataToken: string;
    tempoBaseUrl: string;
    tempoCollection: string;
    airsBaseUrl: string;
    airsDataset: string;
    worldViewBaseUrl: string;
    earthDataBaseUrl: string;
    earthDataDataset: string;
  };
  
  // Google APIs
  google: {
    geminiApiKey: string;
    geminiModel: string;
  };
  
  // Qualidade do Ar APIs
  airQuality: {
    iqAirApiKey: string;
    iqAirBaseUrl: string;
    openWeatherApiKey: string;
    openWeatherBaseUrl: string;
    airVisualApiKey: string;
    airVisualBaseUrl: string;
  };
  
  // Configurações do App
  app: {
    name: string;
    version: string;
    cacheDurationMinutes: number;
    cacheMaxSize: number;
    notificationEnabled: boolean;
    notificationAqiThreshold: number;
  };
  
  // Localização padrão
  location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  };
  
  // URLs de APIs Externas
  externalApis: {
    oms: string;
    inpe: string;
    cetesb: string;
    airNow: string;
    openAQ: string;
  };
  
  // Configurações de Desenvolvimento
  development: {
    nodeEnv: string;
    debugMode: boolean;
    logLevel: string;
    apiTimeout: number;
    apiRetryAttempts: number;
    apiRetryDelay: number;
  };
}

// Função para obter variável de ambiente com valor padrão
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

// Função para obter variável de ambiente numérica
const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

// Função para obter variável de ambiente booleana
const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  return value ? value.toLowerCase() === 'true' : defaultValue;
};

// Configuração principal
export const config: EnvironmentConfig = {
  nasa: {
    earthDataToken: getEnvVar('NASA_EARTHDATA_TOKEN', 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imd1YXJkYV9vbnl4IiwiZXhwIjoxNzY0ODAyMzk5LCJpYXQiOjE3NTk2MTgzOTksImlzcyI6Imh0dHBzOi8vdXJzLmVhcnRoZGF0YS5uYXNhLmdvdiIsImlkZW50aXR5X3Byb3ZpZGVyIjoiZWRsX29wcyIsImFjciI6ImVkbCIsImFzc3VyYW5jZV9sZXZlbCI6M30.cuPAv-F6_p_o5ZpUFwIoW0jsS0Hi9E0JK5CbnZ0jUS0UB44xWp4pPei9GqmwYuTYpjoN6me64FtkraVVTb1ZXyKkwShQtkW8YXS_0v8buoQO81j04Yqm04y5e7OaRkCLADajyjXdA0zTedaMrtVGgt3BFOt02RtgL9w8ZQYWMvzCCTw7mGlZSOTmKuqxXQtbAriDViniRbxNS-KrZ_ZqKiCM6ayM9yOfT8A8S7j8l6rNrxcTv-xeQKFPfPsAmVGg-M1AGZHHjJUIdQENnplfTutegxzUQwcQz3WzwDCdRQcVx6yavfZXDayQOQrFx0kAdYfTemFcaTNCWwV44BvGpA'),
    tempoBaseUrl: getEnvVar('NASA_TEMPO_BASE_URL', 'https://tempo-data.nasa.gov'),
    tempoCollection: getEnvVar('NASA_TEMPO_COLLECTION', 'TEMPO_NO2_L3'),
    airsBaseUrl: getEnvVar('NASA_AIRS_BASE_URL', 'https://airs.jpl.nasa.gov'),
    airsDataset: getEnvVar('NASA_AIRS_DATASET', 'AIRS_L3_Daily'),
    worldViewBaseUrl: getEnvVar('NASA_WORLDVIEW_BASE_URL', 'https://worldview.earthdata.nasa.gov'),
    earthDataBaseUrl: getEnvVar('NASA_EARTHDATA_BASE_URL', 'https://nasa-earthe-data-api.com'),
    earthDataDataset: getEnvVar('NASA_EARTHDATA_DATASET', 'MODIS_FIRMS'),
  },
  
  google: {
    geminiApiKey: getEnvVar('GOOGLE_GEMINI_API_KEY', 'AIzaSyB4wW93ryzc9Z5yCJtDBUiXcYpDvrw0DYg'),
    geminiModel: getEnvVar('GOOGLE_GEMINI_MODEL', 'gemini-1.5-flash'),
  },
  
  airQuality: {
    iqAirApiKey: getEnvVar('IQAIR_API_KEY', ''),
    iqAirBaseUrl: getEnvVar('IQAIR_BASE_URL', 'https://api.airvisual.com/v2'),
    openWeatherApiKey: getEnvVar('OPENWEATHER_API_KEY', ''),
    openWeatherBaseUrl: getEnvVar('OPENWEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5'),
    airVisualApiKey: getEnvVar('AIRVISUAL_API_KEY', ''),
    airVisualBaseUrl: getEnvVar('AIRVISUAL_BASE_URL', 'https://api.airvisual.com/v2'),
  },
  
  app: {
    name: getEnvVar('APP_NAME', 'AirMetrics'),
    version: getEnvVar('APP_VERSION', '1.0.0'),
    cacheDurationMinutes: getEnvNumber('CACHE_DURATION_MINUTES', 30),
    cacheMaxSize: getEnvNumber('CACHE_MAX_SIZE', 100),
    notificationEnabled: getEnvBoolean('NOTIFICATION_ENABLED', true),
    notificationAqiThreshold: getEnvNumber('NOTIFICATION_AQI_THRESHOLD', 100),
  },
  
  location: {
    latitude: getEnvNumber('DEFAULT_LATITUDE', -15.7801),
    longitude: getEnvNumber('DEFAULT_LONGITUDE', -56.0889),
    city: getEnvVar('DEFAULT_CITY', 'Cuiabá'),
    state: getEnvVar('DEFAULT_STATE', 'MT'),
    country: getEnvVar('DEFAULT_COUNTRY', 'BR'),
  },
  
  externalApis: {
    oms: getEnvVar('OMS_API_URL', 'https://api.who.int'),
    inpe: getEnvVar('INPE_API_URL', 'http://queimadas.dgi.inpe.br/api'),
    cetesb: getEnvVar('CETESB_API_URL', 'https://cetesb.sp.gov.br/ar/qualidade-do-ar'),
    airNow: getEnvVar('AIRNOW_API_URL', 'https://www.airnowapi.org/aq/forecast'),
    openAQ: getEnvVar('OPENAQ_API_URL', 'https://api.openaq.org/v2'),
  },
  
  development: {
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    debugMode: getEnvBoolean('DEBUG_MODE', true),
    logLevel: getEnvVar('LOG_LEVEL', 'info'),
    apiTimeout: getEnvNumber('API_TIMEOUT', 10000),
    apiRetryAttempts: getEnvNumber('API_RETRY_ATTEMPTS', 3),
    apiRetryDelay: getEnvNumber('API_RETRY_DELAY', 1000),
  },
};

// Função para validar configurações obrigatórias
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validar chaves obrigatórias
  if (!config.google.geminiApiKey || config.google.geminiApiKey === 'AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ') {
    errors.push('GOOGLE_GEMINI_API_KEY não configurada ou usando chave de exemplo');
  }
  
  if (!config.nasa.earthDataToken || config.nasa.earthDataToken.includes('eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ')) {
    errors.push('NASA_EARTHDATA_TOKEN não configurada ou usando token de exemplo');
  }
  
  // Validar URLs
  const urls = [
    config.nasa.tempoBaseUrl,
    config.nasa.airsBaseUrl,
    config.nasa.worldViewBaseUrl,
    config.airQuality.iqAirBaseUrl,
    config.airQuality.openWeatherBaseUrl,
  ];
  
  urls.forEach((url, index) => {
    if (!url || !url.startsWith('http')) {
      errors.push(`URL inválida na posição ${index}: ${url}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Função para obter configuração de uma API específica
export const getApiConfig = (apiName: keyof EnvironmentConfig) => {
  return config[apiName];
};

// Função para verificar se está em modo de desenvolvimento
export const isDevelopment = (): boolean => {
  return config.development.nodeEnv === 'development';
};

// Função para verificar se debug está habilitado
export const isDebugEnabled = (): boolean => {
  return config.development.debugMode;
};

// Exportar configuração por padrão
export default config;
