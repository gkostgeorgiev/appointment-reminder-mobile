import { Appointment } from "@/src/types/appointment";
import { apiClient } from "./client";

export async function getTodaysAppointments(): Promise<Appointment[]> {
  const response = await apiClient.get("/appointments?range=today");
  return response.data.data;
}
