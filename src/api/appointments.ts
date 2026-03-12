import { apiClient } from "./client";

export async function getTodaysAppointments() {
  const response = await apiClient.get("/appointments?range=today");
  return response.data.data;
}
