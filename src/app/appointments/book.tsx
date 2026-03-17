import { AppointmentDetailsForm } from "@/src/components/booking/partials/AppointmentDetailsForm";
import { CustomerSearchSection } from "@/src/components/booking/partials/CustomerSearchSection";
import { SelectedCustomerCard } from "@/src/components/booking/partials/SelectedCustomerCard";
import MainAppBar from "@/src/components/ui/MainAppBar";
import { useAppointmentDateTime } from "@/src/hooks/useAppointmentDateTime";
import { useCustomerSearch } from "@/src/hooks/useCustomerSearch";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookAppointmentScreen() {
  const {
    query,
    setQuery,
    queryError,
    customers,
    isSearching,
    selectedCustomer,
    selectCustomer,
    resetCustomer,
  } = useCustomerSearch();

  const {
    dateTime,
    selectedDate,
    showDatePicker,
    setShowDatePicker,
    openDatePicker,
    applySelectedDate,
    resetDateTime,
  } = useAppointmentDateTime();

  const [duration, setDuration] = useState("30");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");

  function handleChangeCustomer() {
    resetCustomer();
    resetDateTime();
  }

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
            <SelectedCustomerCard
              customer={selectedCustomer}
              onChangeCustomer={handleChangeCustomer}
            />
          ) : (
            <CustomerSearchSection
              query={query}
              onChangeQuery={setQuery}
              queryError={queryError}
              customers={customers}
              isSearching={isSearching}
              onSelectCustomer={selectCustomer}
            />
          )}

          {selectedCustomer ? (
            <AppointmentDetailsForm
              dateTime={dateTime}
              selectedDate={selectedDate}
              showDatePicker={showDatePicker}
              onOpenDatePicker={openDatePicker}
              onDateChange={applySelectedDate}
              onDatePickerDismiss={() => setShowDatePicker(false)}
              duration={duration}
              onDurationChange={setDuration}
              service={service}
              onServiceChange={setService}
              notes={notes}
              onNotesChange={setNotes}
              onSubmit={() => {}}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
