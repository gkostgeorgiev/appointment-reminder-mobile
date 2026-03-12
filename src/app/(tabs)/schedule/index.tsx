import { useTodayAppointments } from "@/src/hooks/useTodayAppointments";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function TodayScreen() {
  const { data, isLoading, error } = useTodayAppointments();

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Failed to load appointments</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View>
        <Text>No appointments today</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", margin: 16 }}>
            Today's Schedule
          </Text>
          <Text>{item.customer.name}</Text>
          <Text>{item.time}</Text>
        </View>
      )}
    />
  );
}
