import { View, Text, ScrollView } from "react-native";
import React from "react";
import { theme } from "@/theme/theme";
import Header from "@/components/header";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";

export default function CategoryDetails() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ backgroundColor: theme.colors.bg }}
    >
      {/* Header */}
      <Header back />
      {/* Category Tabs */}
      <CategoryTabs />

      {/* Day Schedule */}
      <DaySchedule />
    </ScrollView>
  );
}
