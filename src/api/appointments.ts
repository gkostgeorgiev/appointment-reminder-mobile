import { apiClient } from "./client";

export async function getAppointmentsByDate(date: string) {
  const response = await apiClient.get("/appointments", {
    params: { date },
  });

  return response.data.data;
}
