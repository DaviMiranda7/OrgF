import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FolderOpen, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const Categories = ({ userId }) => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: 'folder',
    category_type: 'expense'
  })

  // Dados mock
  const mockCategories = [
    { id: 1, name: 'Alimentação', description: 'Gastos com comida e bebida', color: '#EF4444', icon: 'utensils', category_type: 'expense', is_default: true },
    { id: 2, name: 'Transporte', description: 'Gastos com locomoção', color: '#F59E0B', icon: 'car', category_type: 'expense', is_default: true },
    { id: 3, name: 'Moradia', description: 'Aluguel, contas da casa', color: '#8B5CF6', icon: 'home', category_type: 'expense', is_default: true },
    { id: 4, name: 'Lazer', description: 'Entretenimento e diversão', color: '#10B981', icon: 'gamepad-2', category_type: 'expense', is_default: true },
    { id: 5, name: 'Salário', description: 'Renda do trabalho', color: '#059669', icon: 'briefcase', category_type: 'income', is_default: true },
    { id: 6, name: 'Freelance', description: 'Trabalhos extras', color: '#0D9488', icon: 'laptop', category_type: 'income', is_default: true }
  ]

  const colorOptions = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', 
    '#EC4899', '#F97316', '#84CC16', '#06B6D4', '#6366F1'
  ]

  const iconOptions = [
    'folder', 'home', 'car', 'utensils', 'briefcase', 'laptop',
    'gamepad-2', 'heart', 'book', 'shopping-bag', 'wrench'
  ]

  useEffect(() => {
    loadCategories()
  }, [userId])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      setCategories(mockCategories)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        toast({ title: "Sucesso", description: "Categoria atualizada com sucesso" })
      } else {
        toast({ title: "Sucesso", description: "Categoria criada com sucesso" })
      }
      
      setIsDialogOpen(false)
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: 'folder',
        category_type: 'expense'
      })
      loadCategories()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar categoria",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon,
      category_type: category.category_type
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (categoryId) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        toast({ title: "Sucesso", description: "Categoria excluída com sucesso" })
        loadCategories()
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir categoria",
          variant: "destructive",
        })
      }
    }
  }

  const expenseCategories = categories.filter(cat => cat.category_type === 'expense')
  const incomeCategories = categories.filter(cat => cat.category_type === 'income')

  if (isLoading) {
    return <div className="animate-pulse">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">Organize suas transações por categorias</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCategory(null)
              setFormData({
                name: '',
                description: '',
                color: '#3B82F6',
                icon: 'folder',
                category_type: 'expense'
              })
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Edite os dados da categoria' : 'Crie uma nova categoria personalizada'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Educação, Investimentos..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o que inclui nesta categoria"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select 
                    value={formData.category_type} 
                    onValueChange={(value) => setFormData({...formData, category_type: value})}
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

                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Select 
                    value={formData.icon} 
                    onValueChange={(value) => setFormData({...formData, icon: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(icon => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categorias de Despesas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-red-600" />
            </div>
            <span>Categorias de Despesas</span>
          </CardTitle>
          <CardDescription>
            {expenseCategories.length} categoria(s) de despesas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <div 
                        className="w-5 h-5 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-500">{category.description}</p>
                      )}
                    </div>
                  </div>
                  {category.is_default && (
                    <Badge variant="outline" className="text-xs">
                      Padrão
                    </Badge>
                  )}
                </div>
                
                {!category.is_default && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categorias de Receitas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-green-600" />
            </div>
            <span>Categorias de Receitas</span>
          </CardTitle>
          <CardDescription>
            {incomeCategories.length} categoria(s) de receitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <div 
                        className="w-5 h-5 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-500">{category.description}</p>
                      )}
                    </div>
                  </div>
                  {category.is_default && (
                    <Badge variant="outline" className="text-xs">
                      Padrão
                    </Badge>
                  )}
                </div>
                
                {!category.is_default && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Categories

