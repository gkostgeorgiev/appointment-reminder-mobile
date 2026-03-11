import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  profession?: string;
}

export const authApi = {
  async login(data: LoginPayload) {
    const response = await apiClient.post("/professionals/login", data);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await apiClient.post("/professionals/register", payload);
    return response.data;
  },
};
