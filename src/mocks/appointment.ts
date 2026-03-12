import { Appointment } from "@/src/types/appointment";

export const mockAppointments: Appointment[] = [
  {
    _id: "1",
    professional: "65fa123",
    customer: {
      _id: "c1",
      firstName: "Maria",
      lastName: "Ivanova",
      phone: "+359888123456",
      email: "maria@example.com"
    },
    start: "2026-03-12T09:00:00Z",
    duration: 30,
    service: "Dental Cleaning",
    notes: "First visit",
    status: "scheduled",
    reminderSent: false,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z"
  },
  {
    _id: "2",
    professional: "65fa123",
    customer: {
      _id: "c2",
      firstName: "Georgi",
      lastName: "Petrov",
      phone: "+359888555555"
    },
    start: "2026-03-12T10:00:00Z",
    duration: 60,
    service: "Root Canal",
    notes: "",
    status: "scheduled",
    reminderSent: true,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z"
  },
  {
    _id: "3",
    professional: "65fa123",
    customer: {
      _id: "c3",
      firstName: "Elena",
      lastName: "Dimitrova",
      phone: "+359888999999"
    },
    start: "2026-03-12T13:30:00Z",
    duration: 45,
    service: "Consultation",
    notes: "",
    status: "scheduled",
    reminderSent: false,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z"
  }
]