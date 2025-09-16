import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // 👈 حتماً در .env اینو تعریف کن
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔑 اینترسپتور برای اضافه کردن JWT به هر درخواست
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // 👈 تو LoginPage ذخیره کردی به اسم "access"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
