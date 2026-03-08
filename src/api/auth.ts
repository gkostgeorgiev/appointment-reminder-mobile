import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async login(data: LoginPayload) {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
};
