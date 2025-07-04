import { useState, useEffect } from 'react'
import { BarChart3, Download, Calendar, Filter, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

const Reports = ({ userId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('last_3_months')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Dados mock para demonstração
  const monthlyData = [
    { month: 'Out', income: 5200, expense: 4100, balance: 1100 },
    { month: 'Nov', income: 5400, expense: 4300, balance: 1100 },
    { month: 'Dez', income: 5500, expense: 4200, balance: 1300 },
    { month: 'Jan', income: 5600, expense: 4400, balance: 1200 },
    { month: 'Fev', income: 5500, expense: 4200, balance: 1300 },
  ]

  const categoryData = [
    { name: 'Alimentação', value: 1200, color: '#EF4444', percentage: 28.6 },
    { name: 'Moradia', value: 1000, color: '#8B5CF6', percentage: 23.8 },
    { name: 'Transporte', value: 800, color: '#F59E0B', percentage: 19.0 },
    { name: 'Lazer', value: 600, color: '#10B981', percentage: 14.3 },
    { name: 'Saúde', value: 400, color: '#EC4899', percentage: 9.5 },
    { name: 'Outros', value: 200, color: '#6B7280', percentage: 4.8 }
  ]

  const dailySpendingData = [
    { day: '1', amount: 120 },
    { day: '2', amount: 80 },
    { day: '3', amount: 200 },
    { day: '4', amount: 150 },
    { day: '5', amount: 90 },
    { day: '6', amount: 300 },
    { day: '7', amount: 180 },
    { day: '8', amount: 110 },
    { day: '9', amount: 250 },
    { day: '10', amount: 170 },
    { day: '11', amount: 130 },
    { day: '12', amount: 220 },
    { day: '13', amount: 160 },
    { day: '14', amount: 190 }
  ]

  const incomeVsExpenseData = [
    { month: 'Jan', income: 5500, expense: 4200 },
    { month: 'Fev', income: 5600, expense: 4400 },
    { month: 'Mar', income: 5500, expense: 4200 },
    { month: 'Abr', income: 5700, expense: 4300 },
    { month: 'Mai', income: 5800, expense: 4500 }
  ]

  const summaryStats = {
    totalIncome: 27600,
    totalExpense: 21600,
    totalBalance: 6000,
    avgMonthlyIncome: 5520,
    avgMonthlyExpense: 4320,
    savingsRate: 21.7,
    topExpenseCategory: 'Alimentação',
    topExpenseAmount: 1200
  }

  const handleExportReport = () => {
    // Simular exportação
    const reportData = {
      period: selectedPeriod,
      type: selectedReport,
      generated_at: new Date().toISOString(),
      summary: summaryStats,
      monthly_data: monthlyData,
      category_data: categoryData
    }
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {summaryStats.totalIncome.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">
                  Média: R$ {summaryStats.avgMonthlyIncome.toLocaleString('pt-BR')}/mês
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Despesa Total</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {summaryStats.totalExpense.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">
                  Média: R$ {summaryStats.avgMonthlyExpense.toLocaleString('pt-BR')}/mês
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {summaryStats.totalBalance.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">
                  Taxa de poupança: {summaryStats.savingsRate}%
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maior Gasto</p>
                <p className="text-lg font-bold text-purple-600">
                  {summaryStats.topExpenseCategory}
                </p>
                <p className="text-sm text-gray-500">
                  R$ {summaryStats.topExpenseAmount.toLocaleString('pt-BR')}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>Receitas, despesas e saldo por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']} />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Receitas" />
                <Area type="monotone" dataKey="expense" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Despesas" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Distribuição percentual dos gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gastos Diários */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos Diários</CardTitle>
          <CardDescription>Padrão de gastos nos últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySpendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Gasto']} />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderIncomeExpenseReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Receitas vs Despesas</CardTitle>
          <CardDescription>Comparação mensal detalhada</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={incomeVsExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']} />
              <Bar dataKey="income" fill="#10B981" name="Receitas" />
              <Bar dataKey="expense" fill="#EF4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Receita Média Mensal:</span>
                <span className="font-bold text-green-600">R$ 5.620,00</span>
              </div>
              <div className="flex justify-between">
                <span>Maior Receita:</span>
                <span className="font-bold">R$ 5.800,00 (Mai)</span>
              </div>
              <div className="flex justify-between">
                <span>Menor Receita:</span>
                <span className="font-bold">R$ 5.500,00 (Jan/Mar)</span>
              </div>
              <div className="flex justify-between">
                <span>Crescimento:</span>
                <span className="font-bold text-green-600">+5,45%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Despesa Média Mensal:</span>
                <span className="font-bold text-red-600">R$ 4.320,00</span>
              </div>
              <div className="flex justify-between">
                <span>Maior Despesa:</span>
                <span className="font-bold">R$ 4.500,00 (Mai)</span>
              </div>
              <div className="flex justify-between">
                <span>Menor Despesa:</span>
                <span className="font-bold">R$ 4.200,00 (Jan/Mar)</span>
              </div>
              <div className="flex justify-between">
                <span>Variação:</span>
                <span className="font-bold text-red-600">+7,14%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderCategoryReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada por Categoria</CardTitle>
          <CardDescription>Gastos detalhados em cada categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categoryData.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">R$ {category.value.toLocaleString('pt-BR')}</div>
                    <div className="text-sm text-gray-500">{category.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      backgroundColor: category.color,
                      width: `${category.percentage}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categoria Dominante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">Alimentação</div>
              <div className="text-lg">28,6% dos gastos</div>
              <div className="text-sm text-gray-500">R$ 1.200,00</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oportunidade de Economia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">Lazer</div>
              <div className="text-lg">Reduzir 20%</div>
              <div className="text-sm text-gray-500">Economia: R$ 120,00</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categoria Controlada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">Saúde</div>
              <div className="text-lg">Dentro do esperado</div>
              <div className="text-sm text-gray-500">9,5% dos gastos</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análises detalhadas das suas finanças</p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="income_expense">Receitas vs Despesas</SelectItem>
                  <SelectItem value="categories">Por Categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_month">Último Mês</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="last_6_months">Últimos 6 Meses</SelectItem>
                  <SelectItem value="last_year">Último Ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo do Relatório */}
      {selectedReport === 'overview' && renderOverviewReport()}
      {selectedReport === 'income_expense' && renderIncomeExpenseReport()}
      {selectedReport === 'categories' && renderCategoryReport()}
    </div>
  )
}

export default Reports

