import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="liveEvents" />
      <Stack.Screen name="eventDetails" />
      <Stack.Screen name="otherEventDetails" />
      <Stack.Screen name="normalEvents" />
    </Stack>
  );
}
