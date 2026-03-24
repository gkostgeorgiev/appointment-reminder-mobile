import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

type FormTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  errorText?: string | null;
  [key: string]: any;
};

export function FormTextField({
  label,
  value,
  onChangeText,
  errorText,
  ...rest
}: FormTextFieldProps) {
  const hasError = Boolean(errorText);

  return (
    <View>
      <TextInput
        label={label}
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        error={hasError}
        {...rest}
      />
      {hasError && (
        <HelperText type="error" className="-mb-4">
          {errorText}
        </HelperText>
      )}
    </View>
  );
}
