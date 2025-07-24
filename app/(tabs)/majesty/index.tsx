import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Play, UserCircle2 } from "lucide-react-native";
import Header from "@/components/header";
import { Video } from "expo-av";
import axios from "axios";
import { baseUrl, mediaUrl } from "@/config";
import { router } from "expo-router";
import MajestyAudio from "@/components/MajestyAudio";

const { width: screenWidth } = Dimensions.get("window");

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function MajestyTimelineScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/all-media`);
      // console.log("Majesty response", response.data);

      const mediaList = response?.data?.all_medias || [];
      const updatedList = mediaList.map((item) => {
        if (item.media_type === "image" && typeof item.media_url === "string") {
          try {
            const parsedUrls = JSON.parse(item.media_url.replace(/\\/g, ""));
            const fullUrls = parsedUrls.map((url) => `${mediaUrl}${url}`);
            return { ...item, media_url: fullUrls };
          } catch (e) {
            console.warn("Failed to parse media_url for image:", item.id);
            return item;
          }
        }
        if (item.media_type === "audio") {
          try {
            const fullUrls = `${mediaUrl}${item.media_url}`;
            return { ...item, media_url: fullUrls };
          } catch (e) {
            console.warn("Failed to parse media_url for audio:", item.id);
            return item;
          }
        }
        if (item.media_type === "video") {
          try {
            const fullUrls = `${mediaUrl}${item.media_url}`;
            return { ...item, media_url: fullUrls };
          } catch (e) {
            console.warn("Failed to parse media_url for audio:", item.id);
            return item;
          }
        }
        return item;
      });
      // console.log("updatedList", updatedList);

      setData(updatedList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    const mediaType = item.media_type;

    return (
      <View style={styles.timelineItem}>
        {/* Common Royal Info */}

        {/* Conditional Media Block */}
        {mediaType === "video" && (
          <View style={styles.videoSection}>
            <View style={styles.royalInfoSection}>
              <View style={styles.organizationSection}>
                <UserCircle2 size={20} color={"purple"} />
                <Text style={styles.organizationName}>Bhutan Echoes</Text>
              </View>
              {item.description ? (
                <Text style={styles.royalDescription}>{item.description}</Text>
              ) : null}
            </View>
            <Video
              source={{
                uri: item.media_url,
              }}
              style={styles.postVideo}
              useNativeControls
              shouldPlay={false}
              isMuted={false}
            />
          </View>
        )}

        {mediaType === "audio" && <MajestyAudio item={item} />}

        {mediaType === "image" && item.media_url?.length > 0 && (
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
                {Array.isArray(item.media_url) &&
                  item.media_url?.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.eventImage}
                      resizeMode="cover"
                    />
                  ))}
              </ScrollView>

              <View style={styles.imageIndicators}>
                {Array.isArray(item.media_url) &&
                  item.media_url.map((_, index) => (
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
        )}

        {/* Default / Text-only Block */}
        {mediaType === "text" ? (
          <View style={styles.messageSectionContainer}>
            <View style={styles.messageSection}>
              <Text style={styles.messageTitle}>{item.title}</Text>
              <Text style={styles.messageContent}>{item.description}</Text>
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  // if (isLoading) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size="large" color="#48732C" />
  //     </View>
  //   );
  // }
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header back={false} title="Majesty Timeline" />

      {/* Quiz Button */}
      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => router.push("/(tabs)/majesty/quizes")}
      >
        <Text style={styles.quizButtonText}>Majesty Quizes</Text>
      </TouchableOpacity>
      {refreshing ||
        (isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#48732C" />
          </View>
        ))}

      {/* Timeline Feed */}
      {data?.length === 0 && !isLoading ? (
        <View style={styles.loaderContainer}>
          <Text>No Data Found!</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    flex: 1,
    height: "100%",
  },
  timelineItem: {},
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
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
