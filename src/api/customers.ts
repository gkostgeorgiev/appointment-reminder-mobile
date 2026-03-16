import { Customer } from "../types";
import { apiClient } from "./client";

function getCustomerSearchParams(userInput: string) {
  const trimmedInput = userInput.trim();
  const hasLetters = /[a-zA-Z]/.test(trimmedInput);
  const hasNumbers = /\d/.test(trimmedInput);

  if (!trimmedInput) {
    return null;
  }

  if (hasLetters && hasNumbers) {
    throw new Error("Please search by either phone or name, not both.");
  }

  if (hasNumbers && /^\d+$/.test(trimmedInput)) {
    return { phone: trimmedInput };
  }

  if (hasLetters && /^[a-zA-Z\s]+$/.test(trimmedInput)) {
    return { name: trimmedInput };
  }

  throw new Error("Search can contain only letters or only numbers.");
}

export async function getCustomers(userInput: string): Promise<Customer[]> {
  const params = getCustomerSearchParams(userInput);

  if (!params) {
    return [];
  }

  const response = await apiClient.get("/customers", { params });
  return response.data.data;
}
