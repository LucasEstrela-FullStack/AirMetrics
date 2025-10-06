import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TokenInfo {
  uid: string;
  exp: number;
  issuer: string;
  identityProvider: string;
  valid: boolean;
  expiresIn: string;
}

const TokenStatus: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    decodeToken();
  }, []);

  const decodeToken = () => {
    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imd1YXJkYV9vbnl4IiwiZXhwIjoxNzY0ODAyMzk5LCJpYXQiOjE3NTk2MTgzOTksImlzcyI6Imh0dHBzOi8vdXJzLmVhcnRoZGF0YS5uYXNhLmdvdiIsImlkZW50aXR5X3Byb3ZpZGVyIjoiZWRsX29wcyIsImFjciI6ImVkbCIsImFzc3VyYW5jZV9sZXZlbCI6M30.cuPAv-F6_p_o5ZpUFwIoW0jsS0Hi9E0JK5CbnZ0jUS0UB44xWp4pPei9GqmwYuTYpjoN6me64FtkraVVTb1ZXyKkwShQtkW8YXS_0v8buoQO81j04Yqm04y5e7OaRkCLADajyjXdA0zTedaMrtVGgt3BFOt02RtgL9w8ZQYWMvzCCTw7mGlZSOTmKuqxXQtbAriDViniRbxNS-KrZ_ZqKiCM6ayM9yOfT8A8S7j8l6rNrxcTv-xeQKFPfPsAmVGg-M1AGZHHjJUIdQENnplfTutegxzUQwcQz3WzwDCdRQcVx6yavfZXDayQOQrFx0kAdYfTemFcaTNCWwV44BvGpA';
      
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Token inválido');
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const now = Math.floor(Date.now() / 1000);
      const valid = payload.exp > now;
      
      const expiresIn = valid 
        ? `${Math.floor((payload.exp - now) / (24 * 60 * 60))} dias`
        : 'Expirado';

      setTokenInfo({
        uid: payload.uid,
        exp: payload.exp,
        issuer: payload.iss,
        identityProvider: payload.identity_provider,
        valid,
        expiresIn,
      });
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      Alert.alert('Erro', 'Falha ao decodificar token');
    }
  };

  const getStatusColor = () => {
    if (!tokenInfo) return '#666';
    return tokenInfo.valid ? '#4CAF50' : '#F44336';
  };

  const getStatusIcon = () => {
    if (!tokenInfo) return 'help-circle-outline';
    return tokenInfo.valid ? 'checkmark-circle' : 'close-circle';
  };

  if (!tokenInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando informações do token...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerContent}>
          <Ionicons name={getStatusIcon()} size={24} color={getStatusColor()} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Token NASA EarthData</Text>
            <Text style={[styles.status, { color: getStatusColor() }]}>
              {tokenInfo.valid ? 'Válido' : 'Expirado'} • {tokenInfo.expiresIn}
            </Text>
          </View>
          <Ionicons 
            name={expanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#666" 
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={16} color="#666" />
            <Text style={styles.detailLabel}>Usuário:</Text>
            <Text style={styles.detailValue}>{tokenInfo.uid}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="server" size={16} color="#666" />
            <Text style={styles.detailLabel}>Servidor:</Text>
            <Text style={styles.detailValue}>{tokenInfo.issuer}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="shield-checkmark" size={16} color="#666" />
            <Text style={styles.detailLabel}>Provedor:</Text>
            <Text style={styles.detailValue}>{tokenInfo.identityProvider}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.detailLabel}>Expira em:</Text>
            <Text style={styles.detailValue}>
              {new Date(tokenInfo.exp * 1000).toLocaleString('pt-BR')}
            </Text>
          </View>

          <View style={styles.accessInfo}>
            <Ionicons name="information-circle" size={16} color="#2196F3" />
            <Text style={styles.accessText}>
              Este token permite acesso a dados da NASA EarthData incluindo:
              {'\n'}• Dados de queimadas (MODIS FIRMS)
              {'\n'}• Dados TEMPO (qualidade do ar)
              {'\n'}• Imagens de satélite
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    marginTop: 2,
  },
  details: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontFamily: 'monospace',
  },
  accessInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  accessText: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default TokenStatus;
