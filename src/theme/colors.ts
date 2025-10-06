export const colors = {
  // Primary colors
  primary: '#4CAF50',
  primaryDark: '#2E7D32',
  primaryLight: '#81C784',
  
  // Secondary colors
  secondary: '#2196F3',
  secondaryDark: '#1976D2',
  secondaryLight: '#64B5F6',
  
  // Air Quality colors
  aqi: {
    good: '#4CAF50',
    moderate: '#FF9800',
    unhealthy: '#F44336',
    veryUnhealthy: '#9C27B0',
    hazardous: '#795548',
  },
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Background colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
  },
  
  // Border colors
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
};

export const gradients = {
  primary: [colors.primary, colors.primaryDark],
  secondary: [colors.secondary, colors.secondaryDark],
  aqi: {
    good: [colors.aqi.good, `${colors.aqi.good}CC`],
    moderate: [colors.aqi.moderate, `${colors.aqi.moderate}CC`],
    unhealthy: [colors.aqi.unhealthy, `${colors.aqi.unhealthy}CC`],
    veryUnhealthy: [colors.aqi.veryUnhealthy, `${colors.aqi.veryUnhealthy}CC`],
  },
};

export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return colors.aqi.good;
  if (aqi <= 100) return colors.aqi.moderate;
  if (aqi <= 150) return colors.aqi.unhealthy;
  if (aqi <= 200) return colors.aqi.veryUnhealthy;
  return colors.aqi.hazardous;
};

export const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return 'Bom';
  if (aqi <= 100) return 'Moderado';
  if (aqi <= 150) return 'Insalubre para Grupos Sensíveis';
  if (aqi <= 200) return 'Insalubre';
  if (aqi <= 300) return 'Muito Insalubre';
  return 'Perigoso';
};

export const getAQIDescription = (aqi: number): string => {
  if (aqi <= 50) return 'Qualidade do ar satisfatória';
  if (aqi <= 100) return 'Qualidade do ar aceitável para a maioria';
  if (aqi <= 150) return 'Crianças e idosos devem evitar atividades ao ar livre';
  if (aqi <= 200) return 'Toda a população pode sentir efeitos na saúde';
  if (aqi <= 300) return 'Alerta de saúde: todos podem sentir efeitos sérios';
  return 'Alerta de saúde: emergência sanitária';
};

export const getAQIRecommendations = (aqi: number): string[] => {
  if (aqi <= 50) {
    return [
      'Ideal para atividades ao ar livre',
      'Ventile bem sua casa',
      'Exercite-se ao ar livre'
    ];
  } else if (aqi <= 100) {
    return [
      'Pessoas sensíveis devem ter cuidado',
      'Evite exercícios intensos ao ar livre',
      'Mantenha janelas abertas'
    ];
  } else if (aqi <= 150) {
    return [
      'Evite atividades ao ar livre',
      'Use máscara se necessário',
      'Mantenha janelas fechadas'
    ];
  } else if (aqi <= 200) {
    return [
      'Mantenha-se em ambientes fechados',
      'Use purificador de ar',
      'Evite exercícios ao ar livre'
    ];
  } else {
    return [
      'Fique em casa com janelas fechadas',
      'Use máscara N95',
      'Use purificador de ar com filtro HEPA'
    ];
  }
};
