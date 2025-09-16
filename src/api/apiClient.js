// frontend/src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://django-3o32v9.chbk.app/api",
  withCredentials: true, // 🔹 مهم برای ارسال کوکی CSRF
  headers: {
    "Content-Type": "application/json",
  },
});

// قبل از هر POST، CSRF cookie را بگیر
apiClient.interceptors.request.use(async (config) => {
  if (config.method === "post") {
    await axios.get("https://django-3o32v9.chbk.app/api/csrf/", {
      withCredentials: true,
    });
  }
  return config;
});

export default apiClient;
