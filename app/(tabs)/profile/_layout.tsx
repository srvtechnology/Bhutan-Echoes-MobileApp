import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="editProfile" />
      <Stack.Screen name="changePass" />
      <Stack.Screen name="notification" />
    </Stack>
  );
}
