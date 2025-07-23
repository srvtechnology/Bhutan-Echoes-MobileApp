/** @format */

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { View, ActivityIndicator, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ToastRoot } from "@/components/ToastHelper";

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    inter: Inter_400Regular,
    interMedium: Inter_500Medium,
    interBold: Inter_700Bold,
  });

  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* <View
        style={{
          height: 50,
          backgroundColor: "#48732C",
        }}
      /> */}
      <StatusBar backgroundColor="#48732C" style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot" />
        <Stack.Screen name="notification" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
      <ToastRoot />
    </SafeAreaProvider>
  );
}
