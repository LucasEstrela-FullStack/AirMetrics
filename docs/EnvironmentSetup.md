# Configuração de Variáveis de Ambiente - AirMetrics

## 📋 Visão Geral

O AirMetrics utiliza um sistema centralizado de configuração de variáveis de ambiente para gerenciar todas as chaves de API e configurações do aplicativo de forma segura.

## 🔧 Configuração

### 1. Arquivo de Configuração Principal

O arquivo `src/config/environment.ts` centraliza todas as configurações e fornece:

- ✅ **Validação** de configurações obrigatórias
- ✅ **Valores padrão** para desenvolvimento
- ✅ **Tipagem TypeScript** completa
- ✅ **Funções utilitárias** para verificação de ambiente

### 2. Variáveis de Ambiente

#### **NASA APIs**
```bash
NASA_EARTHDATA_TOKEN=your_nasa_earthdata_token_here
NASA_TEMPO_BASE_URL=https://tempo-data.nasa.gov
NASA_TEMPO_COLLECTION=TEMPO_NO2_L3
NASA_AIRS_BASE_URL=https://airs.jpl.nasa.gov
NASA_AIRS_DATASET=AIRS_L3_Daily
NASA_WORLDVIEW_BASE_URL=https://worldview.earthdata.nasa.gov
NASA_EARTHDATA_BASE_URL=https://nasa-earthe-data-api.com
NASA_EARTHDATA_DATASET=MODIS_FIRMS
```

#### **Google APIs**
```bash
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
GOOGLE_GEMINI_MODEL=gemini-1.5-flash
```

#### **Qualidade do Ar APIs**
```bash
IQAIR_API_KEY=your_iqair_api_key_here
IQAIR_BASE_URL=https://api.airvisual.com/v2
OPENWEATHER_API_KEY=your_openweather_api_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
AIRVISUAL_API_KEY=your_airvisual_api_key_here
AIRVISUAL_BASE_URL=https://api.airvisual.com/v2
```

#### **Configurações do App**
```bash
APP_NAME=AirMetrics
APP_VERSION=1.0.0
CACHE_DURATION_MINUTES=30
CACHE_MAX_SIZE=100
NOTIFICATION_ENABLED=true
NOTIFICATION_AQI_THRESHOLD=100
```

#### **Localização Padrão**
```bash
DEFAULT_LATITUDE=-15.7801
DEFAULT_LONGITUDE=-56.0889
DEFAULT_CITY=Cuiabá
DEFAULT_STATE=MT
DEFAULT_COUNTRY=BR
```

#### **APIs Externas**
```bash
OMS_API_URL=https://api.who.int
INPE_API_URL=http://queimadas.dgi.inpe.br/api
CETESB_API_URL=https://cetesb.sp.gov.br/ar/qualidade-do-ar
AIRNOW_API_URL=https://www.airnowapi.org/aq/forecast
OPENAQ_API_URL=https://api.openaq.org/v2
```

#### **Desenvolvimento**
```bash
NODE_ENV=development
DEBUG_MODE=true
LOG_LEVEL=info
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
```

## 🚀 Como Usar

### 1. Configuração Inicial

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Configure suas chaves reais:**
   - Edite o arquivo `.env` com suas chaves de API
   - Substitua os valores `your_*_api_key_here` pelas chaves reais

### 2. Uso nos Serviços

Todos os serviços agora usam as configurações centralizadas:

```typescript
import config from '../config/environment';

// Exemplo: GeminiAIService
const geminiAIService = new GeminiAIService({
  apiKey: config.google.geminiApiKey,
  model: config.google.geminiModel
});

// Exemplo: AIRSService
const airsService = new AIRSService({
  baseUrl: config.nasa.airsBaseUrl,
  dataset: config.nasa.airsDataset,
  authToken: config.nasa.earthDataToken
});
```

### 3. Validação de Configuração

Execute o comando de validação:

```bash
npm run env:validate
```

Isso verificará se todas as configurações obrigatórias estão definidas.

## 🔒 Segurança

### 1. Arquivo .env

- ✅ **Nunca commite** o arquivo `.env` no Git
- ✅ **Use .env.example** como template
- ✅ **Mantenha as chaves** em local seguro

### 2. Valores Padrão

- ✅ **Valores de exemplo** são usados em desenvolvimento
- ✅ **Validação** alerta sobre chaves não configuradas
- ✅ **Fallbacks** para URLs e configurações básicas

### 3. Produção

Para produção, configure as variáveis de ambiente no seu provedor de hospedagem:

- **Vercel**: Configurações no dashboard
- **Netlify**: Site settings > Environment variables
- **Heroku**: `heroku config:set KEY=value`

## 📁 Estrutura de Arquivos

```
src/
├── config/
│   └── environment.ts          # Configuração centralizada
├── services/
│   ├── GeminiAIService.ts     # Usa config.google.*
│   ├── AIRSService.ts         # Usa config.nasa.*
│   ├── WorldViewService.ts    # Usa config.nasa.*
│   ├── TEMPOService.ts        # Usa config.nasa.*
│   ├── EarthDataService.ts    # Usa config.nasa.*
│   └── IQAirService.ts        # Usa config.airQuality.*
└── ...
.env.example                   # Template de configuração
.env                          # Suas configurações (não commitado)
```

## 🛠️ Funções Utilitárias

### Validação de Configuração

```typescript
import { validateConfig } from '../config/environment';

const { isValid, errors } = validateConfig();
if (!isValid) {
  console.error('Erros de configuração:', errors);
}
```

### Verificação de Ambiente

```typescript
import { isDevelopment, isDebugEnabled } from '../config/environment';

if (isDevelopment()) {
  console.log('Modo de desenvolvimento ativo');
}

if (isDebugEnabled()) {
  console.log('Debug habilitado');
}
```

### Obter Configuração Específica

```typescript
import { getApiConfig } from '../config/environment';

const nasaConfig = getApiConfig('nasa');
const googleConfig = getApiConfig('google');
```

## ⚠️ Troubleshooting

### Erro: "API Key não configurada"

1. Verifique se o arquivo `.env` existe
2. Confirme se a variável está definida corretamente
3. Execute `npm run env:validate` para verificar

### Erro: "URL inválida"

1. Verifique se as URLs estão corretas
2. Confirme se não há espaços extras
3. Teste a conectividade com as APIs

### Erro: "Token expirado"

1. Gere um novo token na NASA EarthData
2. Atualize a variável `NASA_EARTHDATA_TOKEN`
3. Reinicie o aplicativo

## 📚 Recursos Adicionais

- [NASA EarthData Login](https://urs.earthdata.nasa.gov/)
- [Google AI Studio](https://aistudio.google.com/)
- [IQAir API](https://www.iqair.com/air-pollution-data-api)
- [OpenWeatherMap API](https://openweathermap.org/api)

---

**Nota**: Mantenha sempre suas chaves de API seguras e nunca as compartilhe publicamente! 🔐
