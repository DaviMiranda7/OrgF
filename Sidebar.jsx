import { Link, useLocation } from 'react-router-dom'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CreditCard, 
  FolderOpen, 
  Target, 
  PiggyBank, 
  Bot, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Wallet,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Sidebar = ({ isOpen, onToggle, isMobile = false }) => {
  const location = useLocation()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      title: 'Transações',
      icon: CreditCard,
      path: '/transactions',
    },
    {
      title: 'Categorias',
      icon: FolderOpen,
      path: '/categories',
    },
    {
      title: 'Orçamentos',
      icon: PiggyBank,
      path: '/budgets',
    },
    {
      title: 'Metas',
      icon: Target,
      path: '/goals',
    },
    {
      title: 'Assessor IA',
      icon: Bot,
      path: '/ai-advisor',
    },
    {
      title: 'Relatórios',
      icon: BarChart3,
      path: '/reports',
    },
  ]

  const handleLinkClick = () => {
    // Fechar sidebar no mobile após clicar em um link
    if (isMobile && isOpen) {
      onToggle()
    }
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40",
        // Desktop behavior
        "lg:relative lg:translate-x-0",
        // Mobile behavior
        isMobile 
          ? isOpen 
            ? "w-64 translate-x-0" 
            : "w-64 -translate-x-full"
          : isOpen 
            ? "w-64" 
            : "w-16"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={cn(
            "flex items-center space-x-3 transition-opacity duration-300",
            (isOpen || isMobile) ? "opacity-100" : "opacity-0"
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">FinanceFlow</h1>
              <p className="text-xs text-gray-500">Organização Financeira</p>
            </div>
          </div>
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobile ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : isOpen ? (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                )} />
                
                <span className={cn(
                  "font-medium transition-opacity duration-300",
                  (isOpen || isMobile) ? "opacity-100" : "opacity-0"
                )}>
                  {item.title}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "absolute bottom-4 left-4 right-4 transition-opacity duration-300",
          (isOpen || isMobile) ? "opacity-100" : "opacity-0"
        )}>
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Dica do IA</span>
            </div>
            <p className="text-xs text-blue-700">
              Mantenha suas transações organizadas para receber insights mais precisos!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar

