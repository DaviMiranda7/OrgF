import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { transactionService, categoryService } from '@/services/api'

const Transactions = ({ userId }) => {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const { toast } = useToast()

  // Dados mock para demonstração
  const mockTransactions = [
    {
      id: 1,
      description: 'Salário - Empresa XYZ',
      amount: 5500.00,
      transaction_type: 'income',
      category_name: 'Salário',
      date: '2024-01-15T00:00:00',
      created_at: '2024-01-15T10:30:00'
    },
    {
      id: 2,
      description: 'Supermercado Extra',
      amount: -250.00,
      transaction_type: 'expense',
      category_name: 'Alimentação',
      date: '2024-01-14T00:00:00',
      created_at: '2024-01-14T18:45:00'
    },
    {
      id: 3,
      description: 'Uber - Corrida para trabalho',
      amount: -25.50,
      transaction_type: 'expense',
      category_name: 'Transporte',
      date: '2024-01-14T00:00:00',
      created_at: '2024-01-14T08:15:00'
    },
    {
      id: 4,
      description: 'Freelance - Projeto Web',
      amount: 800.00,
      transaction_type: 'income',
      category_name: 'Freelance',
      date: '2024-01-13T00:00:00',
      created_at: '2024-01-13T16:20:00'
    },
    {
      id: 5,
      description: 'Cinema - Filme com amigos',
      amount: -45.00,
      transaction_type: 'expense',
      category_name: 'Lazer',
      date: '2024-01-12T00:00:00',
      created_at: '2024-01-12T21:30:00'
    }
  ]

  const mockCategories = [
    { id: 1, name: 'Salário', category_type: 'income', color: '#10B981' },
    { id: 2, name: 'Freelance', category_type: 'income', color: '#059669' },
    { id: 3, name: 'Alimentação', category_type: 'expense', color: '#EF4444' },
    { id: 4, name: 'Transporte', category_type: 'expense', color: '#F59E0B' },
    { id: 5, name: 'Lazer', category_type: 'expense', color: '#10B981' },
    { id: 6, name: 'Moradia', category_type: 'expense', color: '#8B5CF6' }
  ]

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    transaction_type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Em um cenário real, você faria:
      // const [transactionsRes, categoriesRes] = await Promise.all([
      //   transactionService.getAll(userId),
      //   categoryService.getAll(userId)
      // ])
      
      // Por enquanto, usar dados mock
      setTransactions(mockTransactions)
      setCategories(mockCategories)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar transações",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const transactionData = {
        ...formData,
        user_id: userId,
        amount: parseFloat(formData.amount) * (formData.transaction_type === 'expense' ? -1 : 1)
      }

      if (editingTransaction) {
        // Atualizar transação existente
        // await transactionService.update(editingTransaction.id, transactionData)
        toast({
          title: "Sucesso",
          description: "Transação atualizada com sucesso",
        })
      } else {
        // Criar nova transação
        // await transactionService.create(transactionData)
        toast({
          title: "Sucesso",
          description: "Transação criada com sucesso",
        })
      }

      setIsDialogOpen(false)
      setEditingTransaction(null)
      setFormData({
        description: '',
        amount: '',
        transaction_type: 'expense',
        category_id: '',
        date: new Date().toISOString().split('T')[0]
      })
      loadData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar transação",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString(),
      transaction_type: transaction.transaction_type,
      category_id: transaction.category_id || '',
      date: transaction.date.split('T')[0]
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (transactionId) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        // await transactionService.delete(transactionId)
        toast({
          title: "Sucesso",
          description: "Transação excluída com sucesso",
        })
        loadData()
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir transação",
          variant: "destructive",
        })
      }
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType
    const matchesCategory = filterCategory === 'all' || transaction.category_name === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-600">Gerencie suas receitas e despesas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTransaction(null)
              setFormData({
                description: '',
                amount: '',
                transaction_type: 'expense',
                category_id: '',
                date: new Date().toISOString().split('T')[0]
              })
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction ? 'Edite os dados da transação' : 'Adicione uma nova receita ou despesa'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Supermercado, Salário, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select 
                    value={formData.transaction_type} 
                    onValueChange={(value) => setFormData({...formData, transaction_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                      {categories
                        .filter(cat => cat.category_type === formData.transaction_type)
                        .map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTransaction ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm font-medium text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${(totalIncome - totalExpense) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {transaction.category_name || 'Sem categoria'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.transaction_type === 'income' ? 'default' : 'secondary'}>
                      {transaction.transaction_type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell className={transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Transactions

