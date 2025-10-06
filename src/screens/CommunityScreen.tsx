import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import geminiAIService, { AIResponse, CommunityQuestion } from '../services/GeminiAIService';
import AIResponseCard from '../components/AIResponseCard';

interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: string;
  };
  location: string;
  content: string;
  type: 'observation' | 'tip' | 'question';
  timestamp: string;
  likes: number;
  comments: number;
  airQuality?: {
    aqi: number;
    level: string;
    color: string;
  };
  image?: string;
  aiResponses?: AIResponse[];
  hasAIResponse?: boolean;
}

interface UserStats {
  level: string;
  points: number;
  posts: number;
  contributions: number;
  badge: string;
}

const CommunityScreen = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 'Iniciante',
    points: 150,
    posts: 3,
    contributions: 8,
    badge: '🌱'
  });
  const [newPost, setNewPost] = useState('');
  const [selectedType, setSelectedType] = useState<'observation' | 'tip' | 'question'>('observation');
  const [showNewPost, setShowNewPost] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  useEffect(() => {
    generateMockPosts();
    loadAISuggestions();
  }, []);

  const loadAISuggestions = async () => {
    try {
      const suggestions = await geminiAIService.generateQuestionSuggestions();
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Erro ao carregar sugestões da IA:', error);
    }
  };

  const generateMockPosts = () => {
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        user: {
          name: 'Maria Silva',
          avatar: '👩‍🔬',
          level: 'Especialista'
        },
        location: 'São Paulo, SP',
        content: 'Hoje o ar está muito pesado na região central. Recomendo evitar exercícios ao ar livre.',
        type: 'observation',
        timestamp: '2 horas atrás',
        likes: 12,
        comments: 5,
        airQuality: {
          aqi: 145,
          level: 'Insalubre',
          color: '#F44336'
        }
      },
      {
        id: '2',
        user: {
          name: 'João Santos',
          avatar: '👨‍🏫',
          level: 'Educador'
        },
        location: 'Rio de Janeiro, RJ',
        content: 'Dica: Plantas como lírio-da-paz e espada-de-são-jorge ajudam a purificar o ar interno!',
        type: 'tip',
        timestamp: '4 horas atrás',
        likes: 18,
        comments: 3
      },
      {
        id: '3',
        user: {
          name: 'Ana Costa',
          avatar: '👩‍💼',
          level: 'Iniciante'
        },
        location: 'Belo Horizonte, MG',
        content: 'Alguém sabe se máscaras N95 são realmente eficazes contra poluição?',
        type: 'question',
        timestamp: '6 horas atrás',
        likes: 8,
        comments: 7
      },
      {
        id: '4',
        user: {
          name: 'Carlos Oliveira',
          avatar: '👨‍🔧',
          level: 'Contribuidor'
        },
        location: 'Brasília, DF',
        content: 'Fotografei uma queimada próxima ao parque. AQI subiu para 180! 😷',
        type: 'observation',
        timestamp: '8 horas atrás',
        likes: 15,
        comments: 12,
        airQuality: {
          aqi: 180,
          level: 'Muito Insalubre',
          color: '#9C27B0'
        }
      }
    ];
    setPosts(mockPosts);
  };

  const handleNewPost = () => {
    if (!newPost.trim()) {
      Alert.alert('Erro', 'Digite algo para compartilhar!');
      return;
    }

    const post: CommunityPost = {
      id: Date.now().toString(),
      user: {
        name: 'Você',
        avatar: '👤',
        level: userStats.level
      },
      location: 'Sua localização',
      content: newPost,
      type: selectedType,
      timestamp: 'Agora',
      likes: 0,
      comments: 0,
      airQuality: {
        aqi: Math.floor(Math.random() * 150) + 50,
        level: 'Moderado',
        color: '#FF9800'
      }
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setShowNewPost(false);
    
    // Atualizar estatísticas do usuário
    setUserStats(prev => ({
      ...prev,
      posts: prev.posts + 1,
      points: prev.points + 10
    }));
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleAskAI = async (post: CommunityPost) => {
    if (post.type !== 'question') return;
    
    setLoadingAI(true);
    try {
      console.log('🤖 Solicitando resposta da IA para:', post.content);
      
      const question: CommunityQuestion = {
        id: post.id,
        title: post.content.substring(0, 100) + '...',
        content: post.content,
        author: {
          name: post.user.name,
          avatar: post.user.avatar,
          level: parseInt(post.user.level) || 1
        },
        timestamp: post.timestamp,
        tags: [],
        location: {
          city: 'Cuiabá',
          state: 'MT'
        },
        aqi: post.airQuality?.aqi,
        responses: [],
        likes: post.likes,
        views: 0
      };
      
      const aiResponse = await geminiAIService.generateAIResponse(question);
      
      // Atualizar o post com a resposta da IA
      setPosts(posts.map(p => 
        p.id === post.id 
          ? { 
              ...p, 
              aiResponses: [...(p.aiResponses || []), aiResponse],
              hasAIResponse: true
            }
          : p
      ));
      
      Alert.alert('Sucesso', 'Resposta da IA adicionada!');
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      Alert.alert('Erro', 'Não foi possível gerar resposta da IA');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAIHelpful = (responseId: string) => {
    setPosts(posts.map(post => ({
      ...post,
      aiResponses: post.aiResponses?.map(response => 
        response.id === responseId 
          ? { ...response, helpful: response.helpful + 1 }
          : response
      )
    })));
  };

  const handleAINotHelpful = (responseId: string) => {
    setPosts(posts.map(post => ({
      ...post,
      aiResponses: post.aiResponses?.map(response => 
        response.id === responseId 
          ? { ...response, notHelpful: response.notHelpful + 1 }
          : response
      )
    })));
  };

  const handleAIShare = (response: AIResponse) => {
    console.log('Compartilhando resposta da IA:', response.id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'observation':
        return 'eye-outline';
      case 'tip':
        return 'bulb-outline';
      case 'question':
        return 'help-circle-outline';
      default:
        return 'chatbubble-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'observation':
        return '#2196F3';
      case 'tip':
        return '#4CAF50';
      case 'question':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const renderPost = ({ item }: { item: CommunityPost }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userAvatar}>{item.user.avatar}</Text>
          <View>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.userLevel}>{item.user.level}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <View style={styles.postLocation}>
        <Ionicons name="location-outline" size={14} color="#666" />
        <Text style={styles.locationText}>{item.location}</Text>
        {item.airQuality && (
          <View style={[styles.aqiBadge, { backgroundColor: item.airQuality.color }]}>
            <Text style={styles.aqiText}>AQI {item.airQuality.aqi}</Text>
          </View>
        )}
      </View>

      <View style={styles.postType}>
        <Ionicons 
          name={getTypeIcon(item.type) as any} 
          size={16} 
          color={getTypeColor(item.type)} 
        />
        <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
          {item.type === 'observation' ? 'Observação' : 
           item.type === 'tip' ? 'Dica' : 'Pergunta'}
        </Text>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons name="heart-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        
        {item.type === 'question' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.aiButton]}
            onPress={() => handleAskAI(item)}
            disabled={loadingAI}
          >
            <Ionicons name="bulb-outline" size={20} color="#FF9800" />
            <Text style={[styles.actionText, styles.aiButtonText]}>
              {loadingAI ? 'IA pensando...' : 'Perguntar à IA'}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Respostas da IA */}
      {item.aiResponses && item.aiResponses.length > 0 && (
        <View style={styles.aiResponsesContainer}>
          <View style={styles.aiResponsesHeader}>
            <Ionicons name="bulb" size={16} color="#FF9800" />
            <Text style={styles.aiResponsesTitle}>
              Respostas da IA ({item.aiResponses.length})
            </Text>
            <TouchableOpacity
              onPress={() => setExpandedPost(expandedPost === item.id ? null : item.id)}
            >
              <Ionicons 
                name={expandedPost === item.id ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          
          {expandedPost === item.id && (
            <View style={styles.aiResponsesList}>
              {item.aiResponses.map((response) => (
                <AIResponseCard
                  key={response.id}
                  response={response}
                  onHelpful={handleAIHelpful}
                  onNotHelpful={handleAINotHelpful}
                  onShare={handleAIShare}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }} nestedScrollEnabled>
      {/* Header com estatísticas do usuário */}
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.userHeader}
      >
        <View style={styles.userStats}>
          <Text style={styles.userBadge}>{userStats.badge}</Text>
          <View>
            <Text style={styles.userLevelText}>{userStats.level}</Text>
            <Text style={styles.userPointsText}>{userStats.points} pontos</Text>
          </View>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.contributions}</Text>
            <Text style={styles.statLabel}>Contribuições</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Sugestões da IA */}
      {aiSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>💡 Sugestões da IA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {aiSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => {
                  setNewPost(suggestion);
                  setSelectedType('question');
                  setShowNewPost(true);
                }}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Botão de novo post */}
      <TouchableOpacity 
        style={styles.newPostButton}
        onPress={() => setShowNewPost(true)}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.newPostText}>Nova Contribuição</Text>
      </TouchableOpacity>

      {/* Modal de novo post */}
      {showNewPost && (
        <View style={styles.newPostModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Compartilhar com a Comunidade</Text>
            
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'observation' && styles.typeButtonActive
                ]}
                onPress={() => setSelectedType('observation')}
              >
                <Ionicons name="eye-outline" size={20} color={selectedType === 'observation' ? 'white' : '#2196F3'} />
                <Text style={[
                  styles.typeButtonText,
                  selectedType === 'observation' && styles.typeButtonTextActive
                ]}>
                  Observação
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'tip' && styles.typeButtonActive
                ]}
                onPress={() => setSelectedType('tip')}
              >
                <Ionicons name="bulb-outline" size={20} color={selectedType === 'tip' ? 'white' : '#4CAF50'} />
                <Text style={[
                  styles.typeButtonText,
                  selectedType === 'tip' && styles.typeButtonTextActive
                ]}>
                  Dica
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'question' && styles.typeButtonActive
                ]}
                onPress={() => setSelectedType('question')}
              >
                <Ionicons name="help-circle-outline" size={20} color={selectedType === 'question' ? 'white' : '#FF9800'} />
                <Text style={[
                  styles.typeButtonText,
                  selectedType === 'question' && styles.typeButtonTextActive
                ]}>
                  Pergunta
                </Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.postInput}
              placeholder="Compartilhe sua experiência, dica ou pergunta..."
              value={newPost}
              onChangeText={setNewPost}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewPost(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleNewPost}
              >
                <Text style={styles.shareText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Lista de posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.postsList}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userHeader: {
    padding: 20,
    paddingTop: 40,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userBadge: {
    fontSize: 32,
    marginRight: 15,
  },
  userLevelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userPointsText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  newPostButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  newPostText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  suggestionChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  suggestionText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  aiButton: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  aiButtonText: {
    color: '#FF9800',
    fontWeight: '600',
  },
  aiResponsesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  aiResponsesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiResponsesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
    flex: 1,
  },
  aiResponsesList: {
    marginTop: 8,
  },
  newPostModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  postInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  shareButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#4CAF50',
  },
  shareText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: 'white',
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 24,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userLevel: {
    fontSize: 12,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  postLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginRight: 10,
  },
  aqiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  aqiText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  postType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
});

export default CommunityScreen;
