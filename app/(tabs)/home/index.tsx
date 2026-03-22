"use client";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useEventStore } from "../../../store/eventStore";
import { PlayCircle } from "lucide-react-native";
import { router } from "expo-router";
import { theme } from "@/theme/theme";
import Header from "@/components/header";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";
import Sponsers from "@/components/Sponsers";
import axios from "axios";
import { baseUrl, mediaUrl } from "@/config";
import moment from "moment";

const HomeScreen = ({ navigation }: any) => {
  const { events, setSelectedEvent, savedEvents, fetchEvents, fetchSponsors } =
    useEventStore();
  const { width } = useWindowDimensions();

  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const initialize = async () => {
      // fetch events from API and set to state
      try {
        const { data } = await axios.get(
          `${baseUrl}/event-management/featured-event-list`,
        );
        const featuredEvents = data?.data || [];
        const currentDate = new Date();
        
        if (featuredEvents.length > 0) {
          const nearestDate =featuredEvents.reduce((prev: any, next: any) => {
            const prevDate = new Date(prev.start_date);
            const nextDate = new Date(next.start_date);

            const prevDiff = Math.abs(prevDate - currentDate);
            const nextDiff = Math.abs(nextDate - currentDate);

            return prevDiff < nextDiff ? prev : next;
          })
         console.log("nearestDate, ",nearestDate);
         await fetchEventDetails(nearestDate.id);
        }
  
        
      } catch (error) {
        console.log("Error fetching all events: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEventDetails = async (eventId: string) => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/event-management/details/${eventId}`,
        );
        console.log("==== Event Details ====", data);
        setEventData(data || {});
      } catch (error) {
        console.log("Error fetching event details: ", error);
        return null;
      }
    }
  
    const onRefresh = async () => {
      setRefreshing(true);
      await initialize();
      setRefreshing(false);
    };

  useEffect(() => {
    initialize()
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
      <Header back={false} />

      {/* Loader */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        // Content - Only render when data is fully loaded
        <>
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
                      {eventData?.event_details?.eventname} {eventData?.guest_speaker?.length}
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
                      {eventData?.guest_speaker?.length> 0 && eventData?.guest_speaker.map((speaker: any) => (
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
                              uri: `${mediaUrl}/${speaker.speaker_image}`,
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
                              flexShrink: 1
                            }}
                          >
                            {speaker.speaker_name}
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
                      {moment(eventData?.event_details?.start_time, "HH:mm:ss").format("h:mm A")}
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
                      {eventData?.event_details?.venue}
                    </Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 10,
                      }}
                      onPress={() => router.push({
                        pathname:"/(tabs)/home/watch",
                        params: eventData?.event_details
                      })}
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
          {eventData?.categories?.length > 0 && <CategoryTabs categories={eventData?.categories} />}

          {/* Day Schedule */}
          { eventData?.dates?.length > 0 && <DaySchedule dates={eventData?.dates} />}
        </>
      )}

      {/* Sponsors Section */}
      <Sponsers />
    </ScrollView>
  );
};

export default HomeScreen;
