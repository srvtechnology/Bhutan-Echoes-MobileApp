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
import { Play } from "lucide-react-native";
import WebView from "react-native-webview";
import Header from "@/components/header";
import { theme } from "@/theme/theme";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";
import Sponsers from "@/components/Sponsers";
import YouTubePlayer from "@/components/YouTubePlayer";

const WatchScreen = ({ navigation }: any) => {
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
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; }
      iframe { position: absolute; top:0; left:0; width:100%; height:100%; }
      .video-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div class="video-container">
      <iframe
        src="https://www.youtube.com/embed/vMF-mSpynDg?autoplay=0&controls=1&rel=0"
        frameborder="0"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  </body>
</html>
`;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ backgroundColor: theme.colors.bg }}
    >
      {/* Header */}
      <Header back />

      {/* Featured Image with Play Button */}
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <YouTubePlayer
          url="https://www.youtube.com/watch?v=vMF-mSpynDg"
          height={190}
        />
        <View
          style={{
            alignItems: "flex-start",
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
      </View>

      {/* Category Tabs */}
      <CategoryTabs />

      {/* Day Schedule */}
      <DaySchedule />
      {/* Sponsors Section */}
      <Sponsers />
    </ScrollView>
  );
};

export default WatchScreen;
