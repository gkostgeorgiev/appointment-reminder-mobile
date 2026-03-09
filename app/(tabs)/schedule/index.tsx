import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useTodayAppointments } from "@/hooks/useTodayAppointments";

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
          <Text>{item.customer.name}</Text>
          <Text>{item.time}</Text>
        </View>
      )}
    />
  );
}
