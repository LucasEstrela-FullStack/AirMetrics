  # AirMetrics - Aplicativo de Qualidade do Ar

  AirMetrics é um aplicativo interativo para monitoramento da **qualidade do ar em tempo real**, utilizando dados de satélites e sensores, com foco em saúde pública, conscientização ambiental e z científica. O app transforma dados complexos em informação acessível, gamificada e útil para usuários de qualquer região.

  ## 🚀 Funcionalidades Implementadas

  ### ✅ Core Features
  - **Monitoramento em Tempo Real**: Visualização do AQI (Air Quality Index) com dados simulados
  - **Mapa Interativo**: Mapa com marcadores de qualidade do ar e círculos de dispersão
  - **Previsões**: Previsão de 7 dias e 24 horas com dados meteorológicos
  - **Comunidade**: Sistema de posts, conquistas e gamificação
  - **Perfil do Usuário**: Estatísticas, configurações e conquistas

  ### ✅ Interface e UX
  - **Navegação**: Bottom tabs com React Navigation
  - **Design System**: Sistema de cores, tipografia e componentes consistentes
  - **Componentes Reutilizáveis**: AQICard, AlertBanner, QuickActionCard, etc.
  - **Responsividade**: Interface adaptável para diferentes tamanhos de tela

  ### ✅ Serviços e Integração
  - **Geolocalização**: Integração com expo-location
  - **Notificações**: Sistema de alertas push com expo-notifications
  - **Serviços**: AirQualityService e NotificationService
  - **Tema**: Sistema de cores e tipografia padronizado

  ## 📱 Telas Implementadas

  1. **Home Screen**: Dashboard principal com AQI atual, recomendações e ações rápidas
  2. **Map Screen**: Mapa interativo com marcadores de qualidade do ar
  3. **Forecast Screen**: Previsões de qualidade do ar (7 dias e 24h)
  4. **Community Screen**: Posts da comunidade com sistema de conquistas
  5. **Profile Screen**: Perfil do usuário com estatísticas e configurações

  ## 🛠 Tech Stack

  ### Frontend Mobile
  - **React Native** com **Expo**
  - **TypeScript** para type safety
  - **React Navigation** (Stack + Bottom Tabs)
  - **React Native Maps** para mapas interativos
  - **Expo Linear Gradient** para gradientes
  - **Expo Vector Icons** para ícones

  ### Serviços
  - **Expo Location** para geolocalização
  - **Expo Notifications** para alertas push
  - **Expo Constants** para configurações

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
  │   └── NotificationService.ts
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
  - Cálculo de AQI e níveis
  - Previsões de 7 dias e 24 horas
  - Integração com geolocalização

  ### NotificationService
  - Alertas de qualidade do ar
  - Notificações de previsão
  - Conquistas desbloqueadas
  - Configurações personalizáveis

  ## 📱 Próximos Passos

  ### Funcionalidades Futuras
  - [ ] Integração com APIs reais (OpenWeatherMap, AirVisual)
  - [ ] Sistema de autenticação
  - [ ] Sincronização em nuvem
  - [ ] Modo offline
  - [ ] Widgets para tela inicial
  - [ ] Análise de tendências
  - [ ] Relatórios PDF
  - [ ] Integração com sensores IoT

  ### Melhorias Técnicas
  - [ ] Testes unitários e de integração
  - [ ] CI/CD pipeline
  - [ ] Monitoramento de erros (Sentry)
  - [ ] Analytics (Firebase Analytics)
  - [ ] Otimização de performance
  - [ ] Internacionalização (i18n)

  ## 🤝 Contribuição

  1. Fork o projeto
  2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
  3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
  4. Push para a branch (`git push origin feature/AmazingFeature`)
  5. Abra um Pull Request


  ## 👨‍💻 Desenvolvedores

  - **Equipe AirMetrics** - Desenvolvimento inicial
  ---

  **AirMetrics** - Protegendo sua saúde através da conscientização ambiental 🌍✨
