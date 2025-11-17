import axios from 'axios';
import { API_BASE_URL } from './Constants';

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    'Content-Type': 'application/json'
  },
});

API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  error => Promise.reject(error)
);

export default API;