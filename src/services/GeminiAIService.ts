// Serviço para integração com Google Gemini AI
// Respostas inteligentes para perguntas da comunidade sobre qualidade do ar

import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/environment';

export interface GeminiConfig {
  apiKey: string;
  model: string;
}

export interface AIResponse {
  id: string;
  question: string;
  answer: string;
  confidence: number; // 0-1
  sources: string[];
  timestamp: string;
  isAI: boolean;
  author: {
    name: string;
    avatar: string;
    isAI: boolean;
  };
  tags: string[];
  helpful: number;
  notHelpful: number;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  timestamp: string;
  tags: string[];
  location?: {
    city: string;
    state: string;
  };
  aqi?: number;
  responses: AIResponse[];
  likes: number;
  views: number;
}

class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.model });
  }

  /**
   * Gera resposta da IA para uma pergunta da comunidade
   */
  async generateAIResponse(question: CommunityQuestion): Promise<AIResponse> {
    try {
      console.log('🤖 Gerando resposta da IA para:', question.title);
      
      // Verificar se a chave da API está configurada
      if (!this.config.apiKey || this.config.apiKey === 'AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ') {
        console.warn('⚠️ Chave da API do Gemini não configurada, usando resposta simulada');
        return this.generateFallbackResponse(question);
      }
      
      // Criar prompt contextualizado para qualidade do ar
      const prompt = this.createContextualPrompt(question);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Processar resposta da IA
      const aiResponse = this.processAIResponse(question, text);
      
      console.log('✅ Resposta da IA gerada com sucesso');
      return aiResponse;
      
    } catch (error) {
      console.error('❌ Erro ao gerar resposta da IA:', error);
      
      // Verificar se é erro de chave inválida
      if (error instanceof Error && error.message.includes('API key not valid')) {
        console.error('🔑 Chave da API do Gemini inválida. Verifique a configuração.');
        return this.generateAPIKeyErrorResponse(question);
      }
      
      // Fallback para resposta simulada
      return this.generateFallbackResponse(question);
    }
  }

  /**
   * Cria prompt contextualizado baseado na pergunta
   */
  private createContextualPrompt(question: CommunityQuestion): string {
    const context = `
Você é um especialista em qualidade do ar e saúde ambiental, especializado em Mato Grosso, Brasil.
Responda de forma clara, científica e útil para a comunidade.

CONTEXTO:
- Localização: ${question.location?.city || 'Cuiabá'}, ${question.location?.state || 'MT'}
- AQI atual: ${question.aqi || 'N/A'}
- Tags: ${question.tags.join(', ')}

PERGUNTA: ${question.title}
${question.content}

INSTRUÇÕES:
1. Responda em português brasileiro
2. Seja específico sobre Mato Grosso quando relevante
3. Inclua dados científicos quando possível
4. Sugira ações práticas
5. Mencione fontes confiáveis (NASA, OMS, INPE)
6. Seja empático e encorajador
7. Limite a resposta a 3-4 parágrafos
8. Inclua emojis apropriados

RESPOSTA:
`;

    return context;
  }

  /**
   * Processa a resposta da IA
   */
  private processAIResponse(question: CommunityQuestion, rawResponse: string): AIResponse {
    const responseId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Extrair tags da resposta
    const tags = this.extractTags(rawResponse);
    
    // Calcular confiança baseada no conteúdo
    const confidence = this.calculateConfidence(rawResponse, question);
    
    // Extrair fontes mencionadas
    const sources = this.extractSources(rawResponse);
    
    return {
      id: responseId,
      question: question.title,
      answer: rawResponse,
      confidence,
      sources,
      timestamp: new Date().toISOString(),
      isAI: true,
      author: {
        name: 'AirMetrics AI',
        avatar: '🤖',
        isAI: true
      },
      tags,
      helpful: 0,
      notHelpful: 0
    };
  }

  /**
   * Extrai tags da resposta
   */
  private extractTags(response: string): string[] {
    const commonTags = [
      'qualidade do ar', 'AQI', 'poluição', 'queimadas', 'saúde',
      'Mato Grosso', 'Cuiabá', 'prevenção', 'recomendações',
      'PM2.5', 'PM10', 'ozônio', 'NO2', 'monitoramento'
    ];
    
    const foundTags = commonTags.filter(tag => 
      response.toLowerCase().includes(tag.toLowerCase())
    );
    
    return foundTags.slice(0, 5); // Máximo 5 tags
  }

  /**
   * Calcula confiança da resposta
   */
  private calculateConfidence(response: string, question: CommunityQuestion): number {
    let confidence = 0.7; // Base
    
    // Aumentar confiança se menciona fontes científicas
    if (response.includes('NASA') || response.includes('OMS') || response.includes('INPE')) {
      confidence += 0.1;
    }
    
    // Aumentar confiança se menciona dados específicos
    if (response.includes('AQI') || response.includes('PM2.5') || response.includes('μg/m³')) {
      confidence += 0.1;
    }
    
    // Aumentar confiança se menciona Mato Grosso
    if (response.includes('Mato Grosso') || response.includes('Cuiabá')) {
      confidence += 0.05;
    }
    
    // Aumentar confiança se sugere ações práticas
    if (response.includes('recomendo') || response.includes('sugiro') || response.includes('deve')) {
      confidence += 0.05;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Extrai fontes mencionadas na resposta
   */
  private extractSources(response: string): string[] {
    const sources: string[] = [];
    
    if (response.includes('NASA')) sources.push('NASA EarthData');
    if (response.includes('OMS')) sources.push('Organização Mundial da Saúde');
    if (response.includes('INPE')) sources.push('Instituto Nacional de Pesquisas Espaciais');
    if (response.includes('CETESB')) sources.push('CETESB');
    if (response.includes('AirNow')) sources.push('AirNow');
    
    return sources;
  }

  /**
   * Gera resposta de fallback quando a IA falha
   */
  private generateFallbackResponse(question: CommunityQuestion): AIResponse {
    const fallbackAnswers = [
      "Desculpe, não consegui processar sua pergunta no momento. Recomendo consultar os dados de qualidade do ar em tempo real no aplicativo e seguir as recomendações de saúde pública. 🌍",
      "Estou com dificuldades técnicas para responder sua pergunta. Sugiro verificar as informações mais recentes sobre qualidade do ar na sua região através dos dados do AirMetrics. 📊",
      "Não consegui gerar uma resposta adequada agora. Consulte a comunidade ou os especialistas locais para informações mais específicas sobre sua pergunta. 👥"
    ];
    
    const randomAnswer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
    
    return {
      id: `ai_fallback_${Date.now()}`,
      question: question.title,
      answer: randomAnswer,
      confidence: 0.3,
      sources: [],
      timestamp: new Date().toISOString(),
      isAI: true,
      author: {
        name: 'AirMetrics AI',
        avatar: '🤖',
        isAI: true
      },
      tags: ['erro', 'fallback'],
      helpful: 0,
      notHelpful: 0
    };
  }

  /**
   * Gera resposta específica para erro de chave de API
   */
  private generateAPIKeyErrorResponse(question: CommunityQuestion): AIResponse {
    return {
      id: `ai_apikey_error_${Date.now()}`,
      question: question.title,
      answer: "🔑 A chave da API do Gemini AI não está configurada corretamente. Por favor, configure a variável de ambiente GOOGLE_GEMINI_API_KEY com uma chave válida. Enquanto isso, você pode consultar os dados de qualidade do ar disponíveis no aplicativo ou fazer sua pergunta para a comunidade! 🌍",
      confidence: 0.1,
      sources: ['AirMetrics Support'],
      timestamp: new Date().toISOString(),
      isAI: true,
      author: {
        name: 'AirMetrics AI',
        avatar: '🔧',
        isAI: true
      },
      tags: ['erro', 'configuração', 'api-key'],
      helpful: 0,
      notHelpful: 0
    };
  }

  /**
   * Gera sugestões de perguntas para a comunidade
   */
  async generateQuestionSuggestions(): Promise<string[]> {
    const suggestions = [
      "Como a qualidade do ar em Cuiabá afeta minha saúde?",
      "Quais são os principais poluentes em Mato Grosso?",
      "Como me proteger durante a temporada de queimadas?",
      "O que significa AQI e como interpretar os valores?",
      "Existe relação entre queimadas e problemas respiratórios?",
      "Como monitorar a qualidade do ar em casa?",
      "Quais atividades evitar quando o AQI está alto?",
      "Como as queimadas afetam o ecossistema local?",
      "Existe previsão de melhoria na qualidade do ar?",
      "Quais são os grupos de risco para poluição do ar?"
    ];
    
    // Retornar 5 sugestões aleatórias
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  /**
   * Analisa o sentimento de uma pergunta
   */
  analyzeQuestionSentiment(question: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['bom', 'melhor', 'ótimo', 'excelente', 'gratidão', 'obrigado'];
    const negativeWords = ['ruim', 'péssimo', 'terrível', 'preocupado', 'medo', 'perigoso'];
    
    const lowerQuestion = question.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerQuestion.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerQuestion.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Gera tags sugeridas para uma pergunta
   */
  generateSuggestedTags(question: string): string[] {
    const tagMap: { [key: string]: string[] } = {
      'saúde': ['saúde', 'respiratório', 'pulmão', 'asma'],
      'queimadas': ['queimadas', 'fogo', 'incêndio', 'fumaça'],
      'poluição': ['poluição', 'poluente', 'contaminação'],
      'AQI': ['AQI', 'índice', 'qualidade do ar'],
      'prevenção': ['prevenção', 'proteção', 'cuidado'],
      'Mato Grosso': ['Mato Grosso', 'Cuiabá', 'MT'],
      'monitoramento': ['monitoramento', 'dados', 'medição']
    };
    
    const lowerQuestion = question.toLowerCase();
    const suggestedTags: string[] = [];
    
    Object.keys(tagMap).forEach(key => {
      if (lowerQuestion.includes(key)) {
        suggestedTags.push(...tagMap[key]);
      }
    });
    
    return [...new Set(suggestedTags)].slice(0, 5);
  }
}

// Instância padrão usando configurações de ambiente
const geminiAIService = new GeminiAIService({
  apiKey: config.google.geminiApiKey,
  model: config.google.geminiModel
});

export default geminiAIService;
export { GeminiAIService };
