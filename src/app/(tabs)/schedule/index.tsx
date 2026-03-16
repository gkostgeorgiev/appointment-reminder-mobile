import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Card, FAB, Text } from "react-native-paper";

import { getTodayAppointments } from "@/src/services/appointment";
import { Appointment } from "@/src/types";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function load(showSpinner = false) {
    if (showSpinner) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setErrorMessage(null);

    try {
      const data = await getTodayAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments", error);
      setErrorMessage("Could not load appointments. Pull down to retry.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    load(true);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-4 pt-2">
        <Text variant="headlineSmall" className="mb-4">
          Today
        </Text>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator animating size="large" />
            <Text className="mt-3 text-slate-600">Loading appointments...</Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item._id}
            refreshing={isRefreshing}
            onRefresh={() => load()}
            ListHeaderComponent={
              errorMessage ? (
                <Text className="mb-3 text-red-600">{errorMessage}</Text>
              ) : null
            }
            ListEmptyComponent={
              <View className="items-center mt-20">
                <Text>No appointments today</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Card
                className="mb-3"
                onPress={() =>
                  router.push({
                    pathname: "/appointments/[id]",
                    params: { id: item._id },
                  })
                }
              >
                <Card.Content className="flex-row items-center">
                  <View className="mr-4">
                    <Text variant="titleLarge">
                      {new Date(item.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>

                  <View>
                    <Text variant="titleMedium">
                      {item.customer.firstName} {item.customer.lastName}
                    </Text>

                    <Text className="text-slate-600">{item.service}</Text>
                  </View>
                </Card.Content>
              </Card>
            )}
          />
        )}
      </View>
      <FAB
        icon="plus"
        onPress={() => router.push("/appointments/book")}
        className="absolute right-4 bottom-4 bg-blue-200"
      />
    </SafeAreaView>
  );
}
