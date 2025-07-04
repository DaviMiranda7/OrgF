import { useState, useEffect, useRef } from 'react'
import {
  Send,
  Lightbulb,
  Sparkles,
  CheckCircle,
  MessageCircle,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { aiAdvisorService } from '@/services/api'

const AIAdvisor = ({ userId }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)
  const { toast } = useToast()

  // Dados mock para demonstração
  const mockInsights = [
    "✅ Parabéns! Você teve um saldo positivo de R$ 1.300,00 nos últimos 3 meses.",
    "📊 Sua maior categoria de gastos é 'Alimentação' com R$ 650,00.",
    "⚠️ Atenção: Você ultrapassou o orçamento de 'Lazer' em 26,67%.",
    "💡 Considere criar uma reserva de emergência de R$ 2.100,00."
  ]

  const mockSuggestions = [
    {
      type: 'expense_reduction',
      category: 'Alimentação',
      message: 'Você gasta R$ 650,00 em Alimentação. Considere reduzir em 10-20%.',
      potential_saving: 97.5
    },
    {
      type: 'emergency_fund',
      message: 'Considere criar uma reserva de emergência de R$ 2.100,00.',
      target_amount: 2100
    },
    {
      type: 'investment',
      message: 'Você tem um bom saldo positivo. Considere investir parte em Tesouro Direto ou CDBs.',
      recommended_amount: 910
    }
  ]

  const initialMessages = [
    {
      id: 1,
      type: 'bot',
      content: 'Olá! Sou seu assessor financeiro pessoal. Posso ajudá-lo com dúvidas sobre orçamento, investimentos, economia e muito mais. Como posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]

  useEffect(() => {
    setMessages(initialMessages)
    loadInsightsAndSuggestions()
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadInsightsAndSuggestions = async () => {
    try {
      // Em um cenário real, você faria:
      // const [insightsRes, suggestionsRes] = await Promise.all([
      //   aiAdvisorService.getInsights(userId),
      //   aiAdvisorService.getSuggestions(userId)
      // ])
      
      // Por enquanto, usar dados mock
      setInsights(mockInsights)
      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Erro ao carregar insights:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Simular resposta da IA
      // Em um cenário real: const response = await aiAdvisorService.chat(inputMessage, userId)
      
      // Respostas mock baseadas na pergunta
      let botResponse = ''
      const question = inputMessage.toLowerCase()
      
      if (question.includes('reserva') || question.includes('emergência') || question.includes('emergencia')) {
        botResponse = 'A reserva de emergência é fundamental para sua segurança financeira. Recomendo manter de 3 a 6 meses de gastos essenciais. Com base no seu perfil, sugiro uma reserva de R$ 2.100,00. Você pode começar separando R$ 200,00 por mês.'
      } else if (question.includes('investir') || question.includes('investimento')) {
        botResponse = 'Para iniciantes, recomendo começar com investimentos de baixo risco como Tesouro Direto e CDBs. Com seu saldo positivo atual, você poderia investir cerca de R$ 910,00. Quer que eu explique mais sobre esses investimentos?'
      } else if (question.includes('economizar') || question.includes('poupar')) {
        botResponse = 'Analisando seus gastos, vejo que você gasta R$ 650,00 em alimentação. Reduzindo 15% nessa categoria, você economizaria R$ 97,50 por mês. Outras dicas: compare preços, cozinhe mais em casa e evite desperdícios.'
      } else if (question.includes('orçamento')) {
        botResponse = 'Um bom orçamento segue a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para poupança. Seus gastos atuais mostram que você está no caminho certo, mas pode otimizar a categoria de lazer.'
      } else {
        botResponse = 'Entendo sua pergunta. Com base na análise das suas finanças, posso ajudar com temas como: reserva de emergência, investimentos, controle de gastos, orçamento e metas financeiras. Sobre qual desses temas gostaria de saber mais?'
      }

      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: botResponse,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
        setIsLoading(false)
      }, 1000)

    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInputMessage(question)
  }

  const quickQuestions = [
    "Como criar uma reserva de emergência?",
    "Onde devo investir meu dinheiro?",
    "Como posso economizar mais?",
    "Como fazer um orçamento eficaz?"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img src="/images/ai_advisor_avatar.png" alt="Assessor IA" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessor Financeiro IA</h1>
          <p className="text-gray-600">Seu consultor financeiro pessoal inteligente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Conversa com IA</span>
              </CardTitle>
              <CardDescription>
                Faça perguntas sobre suas finanças e receba conselhos personalizados
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-end space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${
                            message.type === 'user' 
                              ? 'bg-blue-500' 
                              : ''
                          }`}>
                            {message.type === 'user' ? (
                              <span className="text-white text-sm font-medium flex items-center justify-center h-full">U</span>
                            ) : (
                              <img src="/images/ai_advisor_avatar.png" alt="Assessor IA" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className={`p-3 rounded-xl ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white rounded-br-none' // Balão do usuário
                              : 'bg-gray-200 text-gray-900 rounded-bl-none' // Balão do bot
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 text-right ${
                              message.type === 'user' ? 'text-blue-100' : 'text-gray-600'
                            }`}>
                              {message.timestamp.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img src="/images/ai_advisor_avatar.png" alt="Assessor IA" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-gray-200 rounded-xl rounded-bl-none p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua pergunta sobre finanças..."
                    disabled={isLoading}
                    className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button type="submit" disabled={isLoading || !inputMessage.trim()} className="rounded-full p-2">
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
                
                {/* Quick questions */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Perguntas rápidas:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs rounded-full"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights e Sugestões */}
        <div className="space-y-6">
          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>Insights Financeiros</span>
              </CardTitle>
              <CardDescription>
                Análises automáticas das suas finanças
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">{insight}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sugestões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>Sugestões de Otimização</span>
              </CardTitle>
              <CardDescription>
                Recomendações para melhorar suas finanças
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={
                      suggestion.type === 'expense_reduction' ? 'destructive' :
                      suggestion.type === 'emergency_fund' ? 'secondary' : 'default'
                    }>
                      {suggestion.type === 'expense_reduction' ? 'Redução de Gastos' :
                       suggestion.type === 'emergency_fund' ? 'Reserva de Emergência' : 'Investimento'}
                    </Badge>
                    {suggestion.potential_saving && (
                      <span className="text-sm font-medium text-green-600">
                        +R$ {suggestion.potential_saving.toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{suggestion.message}</p>
                  {suggestion.category && (
                    <p className="text-xs text-gray-500 mt-1">
                      Categoria: {suggestion.category}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status da IA */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">IA Online</p>
                  <p className="text-xs text-gray-500">Pronto para ajudar com suas finanças</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AIAdvisor


