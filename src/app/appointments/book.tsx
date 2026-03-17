import { getCustomers } from "@/src/api/customers";
import MainAppBar from "@/src/components/ui/MainAppBar";
import { Customer } from "@/src/types";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDateTime(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default function BookAppointmentScreen() {
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [dateTime, setDateTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
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
    setDateTime("");
  }

  function applySelectedDate(nextValue: Date) {
    setSelectedDate(nextValue);
    setDateTime(formatDateTime(nextValue));
  }

  function openAndroidTimePicker(baseDate: Date) {
    DateTimePickerAndroid.open({
      value: baseDate,
      mode: "time",
      is24Hour: true,
      onValueChange: (_event, nextValue) => {
        const updatedDate = new Date(baseDate);
        updatedDate.setHours(
          nextValue.getHours(),
          nextValue.getMinutes(),
          0,
          0,
        );
        applySelectedDate(updatedDate);
      },
      onDismiss: () => {
        setPickerMode("date");
      },
    });
  }

  function openDatePicker() {
    if (Platform.OS === "ios") {
      setShowDatePicker(true);
      return;
    }

    setPickerMode("date");
    DateTimePickerAndroid.open({
      value: selectedDate ?? new Date(),
      mode: "date",
      onValueChange: (_event, nextValue) => {
        const updatedDate = selectedDate ? new Date(selectedDate) : new Date();
        updatedDate.setFullYear(
          nextValue.getFullYear(),
          nextValue.getMonth(),
          nextValue.getDate(),
        );

        setPickerMode("time");
        openAndroidTimePicker(updatedDate);
      },
      onDismiss: () => {
        setPickerMode("date");
      },
    });
  }

  useEffect(() => {
    console.log("Selected date:", selectedDate);
  }, [selectedDate]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <MainAppBar />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 80}
        className="flex-1"
      >
        <ScrollView
          scrollEnabled={true}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 20,
          }}
        >
          <Text variant="headlineSmall" className="mb-4">
            {selectedCustomer
              ? "Book appointment for:"
              : "Please select a customer first"}
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
                scrollEnabled={false}
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
                <Pressable onPress={openDatePicker} accessibilityRole="button">
                  <View pointerEvents="none">
                    <TextInput
                      mode="outlined"
                      label="Date and time"
                      placeholder="2026-03-20 14:31"
                      value={dateTime}
                      dense
                      className="mb-3"
                      right={<TextInput.Icon icon="calendar" />}
                    />
                  </View>
                </Pressable>

                {Platform.OS === "ios" && showDatePicker ? (
                  <DateTimePicker
                    value={selectedDate ?? new Date()}
                    mode="datetime"
                    display="inline"
                    onValueChange={(_event, nextValue) => {
                      applySelectedDate(nextValue);
                    }}
                    onDismiss={() => {
                      setShowDatePicker(false);
                    }}
                  />
                ) : null}
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

              <View className="mb-4">
                <TextInput
                  mode="outlined"
                  label="Notes"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  className="mb-4"
                />
              </View>

              <Button mode="contained" disabled={!dateTime || !duration}>
                Continue
              </Button>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
