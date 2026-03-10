import axios from "axios";
import { getToken } from "../auth/tokenStorage";
import { triggerLogout } from "../auth/authEvents";

export const apiBase = axios.create({
  baseURL: "http://10.0.2.2:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = axios.create({
  baseURL: "http://10.0.2.2:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("JWT expired → logging out");
      triggerLogout();
    }

    return Promise.reject(error);
  },
);

apiClient.interceptors.request.use((config) => {
  console.log("API REQUEST:", config.method, config.url, config.data);
  return config;
});

apiClient.interceptors.response.use((response) => {
  console.log("API RESPONSE:", response.status, response.config.url);
  return response;
});