import { Appointment } from "@/src/types/appointment";
import { mockAppointments } from "@/src/mocks/appointment";

export async function getTodayAppointments(): Promise<Appointment[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mockAppointments
}