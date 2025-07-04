import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { transactionService, budgetService, goalService, aiAdvisorService } from '@/services/api'

const Dashboard = ({ userId }) => {
  const [summary, setSummary] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [insights, setInsights] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Dados mock para demonstração
  const mockData = {
    summary: {
      total_income: 5500.00,
      total_expense: 4200.00,
      balance: 1300.00,
      transaction_count: 45
    },
    budgets: [
      {
        id: 1,
        name: 'Alimentação',
        category_name: 'Alimentação',
        budget_amount: 800,
        spent_amount: 650,
        usage_percentage: 81.25,
        status: 'warning'
      },
      {
        id: 2,
        name: 'Transporte',
        category_name: 'Transporte',
        budget_amount: 400,
        spent_amount: 320,
        usage_percentage: 80,
        status: 'good'
      },
      {
        id: 3,
        name: 'Lazer',
        category_name: 'Lazer',
        budget_amount: 300,
        spent_amount: 380,
        usage_percentage: 126.67,
        status: 'exceeded'
      }
    ],
    goals: [
      {
        id: 1,
        name: 'Reserva de Emergência',
        target_amount: 10000,
        current_amount: 6500,
        progress_percentage: 65,
        target_date: '2024-12-31'
      },
      {
        id: 2,
        name: 'Viagem para Europa',
        target_amount: 8000,
        current_amount: 2400,
        progress_percentage: 30,
        target_date: '2024-08-15'
      }
    ],
    insights: [
      "✅ Parabéns! Você teve um saldo positivo de R$ 1.300,00 nos últimos 3 meses.",
      "📊 Sua maior categoria de gastos é 'Alimentação' com R$ 650,00.",
      "⚠️ Atenção: Você ultrapassou o orçamento de 'Lazer' em 26,67%."
    ]
  }

  // Dados para gráficos
  const expenseData = [
    { name: 'Alimentação', value: 650, color: '#EF4444' },
    { name: 'Transporte', value: 320, color: '#F59E0B' },
    { name: 'Lazer', value: 380, color: '#10B981' },
    { name: 'Moradia', value: 1200, color: '#8B5CF6' },
    { name: 'Outros', value: 450, color: '#6B7280' }
  ]

  const trendData = [
    { month: 'Jan', income: 5200, expense: 4100 },
    { month: 'Fev', income: 5400, expense: 4300 },
    { month: 'Mar', income: 5500, expense: 4200 },
    { month: 'Abr', income: 5600, expense: 4400 },
    { month: 'Mai', income: 5500, expense: 4200 },
  ]

  useEffect(() => {
    loadDashboardData()
  }, [userId])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Em um cenário real, você faria chamadas para as APIs
      // const [summaryRes, budgetsRes, goalsRes, insightsRes] = await Promise.all([
      //   transactionService.getSummary(userId),
      //   budgetService.getAll(userId, true),
      //   goalService.getAll(userId, false),
      //   aiAdvisorService.getInsights(userId)
      // ])

      // Por enquanto, usar dados mock
      setSummary(mockData.summary)
      setBudgets(mockData.budgets)
      setGoals(mockData.goals)
      setInsights(mockData.insights)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas finanças</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {summary?.total_income?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {summary?.total_expense?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${summary?.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  R$ {summary?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transações</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.transaction_count}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de receitas e despesas */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>Receitas vs Despesas nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Receitas"
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Despesas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Gastos</CardTitle>
            <CardDescription>Gastos por categoria este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orçamentos e Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orçamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos Ativos</CardTitle>
            <CardDescription>Acompanhe seus gastos por categoria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{budget.category_name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      R$ {budget.spent_amount.toLocaleString('pt-BR')} / R$ {budget.budget_amount.toLocaleString('pt-BR')}
                    </span>
                    <Badge variant={
                      budget.status === 'exceeded' ? 'destructive' :
                      budget.status === 'warning' ? 'secondary' : 'default'
                    }>
                      {budget.usage_percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={Math.min(budget.usage_percentage, 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Metas */}
        <Card>
          <CardHeader>
            <CardTitle>Metas Financeiras</CardTitle>
            <CardDescription>Progresso das suas metas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{goal.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      R$ {goal.current_amount.toLocaleString('pt-BR')} / R$ {goal.target_amount.toLocaleString('pt-BR')}
                    </span>
                    <Badge variant="outline">
                      {goal.progress_percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={goal.progress_percentage} className="h-2" />
                <p className="text-xs text-gray-500">
                  Meta: {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Insights da IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span>Insights do Assessor IA</span>
          </CardTitle>
          <CardDescription>Análises e recomendações personalizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

