import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Bell, Calendar, MapPin, Users, Clock } from "lucide-react-native";
import Header from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { baseUrl } from "@/config";
import { useLocalSearchParams } from "expo-router";
import RenderHtml from "react-native-render-html";

const { width: screenWidth } = Dimensions.get("window");

export default function OtherEventsScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [eventDetails, setEventDetails] = useState({});

  const eventImages = [
    "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg",
    "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg",
    "https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg",
  ];

  const eventDetailss = {
    title: "Blood Donation Camp Organized by Bhutan Echoes",
    date: "20-July-2025",
    venue: "Bhutan Echoes Office Ground",
    time: "08:30am - 02:30pm BST",
    participants: "Over 150 volunteers and donors",
    description: `Bhutan Echoes, a non-profit organization committed to promoting community welfare and humanitarian causes, successfully organized a Blood Donation Camp on [insert date]. The event took place at [venue], attracting enthusiastic participation from local residents, youth groups, and healthcare supporters.

The primary objective of the camp was to encourage voluntary blood donation, raise awareness about the importance of safe blood, and contribute to the national blood bank's reserves. Medical professionals from [Hospital/Blood Bank name] were present to facilitate safe collection, screening, and donor assistance.`,
    highlights: [
      "[XX] units of blood collected, which can potentially save over [XX × 3] lives.",
      "Free health check-ups were offered to all donors.",
      "Informative sessions on blood donation myths and benefits.",
      "Distribution of appreciation certificates and refreshments to all donors.",
    ],
    conclusion: `Bhutan Echoes extends heartfelt gratitude to all donors, volunteers, and medical staff for their invaluable support. The organization remains committed to fostering a culture of giving and compassion throughout Bhutan.`,
  };

  const handleImageScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.round(contentOffset.x / screenWidth);
    setCurrentImageIndex(imageIndex);
  };

  const { id } = useLocalSearchParams();

  const fetchEventDetails = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/events/${id}`);
      console.log("Event details:", data);
      setEventDetails(data.event);
    } catch (error) {
      console.log("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title={eventDetails.title} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
          >
            {eventDetails?.banner_images?.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.eventImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {eventDetails?.banner_images?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsSection}>
          <RenderHtml
            contentWidth={screenWidth}
            source={{ html: eventDetails?.description }}
          />
        </View>
        {/* <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Calendar size={20} color="#48732C" />
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{eventDetails.date}</Text>
          </View>

          <View style={styles.detailItem}>
            <MapPin size={20} color="#48732C" />
            <Text style={styles.detailLabel}>Venue:</Text>
            <Text style={styles.detailValue}>{eventDetails.venue}</Text>
          </View>

          <View style={styles.detailItem}>
            <Clock size={20} color="#48732C" />
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{eventDetails.time}</Text>
          </View>

          <View style={styles.detailItem}>
            <Users size={20} color="#48732C" />
            <Text style={styles.detailLabel}>Participants:</Text>
            <Text style={styles.detailValue}>{eventDetails.participants}</Text>
          </View>
        </View> */}

        {/* Event Description */}
        {/* <View style={styles.contentSection}>
          <Text style={styles.descriptionText}>{eventDetails.description}</Text>

          <Text style={styles.sectionTitle}>Highlights of the Event:</Text>
          {eventDetails.highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}

          <Text style={styles.conclusionText}>{eventDetails.conclusion}</Text>
        </View> */}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    position: "relative",
  },
  eventImage: {
    width: screenWidth - 20,
    height: 210,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  imageIndicators: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "white",
    width: 24,
  },
  detailsSection: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
    marginRight: 8,
    fontFamily: "interMedium",
  },
  detailValue: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    fontFamily: "interMedium",
  },
  contentSection: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 12,
    color: "#000",
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "justify",
    fontFamily: "inter",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "interMedium",
    color: "#000",
    marginBottom: 15,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#48732C",
    marginRight: 8,
    marginTop: 2,
  },
  highlightText: {
    fontSize: 12,
    color: "#000",
    lineHeight: 20,
    flex: 1,
    fontFamily: "inter",
  },
  conclusionText: {
    fontSize: 12,
    color: "#000",
    lineHeight: 22,
    marginTop: 20,
    textAlign: "justify",
    fontStyle: "italic",
    fontFamily: "inter",
  },
  bottomSpacing: {
    height: 100,
  },
});
