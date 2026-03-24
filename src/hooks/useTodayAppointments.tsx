import { getTodaysAppointments } from "@/src/api/appointments";
import { useQuery } from "@tanstack/react-query";

export function useTodayAppointments() {
  return useQuery({
    queryKey: ["appointments", "today"],
    queryFn: () => getTodaysAppointments(),
  });
}
