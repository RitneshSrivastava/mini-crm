// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://mini-crm-gddl.onrender.com",
});

// Manual setter (used by login)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Automatic fallback (for safety, if setAuthToken wasn’t called)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
