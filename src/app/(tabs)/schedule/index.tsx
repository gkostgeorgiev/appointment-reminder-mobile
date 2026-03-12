import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Card, Text } from "react-native-paper";

import { getTodayAppointments } from "@/src/services/appointment";
import { Appointment } from "@/src/types/appointment";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getTodayAppointments();
      setAppointments(data);
    }

    load();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card className="mb-3">
              <Card.Content>
                <Text variant="titleMedium">
                  {item.customer.firstName} {item.customer.lastName}
                </Text>

                <Text>
                  {new Date(item.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>

                <Text>{item.service}</Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
