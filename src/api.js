import axios from "axios";
import { getUser, clearUser, clearAdmin, renewToken } from "./data/session";

// Backend address (Project_Api); set VITE_API_URL on Vercel
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4500" });

// Send the login token (customer or admin) with every request
api.interceptors.request.use((config) => {
  const token = getUser()?.token || localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => {
    // the server sent a renewed token: keep it, so the login does not run out while the site is used
    if (res.headers["x-new-token"]) renewToken(res.headers["x-new-token"]);
    return res;
  },
  (err) => {
    // Expired or invalid token: log out and open the login page
    // (login and password-reset calls are skipped, so wrong passwords just show an error)
    const authCall = /\/user\/(login|google|forgot-password|verify-otp|reset-password)/.test(err.config?.url || "");
    if (err.response?.status === 401 && !authCall && err.config?.headers?.Authorization) {
      clearUser();
      clearAdmin();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;