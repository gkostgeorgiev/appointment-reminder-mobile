import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByDate } from "@/src/api/appointments";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function useTodayAppointments() {
  const today = getTodayDate();

  return useQuery({
    queryKey: ["appointments", "today"],
    queryFn: () => getAppointmentsByDate(today),
  });
}
