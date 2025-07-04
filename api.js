import axios from 'axios'

// Configuração base da API
const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação (se necessário)
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('financeflow_user') || '{}')
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('financeflow_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ===== SERVIÇOS DE USUÁRIO =====
export const userService = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, userData) => api.put(`/users/${userId}`, userData),
}

// ===== SERVIÇOS DE TRANSAÇÕES =====
export const transactionService = {
  getAll: (userId, filters = {}) => {
    const params = new URLSearchParams({ user_id: userId, ...filters })
    return api.get(`/transactions?${params}`)
  },
  create: (transactionData) => api.post('/transactions', transactionData),
  update: (transactionId, transactionData) => api.put(`/transactions/${transactionId}`, transactionData),
  delete: (transactionId) => api.delete(`/transactions/${transactionId}`),
  getSummary: (userId, filters = {}) => {
    const params = new URLSearchParams({ user_id: userId, ...filters })
    return api.get(`/transactions/summary?${params}`)
  },
}

// ===== SERVIÇOS DE CATEGORIAS =====
export const categoryService = {
  getAll: (userId, type = null) => {
    const params = new URLSearchParams({ user_id: userId })
    if (type) params.append('type', type)
    return api.get(`/categories?${params}`)
  },
  create: (categoryData) => api.post('/categories', categoryData),
  update: (categoryId, categoryData) => api.put(`/categories/${categoryId}`, categoryData),
  delete: (categoryId) => api.delete(`/categories/${categoryId}`),
  initializeDefaults: () => api.post('/categories/initialize-defaults'),
}

// ===== SERVIÇOS DE ORÇAMENTOS =====
export const budgetService = {
  getAll: (userId, isActive = null) => {
    const params = new URLSearchParams({ user_id: userId })
    if (isActive !== null) params.append('is_active', isActive)
    return api.get(`/budgets?${params}`)
  },
  create: (budgetData) => api.post('/budgets', budgetData),
  update: (budgetId, budgetData) => api.put(`/budgets/${budgetId}`, budgetData),
  delete: (budgetId) => api.delete(`/budgets/${budgetId}`),
}

// ===== SERVIÇOS DE METAS =====
export const goalService = {
  getAll: (userId, isAchieved = null) => {
    const params = new URLSearchParams({ user_id: userId })
    if (isAchieved !== null) params.append('is_achieved', isAchieved)
    return api.get(`/goals?${params}`)
  },
  create: (goalData) => api.post('/goals', goalData),
  update: (goalId, goalData) => api.put(`/goals/${goalId}`, goalData),
  delete: (goalId) => api.delete(`/goals/${goalId}`),
  contribute: (goalId, amount) => api.post(`/goals/${goalId}/contribute`, { amount }),
}

// ===== SERVIÇOS DE CATEGORIZAÇÃO =====
export const categorizationService = {
  suggest: (description, userId, limit = 3) => 
    api.post('/categorization/suggest', { description, user_id: userId, limit }),
  autoCategorize: (description, amount, userId) => 
    api.post('/categorization/auto-categorize', { description, amount, user_id: userId }),
  batchCategorize: (userId, limit = 100) => 
    api.post('/categorization/batch-categorize', { user_id: userId, limit }),
  createRule: (userId, keyword, categoryId) => 
    api.post('/categorization/create-rule', { user_id: userId, keyword, category_id: categoryId }),
  analyzePatterns: (userId) => 
    api.get(`/categorization/analyze-patterns?user_id=${userId}`),
}

// ===== SERVIÇOS DE IA ASSESSOR =====
export const aiAdvisorService = {
  chat: (question, userId = null) => 
    api.post('/ai-advisor/chat', { question, user_id: userId }),
  getInsights: (userId) => 
    api.get(`/ai-advisor/insights?user_id=${userId}`),
  getSuggestions: (userId) => 
    api.get(`/ai-advisor/suggestions?user_id=${userId}`),
  analyzeBudgets: (userId) => 
    api.get(`/ai-advisor/budget-analysis?user_id=${userId}`),
}

export default api

