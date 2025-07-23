import { Tabs } from "expo-router";
import { Image, View } from "react-native";

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
        tabBarActiveTintColor: "#48732C",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarShowLabel: false,
        tabBarIconStyle: { height: 40 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? "#e0e0e0" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {focused ? (
                <Image
                  source={require("../../assets/icons/home.png")}
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
              ) : (
                <Image
                  source={require("../../assets/icons/home.png")}
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="majesty"
        options={{
          title: "Featured",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? "#e0e0e0" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {focused ? (
                <Image
                  source={require("../../assets/icons/majesty.png")}
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
              ) : (
                <Image
                  source={require("../../assets/icons/majesty.png")}
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "Discover",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? "#e0e0e0" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {focused ? (
                <Image
                  source={require("../../assets/icons/feed.png")}
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
              ) : (
                <Image
                  source={require("../../assets/icons/feed.png")}
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? "#e0e0e0" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {focused ? (
                <Image
                  source={require("../../assets/icons/profile.png")}
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
              ) : (
                <Image
                  source={require("../../assets/icons/profile.png")}
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
