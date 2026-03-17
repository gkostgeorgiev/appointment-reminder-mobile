import { getCustomers } from "@/src/api/customers";
import { Customer } from "@/src/types";
import { useEffect, useState } from "react";

export function useCustomerSearch() {
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  useEffect(() => {
    if (selectedCustomer) {
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setQueryError(null);
      setCustomers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        setQueryError(null);
        const result = await getCustomers(trimmedQuery);
        setCustomers(result);
      } catch (error) {
        setCustomers([]);
        if (error instanceof Error) {
          setQueryError(error.message);
          return;
        }
        setQueryError("Could not validate your input.");
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedCustomer]);

  function selectCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setQuery("");
    setCustomers([]);
    setQueryError(null);
  }

  function resetCustomer() {
    setSelectedCustomer(null);
    setQuery("");
    setCustomers([]);
    setQueryError(null);
  }

  return {
    query,
    setQuery,
    queryError,
    customers,
    isSearching,
    selectedCustomer,
    selectCustomer,
    resetCustomer,
  };
}
