import { getCustomers } from "@/src/api/customers";
import MainAppBar from "@/src/components/ui/MainAppBar";
import { Customer } from "@/src/types";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookAppointmentScreen() {
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");

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
        const getCustomersResult = await getCustomers(trimmedQuery);
        setCustomers(getCustomersResult);
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

  function handleSelectCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setQuery("");
    setCustomers([]);
    setQueryError(null);
  }

  function handleChangeCustomer() {
    setSelectedCustomer(null);
    setQuery("");
    setCustomers([]);
    setQueryError(null);
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <MainAppBar />

      <View className="flex-1 px-4 pt-6">
        <Text variant="headlineSmall" className="mb-4">
          Please select a customer first
        </Text>

        {selectedCustomer ? (
          <Card className="mb-4">
            <Card.Content>
              <Text variant="titleMedium">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </Text>
              <Text className="mt-1 text-slate-600">
                {selectedCustomer.phone}
              </Text>
              {selectedCustomer.email ? (
                <Text className="mt-1 text-slate-500">
                  {selectedCustomer.email}
                </Text>
              ) : null}
            </Card.Content>
            <Card.Actions>
              <Button onPress={handleChangeCustomer}>Change customer</Button>
            </Card.Actions>
          </Card>
        ) : (
          <>
            <TextInput
              mode="outlined"
              placeholder="Search by name or phone"
              value={query}
              onChangeText={setQuery}
              error={Boolean(queryError)}
              right={<TextInput.Icon icon="magnify" />}
              dense
              className="rounded-3xl px-4"
            />
            {queryError ? (
              <Text className="mt-2 text-red-600">{queryError}</Text>
            ) : null}
            {isSearching ? (
              <Text className="mt-3 text-slate-500">Searching...</Text>
            ) : null}

            <FlatList
              data={customers}
              keyExtractor={(item) => item._id}
              keyboardShouldPersistTaps="handled"
              className="mt-4"
              ListEmptyComponent={
                query.trim() && !queryError && !isSearching ? (
                  <Text className="text-slate-500">No customers found.</Text>
                ) : null
              }
              renderItem={({ item }) => (
                <Card
                  className="mb-3"
                  onPress={() => handleSelectCustomer(item)}
                >
                  <Card.Content>
                    <Text variant="titleMedium">
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text className="mt-1 text-slate-600">{item.phone}</Text>
                  </Card.Content>
                </Card>
              )}
            />
          </>
        )}

        {selectedCustomer ? (
          <View className="mt-2">
            <Text variant="titleMedium" className="mb-3">
              Appointment details
            </Text>

            <View className="mb-4">
              <TextInput
                mode="outlined"
                label="Date and time"
                placeholder="2026-03-20 14:30"
                value={dateTime}
                onChangeText={setDateTime}
                dense
                className="mb-3"
              />
            </View>

            <TextInput
              mode="outlined"
              label="Duration (minutes)"
              keyboardType="number-pad"
              value={duration}
              onChangeText={setDuration}
              dense
              className="mb-3"
            />

            <TextInput
              mode="outlined"
              label="Service"
              value={service}
              onChangeText={setService}
              dense
              className="mb-3"
            />

            <TextInput
              mode="outlined"
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              className="mb-4"
            />

            <Button mode="contained" disabled={!dateTime || !service}>
              Continue
            </Button>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
