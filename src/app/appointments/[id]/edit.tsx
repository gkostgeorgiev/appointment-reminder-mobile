import MainAppBar from "@/src/components/ui/MainAppBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditAppointmentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Temporary local draft values until API/data store integration is wired.
  const [service, setService] = useState("Dental Cleaning");
  const [notes, setNotes] = useState("Sensitive tooth");

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <MainAppBar />

      <View className="flex-1 px-4 pt-6">
        <Text variant="headlineSmall" className="mb-2">
          Edit Appointment
        </Text>
        <Text className="mb-6 text-slate-600">ID: {id}</Text>

        <Card className="mb-4">
          <Card.Content>
            <Text variant="titleSmall" className="mb-2">
              Service
            </Text>
            <TextInput
              mode="outlined"
              value={service}
              onChangeText={setService}
              placeholder="Service"
            />
          </Card.Content>
        </Card>

        <Card className="mb-6">
          <Card.Content>
            <Text variant="titleSmall" className="mb-2">
              Notes
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              placeholder="Appointment notes"
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          className="mb-3"
          onPress={() => {
            // Placeholder save flow.
            router.back();
          }}
        >
          Save
        </Button>

        <Button mode="outlined" onPress={() => router.back()}>
          Cancel
        </Button>
      </View>
    </SafeAreaView>
  );
}
