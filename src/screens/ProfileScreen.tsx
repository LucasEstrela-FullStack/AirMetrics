import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface UserProfile {
  name: string;
  email: string;
  level: string;
  points: number;
  badge: string;
  joinDate: string;
  stats: {
    posts: number;
    contributions: number;
    daysActive: number;
    alertsReceived: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    date?: string;
  }>;
}

interface NotificationSettings {
  airQualityAlerts: boolean;
  forecastUpdates: boolean;
  communityPosts: boolean;
  achievementUnlocks: boolean;
  weeklyReports: boolean;
}

const ProfileScreen = () => {
  const [profile] = useState<UserProfile>({
    name: 'Usuário AirMetrics',
    email: 'usuario@AirMetrics.com',
    level: 'Especialista',
    points: 1250,
    badge: '🌍',
    joinDate: '15 de Janeiro, 2024',
    stats: {
      posts: 12,
      contributions: 28,
      daysActive: 45,
      alertsReceived: 8,
    },
    achievements: [
      {
        id: '1',
        title: 'Primeiro Post',
        description: 'Compartilhou sua primeira observação',
        icon: 'chatbubble-outline',
        unlocked: true,
        date: '20 de Jan, 2024'
      },
      {
        id: '2',
        title: 'Observador Ativo',
        description: 'Fez 10 contribuições à comunidade',
        icon: 'eye-outline',
        unlocked: true,
        date: '5 de Fev, 2024'
      },
      {
        id: '3',
        title: 'Protetor do Ar',
        description: 'Recebeu 5 alertas de qualidade do ar',
        icon: 'shield-outline',
        unlocked: true,
        date: '12 de Fev, 2024'
      },
      {
        id: '4',
        title: 'Educador Ambiental',
        description: 'Compartilhou 20 dicas úteis',
        icon: 'school-outline',
        unlocked: false,
      },
      {
        id: '5',
        title: 'Especialista',
        description: 'Atingiu 1000 pontos',
        icon: 'trophy-outline',
        unlocked: true,
        date: '1 de Mar, 2024'
      },
      {
        id: '6',
        title: 'Veterano',
        description: 'Usuário há mais de 30 dias',
        icon: 'time-outline',
        unlocked: true,
        date: '14 de Fev, 2024'
      }
    ]
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    airQualityAlerts: true,
    forecastUpdates: true,
    communityPosts: false,
    achievementUnlocks: true,
    weeklyReports: true,
  });

  const handleNotificationToggle = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Funcionalidade em desenvolvimento');
  };

  const handleShareApp = () => {
    Alert.alert('Compartilhar App', 'Compartilhando AirMetrics...');
  };

  const handleContactSupport = () => {
    Alert.alert('Suporte', 'Entre em contato: suporte@AirMetrics.com');
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o AirMetrics',
      'AirMetrics v1.0.0\n\nUm aplicativo para monitoramento da qualidade do ar em tempo real, com foco em saúde pública e conscientização ambiental.\n\nDesenvolvido com ❤️ para proteger sua saúde.'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => console.log('Logout') }
      ]
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return '#4CAF50';
      case 'Contribuidor':
        return '#2196F3';
      case 'Especialista':
        return '#FF9800';
      case 'Mestre':
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  const unlockedAchievements = profile.achievements.filter(a => a.unlocked);
  const lockedAchievements = profile.achievements.filter(a => !a.unlocked);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header do perfil */}
      <LinearGradient
        colors={[getLevelColor(profile.level), `${getLevelColor(profile.level)}CC`]}
        style={styles.profileHeader}
      >
        <View style={styles.profileInfo}>
          <Text style={styles.profileBadge}>{profile.badge}</Text>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileLevel}>{profile.level}</Text>
            <Text style={styles.profilePoints}>{profile.points} pontos</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Estatísticas */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="chatbubble-outline" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{profile.stats.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{profile.stats.contributions}</Text>
            <Text style={styles.statLabel}>Contribuições</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>{profile.stats.daysActive}</Text>
            <Text style={styles.statLabel}>Dias Ativos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="notifications-outline" size={24} color="#F44336" />
            <Text style={styles.statNumber}>{profile.stats.alertsReceived}</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>
        </View>
      </View>

      {/* Conquistas */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Conquistas</Text>
        <Text style={styles.achievementsSubtitle}>
          {unlockedAchievements.length} de {profile.achievements.length} desbloqueadas
        </Text>
        
        <View style={styles.achievementsGrid}>
          {profile.achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementCardLocked
              ]}
            >
              <Ionicons
                name={achievement.icon as any}
                size={24}
                color={achievement.unlocked ? '#4CAF50' : '#ccc'}
              />
              <Text style={[
                styles.achievementTitle,
                !achievement.unlocked && styles.achievementTitleLocked
              ]}>
                {achievement.title}
              </Text>
              <Text style={[
                styles.achievementDescription,
                !achievement.unlocked && styles.achievementDescriptionLocked
              ]}>
                {achievement.description}
              </Text>
              {achievement.unlocked && achievement.date && (
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Configurações de notificação */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="car-outline" size={20} color="#2196F3" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Alertas de Qualidade do Ar</Text>
              <Text style={styles.settingDescription}>Receba alertas quando a qualidade do ar estiver ruim</Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.airQualityAlerts}
            onValueChange={() => handleNotificationToggle('airQualityAlerts')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationSettings.airQualityAlerts ? '#2196F3' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="cloud-outline" size={20} color="#FF9800" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Atualizações de Previsão</Text>
              <Text style={styles.settingDescription}>Receba previsões diárias da qualidade do ar</Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.forecastUpdates}
            onValueChange={() => handleNotificationToggle('forecastUpdates')}
            trackColor={{ false: '#767577', true: '#ffb366' }}
            thumbColor={notificationSettings.forecastUpdates ? '#FF9800' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="people-outline" size={20} color="#4CAF50" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Posts da Comunidade</Text>
              <Text style={styles.settingDescription}>Notificações sobre novas contribuições</Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.communityPosts}
            onValueChange={() => handleNotificationToggle('communityPosts')}
            trackColor={{ false: '#767577', true: '#a5d6a7' }}
            thumbColor={notificationSettings.communityPosts ? '#4CAF50' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="trophy-outline" size={20} color="#9C27B0" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Conquistas Desbloqueadas</Text>
              <Text style={styles.settingDescription}>Notificações quando ganhar novas conquistas</Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.achievementUnlocks}
            onValueChange={() => handleNotificationToggle('achievementUnlocks')}
            trackColor={{ false: '#767577', true: '#ce93d8' }}
            thumbColor={notificationSettings.achievementUnlocks ? '#9C27B0' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Menu de opções */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleShareApp}>
          <Ionicons name="share-outline" size={24} color="#2196F3" />
          <Text style={styles.menuText}>Compartilhar App</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleContactSupport}>
          <Ionicons name="help-circle-outline" size={24} color="#FF9800" />
          <Text style={styles.menuText}>Suporte</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
          <Ionicons name="information-circle-outline" size={24} color="#4CAF50" />
          <Text style={styles.menuText}>Sobre</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={[styles.menuText, styles.logoutText]}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileBadge: {
    fontSize: 48,
    marginRight: 15,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileLevel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 2,
  },
  profilePoints: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 2,
  },
  editButton: {
    padding: 10,
  },
  statsSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: -10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  achievementsSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 80) / 2,
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  achievementCardLocked: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  achievementTitleLocked: {
    color: '#999',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  achievementDescriptionLocked: {
    color: '#ccc',
  },
  achievementDate: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 4,
  },
  settingsSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#F44336',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ProfileScreen;
