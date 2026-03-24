import { createCustomer } from "@/src/api/customers";
import { FormTextField } from "@/src/components/FormTextField";
import MainAppBar from "@/src/components/ui/MainAppBar";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text as RNText,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddCustomer = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedPhone = phone.trim();
  const trimmedEmail = email.trim();

  async function handleSubmit() {
    if (!trimmedFirstName || !trimmedLastName || !trimmedPhone) {
      setFormError("First name, last name, and phone are required.");
      return;
    }

    setFormError(null);
    setSuccessMessage(null);

    try {
      setSubmitting(true);

      await createCustomer({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        phone: trimmedPhone,
        email: trimmedEmail || undefined,
      });

      setSuccessMessage("Customer added successfully.");
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Could not create customer. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      setFormError("Please provide a valid email address.");
      return;
    }
    setFormError((previousError) =>
      previousError === "Please provide a valid email address."
        ? null
        : previousError,
    );
  }, [email]);

  const isSubmitDisabled =
    submitting || !firstName.trim() || !lastName.trim() || !phone.trim();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <MainAppBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 24,
          }}
        >
          <Text variant="headlineSmall" className="mb-1 self-center">
            Add new customer
          </Text>
          <RNText className="text-red-600 mb-6 self-center text-sm italic">
            Fields marked with * are required.
          </RNText>

          <View className="gap-4">
            <TextInput
              label="First name *"
              mode="outlined"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <FormTextField
              label="Last name *"
              mode="outlined"
              value={lastName}
              onChangeText={setLastName}
              errorText={"Hello world"}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <TextInput
              label="Phone *"
              mode="outlined"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <TextInput
              label="Email (optional)"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>

          {formError && (
            <RNText className="text-red-600 mt-2">{formError}</RNText>
          )}

          {successMessage && (
            <RNText className="text-emerald-700 mt-2">{successMessage}</RNText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={submitting}
            disabled={isSubmitDisabled}
            className="mt-6"
          >
            Save customer
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddCustomer;
