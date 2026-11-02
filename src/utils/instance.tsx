import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add request interceptor to include the Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Space added after "Bearer "
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
