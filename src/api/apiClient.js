import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_DJANGO_API_URL || 'https://django-3o32v9.chbk.app/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// اضافه کردن JWT به همه درخواست‌ها
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
