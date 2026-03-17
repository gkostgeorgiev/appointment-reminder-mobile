import { Customer } from "@/src/types";
import { FlatList } from "react-native";
import { Card, Text, TextInput } from "react-native-paper";

interface CustomerSearchSectionProps {
  query: string;
  onChangeQuery: (text: string) => void;
  queryError: string | null;
  customers: Customer[];
  isSearching: boolean;
  onSelectCustomer: (customer: Customer) => void;
}

export function CustomerSearchSection({
  query,
  onChangeQuery,
  queryError,
  customers,
  isSearching,
  onSelectCustomer,
}: CustomerSearchSectionProps) {
  return (
    <>
      <TextInput
        mode="outlined"
        placeholder="Search by name or phone"
        value={query}
        onChangeText={onChangeQuery}
        error={Boolean(queryError)}
        right={<TextInput.Icon icon="magnify" />}
        dense
        className="rounded-3xl px-4"
      />
      {queryError ? (
        <Text className="mt-2 text-red-600">{queryError}</Text>
      ) : null}
      {isSearching ? (
        <Text className="mt-3 text-slate-500">Searching...</Text>
      ) : null}

      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}
        className="mt-4"
        ListEmptyComponent={
          query.trim() && !queryError && !isSearching ? (
            <Text className="text-slate-500">No customers found.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card className="mb-3" onPress={() => onSelectCustomer(item)}>
            <Card.Content>
              <Text variant="titleMedium">
                {item.firstName} {item.lastName}
              </Text>
              <Text className="mt-1 text-slate-600">{item.phone}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </>
  );
}
