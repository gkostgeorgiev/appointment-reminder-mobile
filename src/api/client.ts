import { apiOrigin, apiV1Origin } from "@/src/config/api";
import axios from "axios";
import { triggerLogout } from "../auth/authEvents";
import { getToken } from "../auth/tokenStorage";

export const apiBase = axios.create({
  baseURL: apiOrigin,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = axios.create({
  baseURL: apiV1Origin,
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
  console.log("API RESPONSE:", response.status, response.config.url, response);
  return response;
});
