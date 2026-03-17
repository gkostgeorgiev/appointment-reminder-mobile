import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

interface AppointmentDetailsFormProps {
  dateTime: string;
  selectedDate: Date | null;
  showDatePicker: boolean;
  onOpenDatePicker: () => void;
  onDateChange: (date: Date) => void;
  onDatePickerDismiss: () => void;
  duration: string;
  onDurationChange: (text: string) => void;
  service: string;
  onServiceChange: (text: string) => void;
  notes: string;
  onNotesChange: (text: string) => void;
  onSubmit: () => void;
}

export function AppointmentDetailsForm({
  dateTime,
  selectedDate,
  showDatePicker,
  onOpenDatePicker,
  onDateChange,
  onDatePickerDismiss,
  duration,
  onDurationChange,
  service,
  onServiceChange,
  notes,
  onNotesChange,
  onSubmit,
}: AppointmentDetailsFormProps) {
  return (
    <View className="mt-2">
      <Text variant="titleMedium" className="mb-3">
        Appointment details
      </Text>

      <View className="mb-4">
        <Pressable onPress={onOpenDatePicker} accessibilityRole="button">
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
              onDateChange(nextValue);
            }}
            onDismiss={onDatePickerDismiss}
          />
        ) : null}
      </View>

      <TextInput
        mode="outlined"
        label="Duration (minutes)"
        keyboardType="number-pad"
        value={duration}
        onChangeText={onDurationChange}
        dense
        className="mb-3"
      />

      <TextInput
        mode="outlined"
        label="Service"
        value={service}
        onChangeText={onServiceChange}
        dense
        className="mb-3"
      />

      <View className="mb-4">
        <TextInput
          mode="outlined"
          label="Notes"
          value={notes}
          onChangeText={onNotesChange}
          multiline
          numberOfLines={3}
          className="mb-4"
        />
      </View>

      <Button
        mode="contained"
        disabled={!dateTime || !duration}
        onPress={onSubmit}
      >
        Continue
      </Button>
    </View>
  );
}
