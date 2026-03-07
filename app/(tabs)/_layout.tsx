import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { Home, HomeIcon, Calendar, Map, Info } from "lucide-react-native";
import { theme } from "@/theme/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#EFEEEE",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray500,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "poppins",
        },
        // tabBarShowLabel: false,
        tabBarIconStyle: { height: 40 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Home width={size} height={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="Schedule"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Calendar width={size} height={size} color={color} />
          ),
          tabBarLabel: "My Schedule",
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Map width={size} height={size} color={color} />
          ),
          tabBarLabel: "Map",
        }}
      />
      <Tabs.Screen
        name="Info"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Info width={size} height={size} color={color} />
          ),
          tabBarLabel: "Info",
        }}
      />
    </Tabs>
  );
}
