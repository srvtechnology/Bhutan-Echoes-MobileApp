import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { theme } from "@/theme/theme";
import { router } from "expo-router";

export default function CategoryTabs() {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 26,
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["Talks", "Workshops", "Dialogue", "Conversation"].map(
          (category, idx, arr) => (
            <TouchableOpacity
              key={category}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRightWidth: idx !== arr.length - 1 ? 1 : 0,
                borderRightColor: theme.colors.gray300,
              }}
              onPress={() =>
                router.push({
                  pathname: `/(tabs)/home/categoryDetails`,
                  params: { category },
                })
              }
            >
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.medium,
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </ScrollView>
    </View>
  );
}
