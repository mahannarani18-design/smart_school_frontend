// src/api/apiClient.js
import axios from "axios";

// آدرس بک‌اند (از env می‌خونه)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// ساخت axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ➤ اضافه کردن access token به هدر قبل از هر درخواست
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ➤ مدیریت خطای 401 (توکن منقضی) و رفرش اتوماتیک
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // اگر خطا 401 بود و قبلا ریفرش نشده
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (refreshToken) {
          // درخواست رفرش توکن
          const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = res.data.access;
          localStorage.setItem("access", newAccessToken);

          // هدر Authorization رو آپدیت کن
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          // درخواست اصلی رو دوباره بفرست
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // اگر رفرش هم شکست خورد → کاربر باید دوباره لاگین کنه
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // ری‌دایرکت به لاگین
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
