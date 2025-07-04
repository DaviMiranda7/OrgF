import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Target, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

const Goals = ({ userId }) => {
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [contributingGoal, setContributingGoal] = useState(null)
  const [contributionAmount, setContributionAmount] = useState('')
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    current_amount: '',
    target_date: ''
  })

  // Dados mock
  const mockGoals = [
    {
      id: 1,
      name: 'Reserva de Emergência',
      description: 'Guardar 6 meses de gastos para emergências',
      target_amount: 10000,
      current_amount: 6500,
      progress_percentage: 65,
      target_date: '2024-12-31',
      is_achieved: false,
      created_at: '2024-01-01'
    },
    {
      id: 2,
      name: 'Viagem para Europa',
      description: 'Economizar para uma viagem de 15 dias pela Europa',
      target_amount: 8000,
      current_amount: 2400,
      progress_percentage: 30,
      target_date: '2024-08-15',
      is_achieved: false,
      created_at: '2024-01-01'
    },
    {
      id: 3,
      name: 'Notebook Novo',
      description: 'Comprar um notebook para trabalho',
      target_amount: 3500,
      current_amount: 3500,
      progress_percentage: 100,
      target_date: '2024-03-01',
      is_achieved: true,
      created_at: '2023-12-01'
    }
  ]

  useEffect(() => {
    loadGoals()
  }, [userId])

  const loadGoals = async () => {
    setIsLoading(true)
    try {
      setGoals(mockGoals)
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingGoal) {
        toast({ title: "Sucesso", description: "Meta atualizada com sucesso" })
      } else {
        toast({ title: "Sucesso", description: "Meta criada com sucesso" })
      }
      
      setIsDialogOpen(false)
      setEditingGoal(null)
      setFormData({
        name: '',
        description: '',
        target_amount: '',
        current_amount: '',
        target_date: ''
      })
      loadGoals()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar meta",
        variant: "destructive",
      })
    }
  }

  const handleContribute = async (e) => {
    e.preventDefault()
    try {
      toast({ 
        title: "Sucesso", 
        description: `Contribuição de R$ ${parseFloat(contributionAmount).toLocaleString('pt-BR')} adicionada!` 
      })
      
      setIsContributeDialogOpen(false)
      setContributingGoal(null)
      setContributionAmount('')
      loadGoals()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar contribuição",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      description: goal.description || '',
      target_amount: goal.target_amount.toString(),
      current_amount: goal.current_amount.toString(),
      target_date: goal.target_date
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (goalId) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        toast({ title: "Sucesso", description: "Meta excluída com sucesso" })
        loadGoals()
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir meta",
          variant: "destructive",
        })
      }
    }
  }

  const openContributeDialog = (goal) => {
    setContributingGoal(goal)
    setContributionAmount('')
    setIsContributeDialogOpen(true)
  }

  const getDaysRemaining = (targetDate) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const activeGoals = goals.filter(goal => !goal.is_achieved)
  const achievedGoals = goals.filter(goal => goal.is_achieved)

  if (isLoading) {
    return <div className="animate-pulse">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas Financeiras</h1>
          <p className="text-gray-600">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingGoal(null)
              setFormData({
                name: '',
                description: '',
                target_amount: '',
                current_amount: '0',
                target_date: ''
              })
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? 'Editar Meta' : 'Nova Meta'}
              </DialogTitle>
              <DialogDescription>
                {editingGoal ? 'Edite os dados da meta' : 'Defina um novo objetivo financeiro'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Meta</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Reserva de Emergência, Viagem..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva sua meta e motivação"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_amount">Valor Objetivo</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current_amount">Valor Atual</Label>
                  <Input
                    id="current_amount"
                    type="number"
                    step="0.01"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_date">Data Objetivo</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingGoal ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Metas Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{activeGoals.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Metas Atingidas</p>
                <p className="text-2xl font-bold text-green-600">{achievedGoals.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {activeGoals.reduce((sum, goal) => sum + goal.target_amount, 0).toLocaleString('pt-BR')}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
                <p className="text-2xl font-bold text-orange-600">
                  {activeGoals.length > 0 
                    ? Math.round(activeGoals.reduce((sum, goal) => sum + goal.progress_percentage, 0) / activeGoals.length)
                    : 0}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metas Ativas */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metas Ativas</CardTitle>
            <CardDescription>
              {activeGoals.length} meta(s) em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map((goal) => {
                const daysRemaining = getDaysRemaining(goal.target_date)
                const monthlyTarget = goal.target_amount / 12 // Estimativa simples
                
                return (
                  <div key={goal.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                          {goal.description && (
                            <p className="text-sm text-gray-500">{goal.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={goal.progress_percentage >= 75 ? 'default' : 'secondary'}>
                        {goal.progress_percentage}%
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium">
                          R$ {goal.current_amount.toLocaleString('pt-BR')} / R$ {goal.target_amount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <Progress value={goal.progress_percentage} className="h-3" />
                    </div>

                    {/* Detalhes */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">Faltam</p>
                        <p className="font-medium text-blue-600">
                          R$ {(goal.target_amount - goal.current_amount).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Prazo</p>
                        <p className={`font-medium ${daysRemaining < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                          {daysRemaining > 0 ? `${daysRemaining} dias` : 'Vencido'}
                        </p>
                      </div>
                    </div>

                    {/* Data objetivo */}
                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                      <p className="text-sm text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Meta para: {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(goal)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => openContributeDialog(goal)}
                        disabled={goal.progress_percentage >= 100}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Contribuir
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metas Atingidas */}
      {achievedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Metas Atingidas</CardTitle>
            <CardDescription>
              Parabéns! Você atingiu {achievedGoals.length} meta(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievedGoals.map((goal) => (
                <div key={goal.id} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">{goal.name}</h4>
                      <p className="text-sm text-green-700">
                        R$ {goal.target_amount.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    ✅ Concluída
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Contribuição */}
      <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribuir para Meta</DialogTitle>
            <DialogDescription>
              Adicione uma contribuição para: {contributingGoal?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContribute} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contribution">Valor da Contribuição</Label>
              <Input
                id="contribution"
                type="number"
                step="0.01"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            {contributingGoal && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  Progresso atual: R$ {contributingGoal.current_amount.toLocaleString('pt-BR')} / R$ {contributingGoal.target_amount.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-blue-700">
                  Faltam: R$ {(contributingGoal.target_amount - contributingGoal.current_amount).toLocaleString('pt-BR')}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsContributeDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Adicionar Contribuição
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Goals

