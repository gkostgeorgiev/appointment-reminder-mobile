import { getCustomers } from "@/src/api/customers";
import { Customer } from "@/src/types";
import { useEffect, useState } from "react";

export function useCustomerSearch() {
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [lastCompletedQuery, setLastCompletedQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const trimmedCurrentQuery = query.trim();
  const hasSettledSearchForCurrentQuery =
    Boolean(trimmedCurrentQuery) && trimmedCurrentQuery === lastCompletedQuery;

  useEffect(() => {
    let isActive = true;

    if (selectedCustomer) {
      setIsDebouncing(false);
      setIsSearching(false);
      setLastCompletedQuery("");
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setIsDebouncing(false);
      setIsSearching(false);
      setQueryError(null);
      setCustomers([]);
      setLastCompletedQuery("");
      return;
    }

    setIsDebouncing(true);

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        setQueryError(null);
        const result = await getCustomers(trimmedQuery);
        if (!isActive) {
          return;
        }
        setCustomers(result);
      } catch (error) {
        if (!isActive) {
          return;
        }
        setCustomers([]);
        if (error instanceof Error) {
          setQueryError(error.message);
          return;
        }
        setQueryError("Could not validate your input.");
      } finally {
        if (!isActive) {
          return;
        }
        setIsDebouncing(false);
        setIsSearching(false);
        setLastCompletedQuery(trimmedQuery);
      }
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
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
    isDebouncing,
    hasSettledSearchForCurrentQuery,
    selectedCustomer,
    selectCustomer,
    resetCustomer,
  };
}
