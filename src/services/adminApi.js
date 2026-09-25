import axios from "axios";

const adminApi = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminApi;