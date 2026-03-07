import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/theme/theme";
import { router } from "expo-router";
import { useEventStore } from "@/store/eventStore";

export default function DaySchedule() {
  const {
    events,
    sponsors,
    setSelectedEvent,
    toggleSaveEvent,
    savedEvents,
    fetchEvents,
    fetchSponsors,
  } = useEventStore();

  const upcomingEvents = events;

  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    fetchEvents();
    fetchSponsors();
  }, []);
  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    router.push("/(tabs)/home/eventDetails");
  };
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 12,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        {[1, 2, 3, 4].map((day) => (
          <TouchableOpacity
            key={day}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor:
                day === selectedDay ? theme.colors.primary : "#e7eedf",
              flex: 1,
              alignItems: "center",
            }}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={{
                fontSize: 12,
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.medium,
              }}
            >
              Day {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Event Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          width: "94%",
          alignSelf: "center",
        }}
      >
        {upcomingEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            onPress={() => handleEventPress(event)}
            style={{
              // width: width * 0.35,
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: "https://cdn.pixabay.com/photo/2024/08/21/11/11/young-man-8985888_1280.png",
              }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 40,
                marginBottom: 8,
                backgroundColor: theme.colors.primary,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                color: theme.colors.text,
                textAlign: "center",
                fontFamily: theme.typography.fontFamily.regular,
                height: 30,
                width: 80,
              }}
              numberOfLines={2}
            >
              {event.title.split(":")[0]}
            </Text>
            <View
              style={{
                height: 2,
                backgroundColor: theme.colors.gray300,
                width: "100%",
                marginVertical: 6,
                marginTop: 20,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                color: theme.colors.gray600,
                marginTop: 4,
                fontFamily: theme.typography.fontFamily.regular,
              }}
            >
              {event.time}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: theme.colors.gray600,
                fontFamily: theme.typography.fontFamily.regular,
              }}
            >
              RUB Hall
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
