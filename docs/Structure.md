### Arquitetura
- **Componentes reutilizáveis** em `src/components/`
- **Serviços** em `src/services/`
- **Sistema de tema** em `src/theme/`
- **Navegação** em `src/navigation/`
- **Telas** em `src/screens/`

## 🏗 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── AQICard.tsx
│   ├── AlertBanner.tsx
│   ├── DataGrid.tsx
│   ├── QuickActionCard.tsx
│   └── RecommendationsCard.tsx
├── navigation/           # Configuração de navegação
│   └── AppNavigator.tsx
├── screens/             # Telas do aplicativo
│   ├── HomeScreen.tsx
│   ├── MapScreen.tsx
│   ├── ForecastScreen.tsx
│   ├── CommunityScreen.tsx
│   └── ProfileScreen.tsx
├── services/            # Serviços e APIs
│   ├── AirQualityService.ts
│   ├── NotificationService.ts
│   └── EarthDataService.ts
└── theme/               # Sistema de design
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    └── index.ts
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app no seu dispositivo móvel

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seuusuario/AirMetrics.git
cd AirMetrics

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Executar no Dispositivo

1. **Expo Go**: Escaneie o QR code com o app Expo Go
2. **Android**: `npm run android` (requer Android Studio)
3. **iOS**: `npm run ios` (requer Xcode - apenas macOS)
4. **Web**: `npm run web`

## 📊 Funcionalidades Detalhadas

### 🏠 Home Screen
- **AQI em Tempo Real**: Card principal com índice de qualidade do ar
- **Recomendações**: Sugestões baseadas no nível de poluição
- **Ações Rápidas**: Botões para acessar outras funcionalidades
- **Dados Detalhados**: Grid com informações de poluentes (PM2.5, PM10, O₃, NO₂)

### 🗺 Map Screen
- **Mapa Interativo**: Visualização com marcadores de qualidade do ar
- **Círculos de Dispersão**: Indicadores visuais da área afetada
- **Legenda**: Guia de cores para interpretação do AQI
- **Detalhes**: Modal com informações detalhadas ao tocar nos marcadores

### 📈 Forecast Screen
- **Previsão 7 Dias**: Gráfico de tendência e lista de previsões
- **Previsão 24h**: Dados horários com ícones meteorológicos
- **Recomendações**: Sugestões baseadas na previsão
- **Dados Meteorológicos**: Temperatura, umidade e velocidade do vento

### 👥 Community Screen
- **Posts da Comunidade**: Observações, dicas e perguntas
- **Sistema de Conquistas**: Gamificação com pontos e badges
- **Estatísticas do Usuário**: Nível, pontos e contribuições
- **Criação de Posts**: Modal para compartilhar experiências

### 👤 Profile Screen
- **Perfil do Usuário**: Informações pessoais e estatísticas
- **Conquistas**: Sistema de badges e progressão
- **Configurações de Notificação**: Controle granular de alertas
- **Menu de Opções**: Suporte, sobre, compartilhar app

## 🎨 Sistema de Design

### Cores
- **Primary**: Verde (#4CAF50) - Representa ar limpo
- **Secondary**: Azul (#2196F3) - Informações e ações
- **AQI Colors**: 
  - Bom: Verde (#4CAF50)
  - Moderado: Laranja (#FF9800)
  - Insalubre: Vermelho (#F44336)
  - Muito Insalubre: Roxo (#9C27B0)

### Tipografia
- **Font Family**: System (iOS/Android)
- **Hierarquia**: H1-H6, Body, Caption, Button
- **Pesos**: Normal (400), Medium (500), Bold (700)

### Componentes
- **AQICard**: Card principal com gradiente baseado no AQI
- **AlertBanner**: Banner de alertas com diferentes tipos
- **QuickActionCard**: Botões de ação rápida
- **DataGrid**: Grid responsivo para dados

## 🔧 Serviços

### AirQualityService
- Geração de dados simulados de qualidade do ar
- Cálculo de AQI e níveis baseados na localização
- Previsões de 7 dias e 24 horas
- Integração com geolocalização
- Simulação de poluentes (PM2.5, PM10, O₃, NO₂)

### NotificationService
- Alertas de qualidade do ar
- Notificações de previsão
- Conquistas desbloqueadas
- Configurações personalizáveis