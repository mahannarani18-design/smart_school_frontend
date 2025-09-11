import axios from 'axios';

const apiClient = axios.create({
  // کد اصلاح شده: آدرس پایه API از متغیر محیطی خوانده می‌شود
  baseURL: process.env.REACT_APP_API_URL,
});

// این بخش قبل از هر درخواست اجرا می‌شود
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;