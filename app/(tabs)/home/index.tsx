import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { Bell, Plus, X, Paperclip } from "lucide-react-native";
import CustomText from "@/components/ui/CustomText";
import Header from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import AddPost from "@/components/modals/addPost";
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { baseUrl } from "@/config";
import { Video } from "expo-av";
import { showToast } from "@/components/ToastHelper";

export default function HomeScreen() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios(baseUrl + "/timeline-entries");
      // console.log("Posts:", data);

      setPosts(data.timeline_entries);
    } catch (error) {
      console.log("Fetch posts error:", error);
      showToast("error", "Error fetching posts", "Please try again.");
    }
  };
  const fetchEvents = async () => {
    try {
      const { data } = await axios(baseUrl + "/events");
      console.log("Events:", data);

      setEvents(data.events);
    } catch (error) {
      console.log("Fetch events error:", error);
      showToast("error", "Error fetching events", "Please try again.");
    }
  };

  const handleJoinLiveEvents = () => {
    router.push("/(tabs)/home/liveEvents");
  };

  useEffect(() => {
    fetchPosts();
    fetchEvents();
  }, []);

  const renderPost = ({ item: post }: any) => (
    <View style={styles.userPost}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Image
            source={require("../../../assets/icons/camera.png")}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.username}>Tshering</Text>
      </View>

      <View style={styles.postBody}>
        {post.media_type === "text" && (
          <>
            <Text style={styles.postTitle}>{post.title}</Text>
            <CustomText variant="inter" style={styles.postContent}>
              {post.description}
            </CustomText>
          </>
        )}

        {post.media_type === "image" && (
          <View style={{ flex: 1 }}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <CustomText variant="inter" style={styles.postContent}>
              {post.description}
            </CustomText>
            <Image
              source={post.media_url}
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}

        {post.media_type === "video" && (
          <View style={{ flex: 1 }}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <CustomText variant="inter" style={styles.postContent}>
              {post.description}
            </CustomText>
            <Video
              source={{ uri: post.media_url }}
              style={styles.postVideo}
              useNativeControls
              resizeMode="contain"
              shouldPlay={false}
            />
          </View>
        )}
      </View>
    </View>
  );

  const handleSeeMoreEvents = () => {
    // router.push("/(tabs)/home/events");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* User Post */}
      <FlatList
        ListHeaderComponent={
          <>
            {/* Header */}
            <Header title="Bhutan Echoes" />

            {/* Featured Event Card */}
            <View style={styles.featuredCard}>
              <ImageBackground
                source={require("../../../assets/images/banner.png")}
                style={styles.featuredBackground}
              >
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>
                    Drukyul's Literature and Arts Festival
                  </Text>
                  <Text style={styles.featuredTitle}>2025</Text>
                  <Text style={styles.featuredTitle}>2nd - 4th August</Text>
                  <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>SAVE THE DATE</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>

            {/* Future Events */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Future Events</Text>
              <View style={styles.eventsGrid}>
                <TouchableOpacity
                  style={styles.eventItem}
                  onPress={handleJoinLiveEvents}
                >
                  <View
                    style={[
                      styles.eventIcon,
                      { backgroundColor: "#EEE8E8", borderColor: "#CA3115" },
                    ]}
                  >
                    <View style={styles.greenBorder}>
                      <Image
                        style={styles.eventEmoji}
                        source={require("../../../assets/icons/camera.png")}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                  <Text style={styles.eventLabel}>Join Live Events</Text>
                </TouchableOpacity>
                {/* Events */}
                {events.length === 0 ? (
                        <View
                          style={[
                            styles.eventIcon,
                            { backgroundColor: "#EEE8E8" },
                          ]}
                        >
                        <Text style={styles.eventLabel}>No upcoming events </Text>
                        </View>
                ) : (
                  <FlatList
                  data={
                    events.length > 3
                      ? [
                          ...events.slice(0, 3),
                          { id: "see-more", isSeeMore: true },
                        ]
                      : events
                  }
                  keyExtractor={(item) => item.id?.toString() ?? "see-more"}
                  renderItem={({ item }) =>
                    item.isSeeMore ? (
                      <TouchableOpacity
                        style={[styles.eventItem, { justifyContent: "center" }]}
                        onPress={handleSeeMoreEvents}
                      >
                        <Text style={styles.eventSeeMore}>See More</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.eventItem}>
                        <View
                          style={[
                            styles.eventIcon,
                            { backgroundColor: "#EEE8E8" },
                          ]}
                        >
                          <Image
                            style={styles.eventEmoji}
                            source={{ uri: item.icon }}
                            resizeMode="contain"
                          />
                        </View>
                        <Text style={styles.eventLabel}>{item.title}</Text>
                      </TouchableOpacity>
                    )
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />)}
              </View>
            </View>
          </>
        }
        data={posts || []}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowPostModal(true)}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>

      {/* Post Modal */}
      <AddPost
        setShowPostModal={setShowPostModal}
        showPostModal={showPostModal}
      />
    </SafeAreaView>
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
  featuredCard: {
    margin: 20,
    borderRadius: 17,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  featuredBackground: {},
  featuredContent: {
    padding: 25,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  featuredTitle: {
    fontSize: 17,
    fontFamily: "interMedium",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  saveButton: {},
  saveButtonText: {
    color: "white",
    fontSize: 8,
    fontFamily: "interBold",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#000",
    marginBottom: 15,
  },
  eventsGrid: {
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  eventItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  eventSeeMore: {
    fontSize: 16,
    color: "#48732C",
    fontFamily: "interMedium",
    textAlign: "center",
    fontStyle: "italic",
    textTransform: "capitalize",
    textDecorationLine: "underline",
  },
  redBorder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#CA3115",
    justifyContent: "center",
    alignItems: "center",
  },
  greenBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#48732C",
    justifyContent: "center",
    alignItems: "center",
  },
  eventIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 8,
    borderWidth: 2,
    borderColor: "#48732C",
  },
  eventEmoji: {
    height: 34,
    width: 34,
  },
  eventLabel: {
    fontSize: 10,
    color: "#000",
    textAlign: "center",
    fontFamily: "interMedium",
    marginTop: 8,
  },
  userPost: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 21,
    height: 21,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#e0e0e0",
    marginLeft: 20,
  },
  avatarImage: {
    height: 21,
    width: 21,
  },
  username: {
    fontSize: 12,
    fontFamily: "interBold",
    color: "#000",
  },
  postBody: {
    backgroundColor: "#D9D9D9",
  },
  postTitle: {
    fontSize: 14,
    fontFamily: "interBold",
    color: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postContent: {
    fontSize: 14,
    fontFamily: "inter",
    color: "#000",
    flexShrink: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  postVideo: {
    width: "100%",
    height: 200,
  },

  fab: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -28 }], // half of width to truly center it
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#48732C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
