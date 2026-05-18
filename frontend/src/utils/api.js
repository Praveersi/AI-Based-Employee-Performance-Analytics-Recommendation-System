import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Employee APIs
export const addEmployee = (data) => API.post('/employees', data);
export const getAllEmployees = () => API.get('/employees');
export const searchEmployees = (params) => API.get('/employees/search', { params });
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const getEmployeeById = (id) => API.get(`/employees/${id}`);

// AI APIs
export const getAIRecommendation = (employeeId) => API.post('/ai/recommend', { employeeId });
export const getAIRankings = () => API.get('/ai/rankings');
export const getBulkFeedback = (department) => API.post('/ai/bulk-feedback', { department });

// Auth APIs
export const loginUser = (email, password) => API.post('/auth/login', { email, password });
export const signupUser = (name, email, password, role) => API.post('/auth/signup', { name, email, password, role });
export const getMe = () => API.get('/auth/me');

export default API;
