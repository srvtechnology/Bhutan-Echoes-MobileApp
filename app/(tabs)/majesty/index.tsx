import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Play, UserCircle2 } from "lucide-react-native";
import Header from "@/components/header";
import { Video } from "expo-av";
import axios from "axios";
import { baseUrl } from "@/config";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function MajestyTimelineScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.round(contentOffset.x / screenWidth);
    setCurrentImageIndex(imageIndex);
  };

  const audioResources = [
    {
      id: "1",
      title: "Resource 2 - Audio",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      duration: "15:30",
    },
    {
      id: "2",
      title: "Royal Speech - National Day",
      description:
        "His Majesty's address to the nation on National Day celebration.",
      duration: "22:45",
    },
  ];

  const eventImages = [
    "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg",
    "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg",
    "https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg",
  ];

  const handlePlayAudio = (resource: any) => {
    Alert.alert("Play Audio", `Playing: ${resource.title}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header back={false} title="Majesty Timeline" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Quiz Button */}
        <TouchableOpacity
          style={styles.quizButton}
          onPress={() => router.push("/(tabs)/majesty/quizes")}
        >
          <Text style={styles.quizButtonText}>Majesty Quizes</Text>
        </TouchableOpacity>
        {/* Royal Information */}
        <View style={styles.royalInfoSection}>
          <View style={styles.organizationSection}>
            <UserCircle2 size={20} color={"purple"} />
            <Text style={styles.organizationName}>Bhutan Echoes</Text>
          </View>
          <Text style={styles.royalDescription}>
            His Majesty King Jigme Khesar Namgyel Wangchuck is the fifth king of
            Bhutan.
          </Text>
        </View>

        {/* Hero Image */}
        <View style={styles.videoSection}>
          <Video
            source={{
              uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            }}
            style={styles.postVideo}
            useNativeControls
            // resizeMode="contain"
            shouldPlay={false}
            isMuted={false}
            // poster="https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg"
          />
        </View>

        {/* Quiz Section */}
        {/* {!isQuizLoading && (
          <QuizSectionMajesty
            questions={quizes?.questions}
            onQuizComplete={handleQuizComplete}
          />
        )} */}

        {/* Audio Resources */}
        <View style={styles.audioSection}>
          {audioResources.map((resource) => (
            <View style={styles.audioContainer}>
              <TouchableOpacity
                key={resource.id}
                style={styles.audioItem}
                onPress={() => handlePlayAudio(resource)}
              >
                <View style={styles.audioIcon}>
                  <Play size={24} color="white" />
                </View>
                <View style={styles.audioInfo}>
                  <Text style={styles.audioTitle}>{resource.title}</Text>
                  <Text style={styles.audioDescription}>
                    {resource.description}
                  </Text>
                  {/* {resource.duration && (
                  <Text style={styles.audioDuration}>
                    Duration: {resource.duration}
                  </Text>
                )} */}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Message from His Majesty */}
        <View style={styles.messageSectionContainer}>
          <View style={styles.messageSection}>
            <Text style={styles.messageTitle}>Message from His Majesty</Text>
            <Text style={styles.messageContent}>
              His Majesty King Jigme Khesar Namgyel Wangchuck is the fifth king
              of Bhutan. Known for his humble personality, his approachability
              and his popularity, he is lovingly called the People's King in the
              country. Very few people know that is Majesty was born in
              Kathmandu, Nepal.
            </Text>
          </View>
        </View>

        {/* Recent Photos */}
        <View style={styles.photosSection}>
          <Text style={styles.photosTitle}>Recent photos of His Majesty</Text>

          <View style={styles.imageSection}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
            >
              {eventImages.map((image, index) => (
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
              {eventImages.map((_, index) => (
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
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  quizButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#48732C",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
  },
  quizButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "interBold",
  },
  royalInfoSection: {
    backgroundColor: "white",
    marginTop: 10,
    paddingTop: 20,
  },
  organizationSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  organizationName: {
    fontSize: 12,
    fontFamily: "interBold",
    color: "#222",
    marginLeft: 5,
  },
  royalDescription: {
    backgroundColor: "#dddddd",
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontFamily: "interMedium",
    paddingVertical: 10,
  },
  videoSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },

  postVideo: {
    width: "100%",
    height: 215,
  },
  audioContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    marginTop: 5,
  },
  audioSection: {
    paddingBottom: 5,
    backgroundColor: "#F9F9F9",
  },
  audioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#48732B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#333",
    marginBottom: 4,
  },
  audioDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
    fontFamily: "inter",
  },
  audioDuration: {
    fontSize: 12,
    color: "#999",
  },
  messageSectionContainer: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  messageSection: {
    backgroundColor: "#dddddd",
    padding: 20,
  },

  messageTitle: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#000",
    marginBottom: 10,
  },
  messageContent: {
    fontSize: 14,
    color: "#000",
    lineHeight: 22,
    textAlign: "justify",
    fontFamily: "inter",
  },
  imageSection: {
    position: "relative",
  },
  eventImage: {
    width: screenWidth - 20,
    height: 220,
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
  photosSection: {
    backgroundColor: "#dddddd",
    paddingTop: 20,
    marginTop: 10,
  },
  photosTitle: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#000",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});
