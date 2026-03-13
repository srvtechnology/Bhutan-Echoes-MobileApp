import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import React, { useEffect } from "react";
import Header from "@/components/header";
import { theme } from "@/theme/theme";
import { router } from "expo-router";

export default function Schedule() {
  const events = [
    {
      id: "1",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
    {
      id: "2",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: true,
    },
    {
      id: "3",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
    {
      id: "4",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
    {
      id: "5",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: true,
    },
    {
      id: "6",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
    {
      id: "7",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <Header back={false} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.primary,
            marginVertical: 10,
            paddingHorizontal: 16,
          }}
        >
          My Events
        </Text>
        <FlatList
          style={{ backgroundColor: theme.colors.bg, paddingHorizontal: 16 }}
          data={events}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginBottom: 10,
                elevation: 8,
                shadowColor: theme.colors.gray400,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
              onPress={() => router.push("/Schedule/details")}
            >
              <View
                style={{
                  // padding: 16,
                  borderRadius: 24,
                  overflow: "hidden",
                  backgroundColor: "white",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#e7eedf",
                    padding: 16,
                    borderBottomWidth: item.isFeatured ? 4 : 0,
                    borderBottomColor: item.isFeatured
                      ? theme.colors.primary
                      : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.colors.primary,
                      fontFamily: theme.typography.fontFamily.regular,
                      paddingBottom: 4,
                    }}
                  >
                    Happening Now
                  </Text>
                  <View
                    style={{
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: theme.typography.fontFamily.semiBold,
                        color: theme.colors.text,
                        // flex: 1,
                        lineHeight: 20,
                      }}
                    >
                      The Wisdom of Balance:
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: theme.typography.fontFamily.semiBold,
                        color: theme.colors.text,
                        // flex: 1,
                        lineHeight: 20,
                      }}
                    >
                      The Great Fourth's Legacy
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
