import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { AirQualityData } from './AirQualityService';

// Configurar como as notificações são tratadas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationSettings {
  airQualityAlerts: boolean;
  forecastUpdates: boolean;
  communityPosts: boolean;
  achievementUnlocks: boolean;
  weeklyReports: boolean;
}

export interface AlertThresholds {
  aqiWarning: number;
  aqiDanger: number;
  pm25Warning: number;
  pm25Danger: number;
}

class NotificationService {
  private static instance: NotificationService;
  private settings: NotificationSettings = {
    airQualityAlerts: true,
    forecastUpdates: true,
    communityPosts: false,
    achievementUnlocks: true,
    weeklyReports: true,
  };
  private alertThresholds: AlertThresholds = {
    aqiWarning: 100,
    aqiDanger: 150,
    pm25Warning: 35,
    pm25Danger: 55,
  };

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Inicializa o serviço de notificações
   */
  async initialize(): Promise<void> {
    try {
      // Verificar se o dispositivo suporta notificações push
      if (!Device.isDevice) {
        console.warn('Notificações push não funcionam em simuladores');
        return;
      }

      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Permissão para notificações negada');
      }

      // Configurar canal de notificação para Android
      if (Platform.OS === 'android') {
        await this.createNotificationChannel();
      }

      console.log('Serviço de notificações inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
      throw error;
    }
  }

  /**
   * Cria canal de notificação para Android
   */
  private async createNotificationChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync('air-quality-alerts', {
      name: 'Alertas de Qualidade do Ar',
      description: 'Notificações sobre qualidade do ar e alertas de saúde',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF0000',
    });

    await Notifications.setNotificationChannelAsync('forecast-updates', {
      name: 'Atualizações de Previsão',
      description: 'Previsões diárias da qualidade do ar',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync('community-updates', {
      name: 'Atualizações da Comunidade',
      description: 'Novas contribuições da comunidade',
      importance: Notifications.AndroidImportance.LOW,
    });
  }

  /**
   * Verifica e envia alertas de qualidade do ar
   */
  async checkAndSendAirQualityAlert(airQualityData: AirQualityData): Promise<void> {
    if (!this.settings.airQualityAlerts) return;

    const { aqi, level, description, location } = airQualityData;
    
    // Verificar se deve enviar alerta
    if (aqi >= this.alertThresholds.aqiWarning) {
      const alertType = aqi >= this.alertThresholds.aqiDanger ? 'danger' : 'warning';
      
      await this.sendAirQualityAlert({
        title: this.getAlertTitle(alertType, level),
        body: this.getAlertBody(description, location.address),
        data: {
          type: 'air-quality-alert',
          aqi,
          level,
          location: location.address,
        },
        channelId: 'air-quality-alerts',
      });
    }
  }

  /**
   * Envia notificação de previsão diária
   */
  async sendForecastNotification(forecastData: any): Promise<void> {
    if (!this.settings.forecastUpdates) return;

    const { aqi, level, description } = forecastData;
    
    await this.sendNotification({
      title: 'Previsão de Hoje',
      body: `Qualidade do ar: ${level} (AQI ${aqi}) - ${description}`,
      data: {
        type: 'forecast-update',
        aqi,
        level,
      },
      channelId: 'forecast-updates',
    });
  }

  /**
   * Envia notificação de conquista desbloqueada
   */
  async sendAchievementNotification(achievement: any): Promise<void> {
    if (!this.settings.achievementUnlocks) return;

    await this.sendNotification({
      title: '🏆 Conquista Desbloqueada!',
      body: `Você ganhou a conquista "${achievement.title}"`,
      data: {
        type: 'achievement-unlock',
        achievementId: achievement.id,
      },
    });
  }

  /**
   * Agenda notificação de relatório semanal
   */
  async scheduleWeeklyReport(): Promise<void> {
    if (!this.settings.weeklyReports) return;

    // Agendar para todo domingo às 9h
    const trigger = {
      weekday: 1, // Domingo
      hour: 9,
      minute: 0,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Relatório Semanal',
        body: 'Veja como foi sua semana de contribuições para o AirMetrics!',
        data: {
          type: 'weekly-report',
        },
      },
      trigger,
    });
  }

  /**
   * Envia notificação personalizada
   */
  async sendNotification(notification: {
    title: string;
    body: string;
    data?: any;
    channelId?: string;
  }): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
        },
        trigger: null, // Enviar imediatamente
        ...(notification.channelId && { channelId: notification.channelId }),
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  /**
   * Envia alerta de qualidade do ar
   */
  private async sendAirQualityAlert(alert: {
    title: string;
    body: string;
    data: any;
    channelId: string;
  }): Promise<void> {
    await this.sendNotification({
      title: alert.title,
      body: alert.body,
      data: alert.data,
      channelId: alert.channelId,
    });
  }

  /**
   * Obtém título do alerta baseado no tipo
   */
  private getAlertTitle(type: 'warning' | 'danger', level: string): string {
    if (type === 'danger') {
      return '🚨 Alerta de Saúde!';
    }
    return '⚠️ Atenção - Qualidade do Ar';
  }

  /**
   * Obtém corpo do alerta
   */
  private getAlertBody(description: string, location?: string): string {
    const locationText = location ? ` em ${location}` : '';
    return `${description}${locationText}. Verifique as recomendações no app.`;
  }

  /**
   * Atualiza configurações de notificação
   */
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Atualiza thresholds de alerta
   */
  updateAlertThresholds(newThresholds: Partial<AlertThresholds>): void {
    this.alertThresholds = { ...this.alertThresholds, ...newThresholds };
  }

  /**
   * Obtém configurações atuais
   */
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Obtém thresholds atuais
   */
  getAlertThresholds(): AlertThresholds {
    return { ...this.alertThresholds };
  }

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Obtém notificações pendentes
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export default NotificationService;
