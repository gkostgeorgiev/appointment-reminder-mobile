import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Appbar, Card, Text } from "react-native-paper";

import { getTodayAppointments } from "@/src/services/appointment";
import { Appointment } from "@/src/types/appointment";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MainAppBar from "@/src/components/ui/MainAppBar";

export default function ScheduleScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTodayAppointments();
        setAppointments(data);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <MainAppBar />

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
                    pathname: "/(tabs)/schedule/[id]",
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
    </SafeAreaView>
  );
}
