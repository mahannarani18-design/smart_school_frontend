import axios from 'axios';

const apiClient = axios.create({
  // استفاده از نام متغیر جدید و صحیح
  baseURL: process.env.REACT_APP_DJANGO_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... بقیه کد بدون تغییر باقی می‌ماند ...
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;