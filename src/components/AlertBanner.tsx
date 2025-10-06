import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface AlertBannerProps {
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  onDismiss?: () => void;
  onAction?: () => void;
  actionText?: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  title,
  message,
  onDismiss,
  onAction,
  actionText = 'Ver mais'
}) => {
  const getColors = () => {
    switch (type) {
      case 'warning':
        return {
          colors: ['#FF9800', '#F57C00'],
          icon: 'warning-outline' as keyof typeof Ionicons.glyphMap,
        };
      case 'danger':
        return {
          colors: ['#F44336', '#D32F2F'],
          icon: 'alert-circle-outline' as keyof typeof Ionicons.glyphMap,
        };
      case 'info':
        return {
          colors: ['#2196F3', '#1976D2'],
          icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
        };
      case 'success':
        return {
          colors: ['#4CAF50', '#388E3C'],
          icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
        };
      default:
        return {
          colors: ['#9E9E9E', '#757575'],
          icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
        };
    }
  };

  const { colors, icon } = getColors();

  return (
    <LinearGradient colors={colors} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="white" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        
        <View style={styles.actions}>
          {onAction && (
            <TouchableOpacity style={styles.actionButton} onPress={onAction}>
              <Text style={styles.actionText}>{actionText}</Text>
            </TouchableOpacity>
          )}
          
          {onDismiss && (
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
});

export default AlertBanner;
