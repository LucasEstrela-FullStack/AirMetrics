import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIResponse } from '../services/GeminiAIService';

interface AIResponseCardProps {
  response: AIResponse;
  onHelpful: (responseId: string) => void;
  onNotHelpful: (responseId: string) => void;
  onShare: (response: AIResponse) => void;
}

const AIResponseCard: React.FC<AIResponseCardProps> = ({
  response,
  onHelpful,
  onNotHelpful,
  onShare
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted) {
      onHelpful(response.id);
      setHasVoted(true);
    }
  };

  const handleNotHelpful = () => {
    if (!hasVoted) {
      onNotHelpful(response.id);
      setHasVoted(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🤖 Resposta da AirMetrics AI:\n\n"${response.question}"\n\n${response.answer}\n\nFonte: AirMetrics App`,
        title: 'Resposta da IA - AirMetrics'
      });
      onShare(response);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FF9800';
    return '#F44336';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta confiança';
    if (confidence >= 0.6) return 'Média confiança';
    return 'Baixa confiança';
  };

  return (
    <View style={styles.container}>
      {/* Header da IA */}
      <View style={styles.header}>
        <View style={styles.aiInfo}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiEmoji}>{response.author.avatar}</Text>
          </View>
          <View style={styles.aiDetails}>
            <Text style={styles.aiName}>{response.author.name}</Text>
            <View style={styles.confidenceContainer}>
              <View 
                style={[
                  styles.confidenceDot, 
                  { backgroundColor: getConfidenceColor(response.confidence) }
                ]} 
              />
              <Text style={styles.confidenceText}>
                {getConfidenceText(response.confidence)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Resposta da IA */}
      <View style={styles.content}>
        <Text style={styles.answer}>{response.answer}</Text>
        
        {/* Tags */}
        {response.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {response.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Informações expandidas */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Fontes */}
          {response.sources.length > 0 && (
            <View style={styles.sourcesContainer}>
              <Text style={styles.sourcesTitle}>Fontes:</Text>
              {response.sources.map((source, index) => (
                <Text key={index} style={styles.sourceText}>• {source}</Text>
              ))}
            </View>
          )}
          
          {/* Timestamp */}
          <Text style={styles.timestamp}>
            Respondido em {new Date(response.timestamp).toLocaleString('pt-BR')}
          </Text>
        </View>
      )}

      {/* Ações */}
      <View style={styles.footer}>
        <View style={styles.voteContainer}>
          <TouchableOpacity 
            style={[styles.voteButton, hasVoted && styles.votedButton]}
            onPress={handleHelpful}
            disabled={hasVoted}
          >
            <Ionicons 
              name="thumbs-up" 
              size={16} 
              color={hasVoted ? '#4CAF50' : '#666'} 
            />
            <Text style={[
              styles.voteText, 
              hasVoted && styles.votedText
            ]}>
              Útil ({response.helpful})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.voteButton, hasVoted && styles.votedButton]}
            onPress={handleNotHelpful}
            disabled={hasVoted}
          >
            <Ionicons 
              name="thumbs-down" 
              size={16} 
              color={hasVoted ? '#F44336' : '#666'} 
            />
            <Text style={[
              styles.voteText, 
              hasVoted && styles.votedText
            ]}>
              Não útil ({response.notHelpful})
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share" size={16} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  aiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiEmoji: {
    fontSize: 20,
  },
  aiDetails: {
    flex: 1,
  },
  aiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  sourcesContainer: {
    marginBottom: 12,
  },
  sourcesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  votedButton: {
    backgroundColor: '#E8F5E8',
  },
  voteText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  votedText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  shareButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
  },
});

export default AIResponseCard;
