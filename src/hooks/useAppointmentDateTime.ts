import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform } from "react-native";

function formatDateTime(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function useAppointmentDateTime() {
  const [dateTime, setDateTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [_pickerMode, setPickerMode] = useState<"date" | "time">("date");

  function applySelectedDate(nextValue: Date) {
    setSelectedDate(nextValue);
    setDateTime(formatDateTime(nextValue));
  }

  function resetDateTime() {
    setDateTime("");
    setSelectedDate(null);
    setShowDatePicker(false);
    setPickerMode("date");
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

  return {
    dateTime,
    selectedDate,
    showDatePicker,
    setShowDatePicker,
    openDatePicker,
    applySelectedDate,
    resetDateTime,
  };
}
