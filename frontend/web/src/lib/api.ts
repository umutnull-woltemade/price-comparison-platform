import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refreshToken,
        })

        const { accessToken } = response.data
        localStorage.setItem('access_token', accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
}

// User API
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  changePassword: (data: any) => api.put('/users/change-password', data),
  getPreferences: () => api.get('/users/preferences'),
  updatePreferences: (data: any) => api.put('/users/preferences', data),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (productId: string) => api.post('/users/favorites', { productId }),
  removeFavorite: (productId: string) => api.delete(`/users/favorites/${productId}`),
  getPriceAlerts: () => api.get('/users/price-alerts'),
  createPriceAlert: (data: any) => api.post('/users/price-alerts', data),
  getCashback: () => api.get('/users/cashback'),
}

// Product API
export const productApi = {
  getProducts: (params?: any) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getProduct: (id: string) => api.get(`/products/${id}`),
  getProductBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  getPriceHistory: (id: string, days?: number) =>
    api.get(`/products/${id}/price-history`, { params: { days } }),
  getSimilar: (id: string) => api.get(`/products/${id}/similar`),
  trackView: (id: string) => api.post(`/products/${id}/view`),
  trackClick: (id: string) => api.post(`/products/${id}/click`),
}

// Search API
export const searchApi = {
  search: (query: string, params?: any) =>
    api.get('/search', { params: { q: query, ...params } }),
  suggest: (query: string) => api.get('/search/suggest', { params: { q: query } }),
  getPopular: () => api.get('/search/popular'),
}

// Category API
export const categoryApi = {
  getCategories: () => api.get('/categories'),
  getCategoryTree: () => api.get('/categories/tree'),
  getCategory: (id: string) => api.get(`/categories/${id}`),
  getCategoryBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
}

// Brand API
export const brandApi = {
  getBrands: (params?: any) => api.get('/brands', { params }),
  getBrand: (id: string) => api.get(`/brands/${id}`),
}

// Store API
export const storeApi = {
  getStores: (params?: any) => api.get('/stores', { params }),
  getStore: (id: string) => api.get(`/stores/${id}`),
}

// Cashback API
export const cashbackApi = {
  getTransactions: (userId: string, params?: any) =>
    api.get(`/transactions/${userId}`, { params }),
  getSummary: (userId: string) => api.get(`/transactions/summary/${userId}`),
  getWithdrawals: (userId: string, params?: any) =>
    api.get(`/withdrawals/${userId}`, { params }),
  createWithdrawal: (data: any) => api.post('/withdrawals', data),
  trackClick: (data: any) => api.post('/affiliate/click', data),
  getAffiliateStats: (userId: string, params?: any) =>
    api.get(`/affiliate/stats/${userId}`, { params }),
}

export default api
