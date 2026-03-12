import { getTodaysAppointments } from "@/src/api/appointments";
import { useQuery } from "@tanstack/react-query";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function useTodayAppointments() {
  return useQuery({
    queryKey: ["appointments", "today"],
    queryFn: () => getTodaysAppointments(),
  });
}
