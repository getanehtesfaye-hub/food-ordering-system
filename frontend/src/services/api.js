import axios from 'axios';

// Create axios instance
const api = axios.create({
 baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api',  // Direct backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// Food API
export const foodAPI = {
  getAll: (params = {}) => api.get('/food', { params }),
  getById: (id) => api.get(`/food/${id}`),
  create: (formData) => api.post('/food', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/food/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/food/${id}`),
  toggleAvailability: (id) => api.patch(`/food/${id}/toggle-availability`),
  getPopular: (limit = 10) => api.get('/food/popular/list', { params: { limit } }),
  getByCategory: (categoryId) => api.get(`/food/category/${categoryId}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
  getPopular: (limit = 10) => api.get('/categories/popular', { params: { limit } }),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (foodItemId, quantity) => api.post('/cart/add', { food_item_id: foodItemId, quantity }),
  updateItem: (foodItemId, quantity) => api.put('/cart/update', { food_item_id: foodItemId, quantity }),
  removeItem: (foodItemId) => api.delete(`/cart/remove/${foodItemId}`),
  clearCart: () => api.delete('/cart/clear'),
  getCartCount: () => api.get('/cart/count'),
  validateCart: () => api.get('/cart/validate'),
  getCheckoutCart: () => api.get('/cart/checkout'),
  mergeGuestCart: (guestCart) => api.post('/cart/merge', { guest_cart: guestCart }),
};

// Order API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getUserOrders: (params = {}) => api.get('/orders/my-orders', { params }),
  getAllOrders: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  getStats: (params = {}) => api.get('/orders/stats/summary', { params }),
  getDailySales: (days = 7) => api.get('/orders/stats/daily', { params: { days } }),
  getPopularItems: (params = {}) => api.get('/orders/stats/popular-items', { params }),
};

// User API (Admin)
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Health check API
export const healthAPI = {
  check: () => api.get('/health'),
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received (backend likely not running)
    return {
      message: 'Cannot connect to server. Make sure the backend is running on port 5000.',
      status: null,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null,
    };
  }
};

// Utility function to create a query key for React Query
export const createQueryKey = (baseKey, params = {}) => {
  return [baseKey, ...Object.entries(params).flat()];
};

// Default export
export default api;
