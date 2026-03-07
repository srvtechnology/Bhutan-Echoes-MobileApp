"use client";
import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useEventStore } from "../../../store/eventStore";
import Header from "@/components/header";
import { theme } from "@/theme/theme";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";
import Sponsers from "@/components/Sponsers";

const HomeScreen = ({ navigation }: any) => {
  const {
    events,
    sponsors,
    setSelectedEvent,
    toggleSaveEvent,
    savedEvents,
    fetchEvents,
    fetchSponsors,
  } = useEventStore();
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchEvents();
    fetchSponsors();
  }, []);

  const featuredEvent = events.find((e) => e.featured);
  const upcomingEvents = events;

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    navigation.navigate("EventDetail");
  };

  const isSaved = (eventId: string) => savedEvents.includes(eventId);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ backgroundColor: theme.colors.bg }}
    >
      {/* Header */}
      <Header back />

      {/* Featured Event */}
      {featuredEvent && (
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            elevation: 8,
            backgroundColor: "white",
            borderRadius: 24,
            shadowColor: theme.colors.gray400,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          }}
        >
          <TouchableOpacity onPress={() => handleEventPress(featuredEvent)}>
            <View
              style={{
                backgroundColor: "#e7eedf",
                borderRadius: 24,
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.colors.gray700,
                      fontFamily: theme.typography.fontFamily.medium,
                      paddingBottom: 4,
                    }}
                  >
                    Dialogue
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: theme.typography.fontFamily.bold,
                      color: theme.colors.text,
                      lineHeight: 20,
                    }}
                  >
                    The Wisdom of Balance:
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: theme.typography.fontFamily.bold,
                      color: theme.colors.text,
                      lineHeight: 20,
                    }}
                  >
                    The Great Fourth's Legacy
                  </Text>
                </View>

                {/* Speaker */}
                <View
                  style={{
                    // overflow: "hidden",
                    borderRadius: 60,
                    alignItems: "center",
                    width: "50%",
                  }}
                >
                  <Image
                    source={{
                      uri: "https://cdn.pixabay.com/photo/2024/08/21/11/11/young-man-8985888_1280.png",
                    }}
                    style={{
                      width: 120,
                      height: 120,
                      marginRight: 8,
                      borderRadius: 60,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: theme.colors.gray600,
                      fontFamily: theme.typography.fontFamily.regular,
                      marginVertical: 8,
                      lineHeight: 15,
                    }}
                  >
                    Priya Kapoor
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: theme.colors.gray600,
                      fontFamily: theme.typography.fontFamily.regular,
                      lineHeight: 15,
                    }}
                  >
                    Chimi P.Wangdi
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 2,
                  backgroundColor: theme.colors.gray300,
                  marginVertical: 10,
                }}
              />

              {/* Time and Location */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.gray500,
                    fontFamily: theme.typography.fontFamily.medium,
                  }}
                >
                  {featuredEvent.time}
                </Text>
                <Text
                  style={{
                    fontSize: 6,
                    marginHorizontal: 6,
                    color: theme.colors.gray500,
                  }}
                >
                  {`\u25CF`}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.gray500,
                    fontFamily: theme.typography.fontFamily.medium,
                  }}
                >
                  {featuredEvent.location}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Category Tabs */}
      <CategoryTabs />

      {/* Day Schedule */}
      <DaySchedule />

      {/* Sponsors Section */}
      <Sponsers />
    </ScrollView>
  );
};

export default HomeScreen;
