import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/refresh/`,
          { refresh }
        );
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return API(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (credentials) => API.post('/auth/login/', credentials),
  register: (data) => API.post('/users/register/', data),
  getProfile: () => API.get('/users/profile/'),
};

export const transactionAPI = {
  getAll: (params) => API.get('/transactions/', { params }),
  create: (data) => API.post('/transactions/', data),
  update: (id, data) => API.put(`/transactions/${id}/`, data),
  delete: (id) => API.delete(`/transactions/${id}/`),
  getSummary: (params) => API.get('/transactions/summary/', { params }),
};

export default API;
