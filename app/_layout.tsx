/** @format */

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
// import {
//   useFonts,
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_700Bold,
// } from "@expo-google-fonts/inter";
import { useFonts } from "@expo-google-fonts/poppins/useFonts";
import { Poppins_400Regular } from "@expo-google-fonts/poppins/400Regular";
import { Poppins_500Medium } from "@expo-google-fonts/poppins/500Medium";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins/600SemiBold";
import { Poppins_700Bold } from "@expo-google-fonts/poppins/700Bold";
import { Poppins_800ExtraBold } from "@expo-google-fonts/poppins/800ExtraBold";
import { Poppins_900Black } from "@expo-google-fonts/poppins/900Black";
import { View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ToastRoot } from "@/components/ToastHelper";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import { theme } from "@/theme/theme";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
  }),
});

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // inter: Inter_400Regular,
    // interMedium: Inter_500Medium,
    // interBold: Inter_700Bold,
    poppins: Poppins_400Regular,
    poppinsMedium: Poppins_500Medium,
    poppinsSemiBold: Poppins_600SemiBold,
    poppinsBold: Poppins_700Bold,
    poppinsExtraBold: Poppins_800ExtraBold,
    poppinsBlack: Poppins_900Black,
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
    <NotificationProvider>
      <SafeAreaProvider>
        {Platform.OS === "ios" && (
          <View
            style={{
              height: 46,
              backgroundColor: theme.colors.primary,
            }}
          />
        )}
        <StatusBar backgroundColor={theme.colors.primary} style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast />
        <ToastRoot />
      </SafeAreaProvider>
    </NotificationProvider>
  );
}
