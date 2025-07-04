import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, PiggyBank, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const Budgets = ({ userId }) => {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    amount: '',
    period: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  })

  // Dados mock
  const mockBudgets = [
    {
      id: 1,
      name: 'Orçamento Alimentação',
      category_name: 'Alimentação',
      budget_amount: 800,
      spent_amount: 650,
      usage_percentage: 81.25,
      remaining_amount: 150,
      period: 'monthly',
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      is_active: true,
      status: 'warning'
    },
    {
      id: 2,
      name: 'Orçamento Transporte',
      category_name: 'Transporte',
      budget_amount: 400,
      spent_amount: 320,
      usage_percentage: 80,
      remaining_amount: 80,
      period: 'monthly',
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      is_active: true,
      status: 'good'
    },
    {
      id: 3,
      name: 'Orçamento Lazer',
      category_name: 'Lazer',
      budget_amount: 300,
      spent_amount: 380,
      usage_percentage: 126.67,
      remaining_amount: -80,
      period: 'monthly',
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      is_active: true,
      status: 'exceeded'
    }
  ]

  const mockCategories = [
    { id: 1, name: 'Alimentação', category_type: 'expense' },
    { id: 2, name: 'Transporte', category_type: 'expense' },
    { id: 3, name: 'Moradia', category_type: 'expense' },
    { id: 4, name: 'Lazer', category_type: 'expense' },
    { id: 5, name: 'Saúde', category_type: 'expense' }
  ]

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      setBudgets(mockBudgets)
      setCategories(mockCategories)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBudget) {
        toast({ title: "Sucesso", description: "Orçamento atualizado com sucesso" })
      } else {
        toast({ title: "Sucesso", description: "Orçamento criado com sucesso" })
      }
      
      setIsDialogOpen(false)
      setEditingBudget(null)
      setFormData({
        name: '',
        category_id: '',
        amount: '',
        period: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      })
      loadData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar orçamento",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      name: budget.name,
      category_id: budget.category_id?.toString() || '',
      amount: budget.budget_amount.toString(),
      period: budget.period,
      start_date: budget.start_date,
      end_date: budget.end_date
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (budgetId) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        toast({ title: "Sucesso", description: "Orçamento excluído com sucesso" })
        loadData()
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir orçamento",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'exceeded':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'exceeded':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-green-200 bg-green-50'
    }
  }

  if (isLoading) {
    return <div className="animate-pulse">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-600">Controle seus gastos por categoria</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingBudget(null)
              setFormData({
                name: '',
                category_id: '',
                amount: '',
                period: 'monthly',
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
              })
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
              </DialogTitle>
              <DialogDescription>
                {editingBudget ? 'Edite os dados do orçamento' : 'Defina um limite de gastos para uma categoria'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Orçamento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Orçamento Alimentação Janeiro"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => setFormData({...formData, category_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Valor Limite</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Período</Label>
                  <Select 
                    value={formData.period} 
                    onValueChange={(value) => setFormData({...formData, period: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Data Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Data Fim</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingBudget ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orçamentos Ativos</p>
                <p className="text-2xl font-bold text-blue-600">{budgets.length}</p>
              </div>
              <PiggyBank className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dentro do Limite</p>
                <p className="text-2xl font-bold text-green-600">
                  {budgets.filter(b => b.status === 'good').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ultrapassados</p>
                <p className="text-2xl font-bold text-red-600">
                  {budgets.filter(b => b.status === 'exceeded').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Orçamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget) => (
          <Card key={budget.id} className={`border-2 ${getStatusColor(budget.status)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(budget.status)}
                  <div>
                    <CardTitle className="text-lg">{budget.name}</CardTitle>
                    <CardDescription>{budget.category_name}</CardDescription>
                  </div>
                </div>
                <Badge variant={
                  budget.status === 'exceeded' ? 'destructive' :
                  budget.status === 'warning' ? 'secondary' : 'default'
                }>
                  {budget.usage_percentage.toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">
                    R$ {budget.spent_amount.toLocaleString('pt-BR')} / R$ {budget.budget_amount.toLocaleString('pt-BR')}
                  </span>
                </div>
                <Progress 
                  value={Math.min(budget.usage_percentage, 100)} 
                  className="h-3"
                />
              </div>

              {/* Detalhes */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Restante</p>
                  <p className={`font-medium ${budget.remaining_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {budget.remaining_amount.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Período</p>
                  <p className="font-medium">
                    {new Date(budget.start_date).toLocaleDateString('pt-BR')} - {new Date(budget.end_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Status Message */}
              <div className="p-3 rounded-lg bg-white border">
                {budget.status === 'exceeded' && (
                  <p className="text-sm text-red-700">
                    ⚠️ Orçamento ultrapassado em R$ {Math.abs(budget.remaining_amount).toLocaleString('pt-BR')}
                  </p>
                )}
                {budget.status === 'warning' && (
                  <p className="text-sm text-yellow-700">
                    ⚡ Atenção: você já gastou {budget.usage_percentage.toFixed(0)}% do orçamento
                  </p>
                )}
                {budget.status === 'good' && (
                  <p className="text-sm text-green-700">
                    ✅ Orçamento sob controle. Continue assim!
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(budget)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(budget.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Budgets

