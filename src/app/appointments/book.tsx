import MainAppBar from "@/src/components/ui/MainAppBar";
import { mockAppointments } from "@/src/mocks/appointment";
import { Customer } from "@/src/types/appointment";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Card, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function getUniqueCustomers(): Customer[] {
  const customersById = new Map<string, Customer>();

  for (const appointment of mockAppointments) {
    customersById.set(appointment.customer._id, appointment.customer);
  }

  return Array.from(customersById.values());
}

function matchesQuery(customer: Customer, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
  const phone = customer.phone.toLowerCase();

  return fullName.includes(normalizedQuery) || phone.includes(normalizedQuery);
}

export default function BookAppointmentScreen() {
  const [query, setQuery] = useState("");
  const customers = getUniqueCustomers();

  const filteredCustomers = customers.filter((customer) =>
    matchesQuery(customer, query),
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <MainAppBar />

      <View className="flex-1 px-4 pt-6">
        <Text variant="headlineSmall" className="mb-2">
          Book
        </Text>
        <Text className="mb-4 text-slate-600">
          Search for a customer by name or phone number.
        </Text>

        <Searchbar
          placeholder="Search by phone or name"
          value={query}
          onChangeText={setQuery}
          className="mb-4"
        />

        <Text className="mb-3 text-slate-500">
          {filteredCustomers.length} customer
          {filteredCustomers.length === 1 ? "" : "s"}
        </Text>

        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="mt-16 items-center px-6">
              <Text variant="titleMedium" className="mb-2">
                No customer found
              </Text>
              <Text className="text-center text-slate-600">
                Try a different phone number or customer name.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card className="mb-3">
              <Card.Content>
                <Text variant="titleMedium">
                  {item.firstName} {item.lastName}
                </Text>
                <Text className="mt-1 text-slate-600">{item.phone}</Text>
                {item.email ? (
                  <Text className="mt-1 text-slate-500">{item.email}</Text>
                ) : null}
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
