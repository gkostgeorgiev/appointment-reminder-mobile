import axios from "axios";
import { tokenStorage } from "../auth/tokenStorage";

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
  const token = await tokenStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
