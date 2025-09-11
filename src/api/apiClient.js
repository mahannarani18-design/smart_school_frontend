import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://mahannarani18.pythonanywhere.com/api', // آدرس پایه API
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