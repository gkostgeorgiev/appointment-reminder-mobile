import { Customer } from "@/src/types";
import { Button, Card, Text } from "react-native-paper";

interface SelectedCustomerCardProps {
  customer: Customer;
  onChangeCustomer: () => void;
}

export function SelectedCustomerCard({
  customer,
  onChangeCustomer,
}: SelectedCustomerCardProps) {
  return (
    <Card className="mb-4">
      <Card.Content>
        <Text variant="titleMedium">
          {customer.firstName} {customer.lastName}
        </Text>
        <Text className="mt-1 text-slate-600">{customer.phone}</Text>
        {customer.email && (
          <Text className="mt-1 text-slate-500">{customer.email}</Text>
        )}
      </Card.Content>
      <Card.Actions>
        <Button onPress={onChangeCustomer}>Change customer</Button>
      </Card.Actions>
    </Card>
  );
}
