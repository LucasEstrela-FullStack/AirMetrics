// Serviço para integração com Google Gemini AI
// Respostas inteligentes para perguntas da comunidade sobre qualidade do ar

import { GoogleGenerativeAI } from '@google/generative-ai';

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
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private config: GeminiConfig;
  private isConfigured: boolean = false;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.initialize();
  }

  /**
   * Inicializa o serviço Gemini AI
   */
  private initialize(): void {
    try {
      // Validar chave da API
      if (!this.config.apiKey || 
          this.config.apiKey === 'AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ' ||
          this.config.apiKey === 'your-api-key-here') {
        console.warn('⚠️ Chave da API do Gemini não configurada corretamente');
        this.isConfigured = false;
        return;
      }

      // Inicializar cliente Gemini
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: this.config.model 
      });
      
      this.isConfigured = true;
      console.log('✅ Gemini AI Service inicializado com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar Gemini AI Service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Verifica se o serviço está configurado
   */
  public isReady(): boolean {
    return this.isConfigured && this.model !== null;
  }

  /**
   * Gera resposta da IA para uma pergunta da comunidade
   */
  async generateAIResponse(question: CommunityQuestion): Promise<AIResponse> {
    console.log('🤖 Solicitando resposta da IA para:', question.title);
    
    // Verificar se está configurado
    if (!this.isReady()) {
      console.warn('⚠️ Serviço não configurado, usando resposta de fallback');
      return this.generateAPIKeyErrorResponse(question);
    }

    try {
      console.log('🤖 Gerando resposta da IA para:', question.title);
      
      // Criar prompt contextualizado
      const prompt = this.createContextualPrompt(question);
      
      // Gerar conteúdo com timeout
      const result = await Promise.race([
        this.model!.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 30000)
        )
      ]);
      
      const response = await (result as any).response;
      const text = response.text();
      
      // Processar resposta
      const aiResponse = this.processAIResponse(question, text);
      
      console.log('✅ Resposta da IA gerada com sucesso');
      return aiResponse;
      
    } catch (error) {
      console.error('❌ Erro ao gerar resposta da IA:', error);
      
      // Tratamento específico de erros
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        
        if (errorMsg.includes('api key not valid') || errorMsg.includes('api_key_invalid')) {
          console.error('🔑 Chave da API inválida');
          return this.generateAPIKeyErrorResponse(question);
        }
        
        if (errorMsg.includes('not found') || errorMsg.includes('404')) {
          console.error('🔍 Modelo não encontrado');
          return this.generateModelNotFoundResponse(question);
        }
        
        if (errorMsg.includes('timeout')) {
          console.error('⏱️ Timeout na requisição');
          return this.generateTimeoutResponse(question);
        }
        
        if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
          console.error('📊 Limite de requisições excedido');
          return this.generateQuotaExceededResponse(question);
        }
      }
      
      // Fallback genérico
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
    
    return {
      id: responseId,
      question: question.title,
      answer: rawResponse,
      confidence: this.calculateConfidence(rawResponse, question),
      sources: this.extractSources(rawResponse),
      timestamp: new Date().toISOString(),
      isAI: true,
      author: {
        name: 'AirMetrics AI',
        avatar: '🤖',
        isAI: true
      },
      tags: this.extractTags(rawResponse),
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
    
    return foundTags.slice(0, 5);
  }

  /**
   * Calcula confiança da resposta
   */
  private calculateConfidence(response: string, question: CommunityQuestion): number {
    let confidence = 0.7;
    
    if (response.includes('NASA') || response.includes('OMS') || response.includes('INPE')) {
      confidence += 0.1;
    }
    
    if (response.includes('AQI') || response.includes('PM2.5') || response.includes('μg/m³')) {
      confidence += 0.1;
    }
    
    if (response.includes('Mato Grosso') || response.includes('Cuiabá')) {
      confidence += 0.05;
    }
    
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
   * Resposta de erro - API Key inválida
   */
  private generateAPIKeyErrorResponse(question: CommunityQuestion): AIResponse {
    return {
      id: `ai_apikey_error_${Date.now()}`,
      question: question.title,
      answer: "🔑 O sistema de IA não está configurado corretamente no momento. Por favor, consulte os dados de qualidade do ar disponíveis no aplicativo ou faça sua pergunta diretamente para a comunidade! 🌍\n\nVocê também pode verificar as recomendações gerais baseadas no índice AQI atual.",
      confidence: 0.1,
      sources: ['AirMetrics Support'],
      timestamp: new Date().toISOString(),
      isAI: true,
      author: {
        name: 'AirMetrics AI',
        avatar: '🔧',
        isAI: true
      },
      tags: ['configuração', 'suporte'],
      helpful: 0,
      notHelpful: 0
    };
  }

  /**
   * Resposta de erro - Modelo não encontrado
   */
  private generateModelNotFoundResponse(question: CommunityQuestion): AIResponse {
    return {
      id: `ai_model_error_${Date.now()}`,
      question: question.title,
      answer: "🔍 O modelo de IA está temporariamente indisponível. Recomendo consultar os dados de qualidade do ar em tempo real e as orientações de saúde disponíveis no aplicativo. A comunidade também pode ajudar! 💬",
      confidence: 0.2,
      sources: [],
      timestamp: new Date().toISOString(),
      isAI: true,
      author: {
        name: 'AirMetrics AI',
        avatar: '🤖',
        isAI: true
      },
      tags: ['erro', 'temporário'],
      helpful: 0,
      notHelpful: 0
    };
  }

  /**
   * Resposta de erro - Timeout
   */
  private generateTimeoutResponse(question: CommunityQuestion): AIResponse {
    return {
      id: `ai_timeout_${Date.now()}`,
      question: question.title,
      answer: "⏱️ A resposta está demorando mais do que o esperado. Tente novamente em alguns instantes ou consulte a comunidade para respostas mais rápidas! 🚀",
      confidence: 0.3,
      sources: [],
      timestamp: new Date().toISOString(),
      isAI: true,
      author: {
        name: 'AirMetrics AI',
        avatar: '⏱️',
        isAI: true
      },
      tags: ['timeout'],
      helpful: 0,
      notHelpful: 0
    };
  }

  /**
   * Resposta de erro - Quota excedida
   */
  private generateQuotaExceededResponse(question: CommunityQuestion): AIResponse {
    return {
      id: `ai_quota_${Date.now()}`,
      question: question.title,
      answer: "📊 Atingimos o limite de consultas à IA por hoje. Por favor, consulte os dados históricos ou pergunte à comunidade! Voltaremos com mais respostas em breve. 🌟",
      confidence: 0.2,
      sources: [],
      timestamp: new Date().toISOString(),
      isAI: true,
      author: {
        name: 'AirMetrics AI',
        avatar: '📊',
        isAI: true
      },
      tags: ['limite', 'quota'],
      helpful: 0,
      notHelpful: 0
    };
  }

  /**
   * Resposta de fallback genérica
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
      tags: ['fallback'],
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

// Configuração usando variáveis de ambiente do Expo
const getGeminiConfig = (): GeminiConfig => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY || '';
  const model = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';
  
  if (!apiKey) {
    console.warn('⚠️ EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY não configurada');
  }
  
  return { apiKey, model };
};

// Instância padrão
const geminiAIService = new GeminiAIService(getGeminiConfig());

export default geminiAIService;
export { GeminiAIService };