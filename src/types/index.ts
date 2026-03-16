export type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
};

export type Appointment = {
  _id: string;
  professional: string;
  customer: Customer;
  start: string;
  duration: number;
  service?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
};
