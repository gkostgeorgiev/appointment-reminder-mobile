import MainAppBar from "@/src/components/ui/MainAppBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();

  // mock data for now
  const appointment = {
    time: "11:00 AM",
    customer: "Maria Ivanova",
    service: "Dental Cleaning",
    notes: "Sensitive tooth",
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <MainAppBar />

      <View className="flex-1 px-4 pt-6">
        <Text variant="headlineMedium" className="mb-6">
          {appointment.time}
        </Text>

        <Card className="mb-4">
          <Card.Content>
            <Text variant="titleMedium">{appointment.customer}</Text>
            <Text className="text-slate-600">{appointment.service}</Text>
          </Card.Content>
        </Card>

        <Card className="mb-6">
          <Card.Content>
            <Text variant="titleSmall" className="mb-2">
              Notes
            </Text>
            <Text className="text-slate-600">
              {appointment.notes || "No notes"}
            </Text>
          </Card.Content>
        </Card>

        <Button mode="contained" className="mb-3">
          Edit Appointment
        </Button>

        <Button mode="outlined">Delete Appointment</Button>
      </View>
    </SafeAreaView>
  );
}
