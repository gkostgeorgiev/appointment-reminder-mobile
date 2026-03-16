import { getTodaysAppointments } from "@/src/api/appointments";
import { Appointment } from "@/src/types/appointment";

export async function getTodayAppointments(): Promise<Appointment[]> {
  return getTodaysAppointments();
}
