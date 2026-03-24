import { Customer } from "@/src/types";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

interface CustomerSearchSectionProps {
  query: string;
  onChangeQuery: (text: string) => void;
  queryError: string | null;
  customers: Customer[];
  isSearching: boolean;
  isDebouncing: boolean;
  hasSettledSearchForCurrentQuery: boolean;
  onSelectCustomer: (customer: Customer) => void;
}

export function CustomerSearchSection({
  query,
  onChangeQuery,
  queryError,
  customers,
  isSearching,
  isDebouncing,
  hasSettledSearchForCurrentQuery,
  onSelectCustomer,
}: CustomerSearchSectionProps) {
  const router = useRouter();

  const NoCustomerFoundSection = () => {
    return (
      <>
        <Text className="text-slate-500 mt-4 mb-6 self-center">
          No customers found.
        </Text>
        <Button mode="contained" onPress={() => router.push("/customers/add")}>
          Add Customer
        </Button>
      </>
    );
  };

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
          hasSettledSearchForCurrentQuery &&
          customers.length === 0 &&
          !queryError &&
          !isSearching &&
          !isDebouncing ? (
            <NoCustomerFoundSection />
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
