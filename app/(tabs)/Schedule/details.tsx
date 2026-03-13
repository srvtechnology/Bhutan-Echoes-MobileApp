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
import { PlayCircle } from "lucide-react-native";
import { router } from "expo-router";
import { theme } from "@/theme/theme";
import Header from "@/components/header";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";
import Sponsers from "@/components/Sponsers";

const HomeScreen = ({ navigation }: any) => {
  const { events, setSelectedEvent, savedEvents, fetchEvents, fetchSponsors } =
    useEventStore();
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchEvents();
    fetchSponsors();
  }, []);

  const featuredEvent = events.find((e) => e.featured);

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    router.push("/(tabs)/home/eventDetails");
  };

  const isSaved = (eventId: string) => savedEvents.includes(eventId);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ backgroundColor: theme.colors.bg }}
    >
      {/* Header */}
      <Header back={true} />

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
                    flex: 1,
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
                    flex: 1,
                    lineHeight: 20,
                  }}
                >
                  The Great Fourth's Legacy
                </Text>
              </View>

              {/* Speakers */}
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {featuredEvent.speakers.map((speaker: any) => (
                    <TouchableOpacity
                      key={speaker.id}
                      style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        flexDirection: "row",
                        alignItems: "center",
                        width: 130,
                      }}
                    >
                      <Image
                        source={{
                          uri: "https://cdn.pixabay.com/photo/2024/08/21/11/11/young-man-8985888_1280.png",
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          marginRight: 8,
                        }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontFamily: theme.typography.fontFamily.regular,
                        }}
                      >
                        {speaker.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
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
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 10,
                  }}
                  onPress={() => router.push("/(tabs)/home/watch")}
                >
                  <PlayCircle width={20} height={20} color={"red"} />
                  <Text
                    style={{
                      color: theme.colors.gray700,
                      marginLeft: 4,
                      fontFamily: theme.typography.fontFamily.regular,
                      fontSize: 10,
                    }}
                  >
                    Watch
                  </Text>
                </TouchableOpacity>
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
