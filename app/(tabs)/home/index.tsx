/** @format */

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { User, Plus, Flag } from "lucide-react-native";
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
import Carousel from "react-native-reanimated-carousel";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlagModal from "@/components/modals/flagModal";
import VideoPlayer from "@/components/VideoPlayer";

const screnWidth = Dimensions.get("screen").width;

export default function HomeScreen() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [postId, setPostId] = useState("");

  const fetchPosts = async () => {
    try {
      const { data } = await axios(baseUrl + "/timeline-entries");
      console.log("Posts: ------ ", data);

      setPosts(data.timeline_entries);
    } catch (error) {
      console.log("Fetch posts error:", error);
      showToast("error", "Error fetching posts", "Please try again.");
    }
  };
  const fetchUserDetailsFromLocalStorage = async () => {
    try {
      const userDetails = await AsyncStorage.getItem("user");
      console.log("userDetails", userDetails);

      if (userDetails) {
        const parsedUserDetails = JSON.parse(userDetails);
        setUserDetails(parsedUserDetails);
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data } = await axios(baseUrl + "/events");
      const featured = data.events.filter(
        (event: any) => event.is_featured === true
      );
      setFeaturedEvents(featured);

      setEvents(data.events);
    } catch (error) {
      console.log("Fetch events error:", error);
      showToast("error", "Error fetching events", "Please try again.");
    }
  };

  const handleJoinLiveEvents = () => {
    router.push("/(tabs)/home/liveEvents");
  };

  const handlePostCreated = async (post: any) => {
    try {
      console.log("Post created:", post);

      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      // formData.append("title", "");
      formData.append("description", post.text);
      formData.append("media_type", post.attachment?.fileType || "text");
      if (post?.attachment?.uri) {
        formData.append("media_url", {
          uri: post.attachment?.uri,
          type: post.attachment?.type,
          name: post.attachment?.name,
        });
      }
      formData.append("decade", new Date().getFullYear().toString());

      console.log("formData", formData);

      const res = await axios.post(baseUrl + "/timeline-entries", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("res", res);

      Toast.show({
        type: "success",
        text1: res.data.message,
      });
      const postData = {
        ...res.data.timeline_entry,
        user_name: userDetails.name,
        user_image: userDetails.image,
      };
      console.log("Post submitted:", postData);
      const newPosts = [...posts];
      newPosts.unshift(postData);
      console.log("------", newPosts);

      setPosts(newPosts);
    } catch (error) {
      console.log("Error submitting post:", error);
    }
  };
  const handleFlagSubmit = async (reason: string, details: string) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!reason) {
        Toast.show({
          type: "error",
          text1: "Please write a reason.",
        });
        return;
      }

      if (postId?.user_id != userDetails?.id) {
        const res = await axios.post(
          baseUrl + "/user-reports",
          {
            reported_id: postId?.user_id,
            reason,
            details,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Flag submitted:", res);
        Toast.show({
          type: "success",
          text1: "User reported successfully.",
        });
      }

      setShowFlagModal(false);
    } catch (error) {
      console.log("Error submitting flag:", error);
    }
  };

  useEffect(() => {
    fetchUserDetailsFromLocalStorage();
    fetchPosts();
    fetchEvents();
  }, []);

  const renderPost = ({ item: post }: any) => (
    <View style={styles.userPost}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {post.user_image ? (
              <Image
                source={{ uri: post.user_image }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <User size={15} color={"#888"} />
            )}
          </View>
          <Text style={styles.username}>{post.user_name}</Text>
        </View>
        {post.user_id != userDetails.id && (
          <TouchableOpacity
            onPress={() => {
              setPostId(post);
              setShowFlagModal(true);
            }}
          >
            <Flag size={20} color="#CA3115" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.postBody}>
        {post.media_type === "text" && (
          <View style={{ flex: 1, paddingTop: 10 }}>
            {post.title && <Text style={styles.postTitle}>{post.title}</Text>}
            <CustomText variant="inter" style={styles.postContent}>
              {post.description}
            </CustomText>
          </View>
        )}

        {post.media_type === "image" && (
          <View style={{ flex: 1, paddingTop: 10 }}>
            {post.title && <Text style={styles.postTitle}>{post.title}</Text>}
            <CustomText variant="inter" style={styles.postContent}>
              {post.description}
            </CustomText>
            <Image
              source={{ uri: post.media_url }}
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}

        {post.media_type === "video" && (
          <View style={{ flex: 1, paddingTop: 10 }}>
            {post.title && <Text style={styles.postTitle}>{post.title}</Text>}
            <CustomText variant="inter" style={styles.postContent}>
              {post.description}
            </CustomText>
            <VideoPlayer url={post.media_url} />
            {/* <Video
              source={{ uri: post.media_url }}
              style={styles.postVideo}
              useNativeControls
              resizeMode="contain"
              shouldPlay={false}
            /> */}
          </View>
        )}
      </View>
    </View>
  );

  const handleSeeMoreEvents = () => {
    // router.push("/(tabs)/home/events");
  };

  return (
    <View style={styles.container}>
      {/* User Post */}
      <FlatList
        ListHeaderComponent={
          <>
            {/* Header */}
            <Header title="Bhutan Echoes" back={false} />

            {/* Featured Event Card */}
            <View style={styles.featuredCard}>
              <Carousel
                width={screnWidth / 1.1}
                height={200}
                data={featuredEvents}
                renderItem={({ item }: any) => (
                  <ImageBackground
                    source={{ uri: item.banner_images[0] }}
                    style={styles.featuredBackground}
                  >
                    <View style={styles.featuredContent}>
                      <Text style={styles.featuredTitle}>{item.title}</Text>
                      <Text style={styles.featuredTitle}>
                        {moment(item.end_date).format("YYYY")}
                      </Text>
                      <Text style={styles.featuredTitle}>
                        {moment(item.start_date).format("D MMMM")} -{" "}
                        {moment(item.end_date).format("D MMMM")}
                      </Text>
                      <Text style={styles.saveButtonText}>SAVE THE DATE</Text>
                    </View>
                  </ImageBackground>
                )}
                loop
                autoPlay
                autoPlayInterval={4000}
                style={{ borderRadius: 17 }}
              />
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
                    style={[styles.eventIcon, { backgroundColor: "#EEE8E8" }]}
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
                          style={[
                            styles.eventItem,
                            { justifyContent: "center" },
                          ]}
                          onPress={handleSeeMoreEvents}
                        >
                          <Text style={styles.eventSeeMore}>See More</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.eventItem}
                          onPress={() =>
                            router.push({
                              pathname: `/(tabs)/home/otherEventDetails`,
                              params: { id: item.id },
                            })
                          }
                        >
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
                  />
                )}
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
        onPostCreated={handlePostCreated}
        user={userDetails}
      />
      {/* Flag Modal */}
      <FlagModal
        showPostModal={showFlagModal}
        setShowPostModal={setShowFlagModal}
        onFlagSubmit={handleFlagSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  featuredCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  featuredBackground: {
    flex: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  featuredContent: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredTitle: {
    fontSize: 17,
    fontFamily: "interBold",
    color: "white",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 10,
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
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 21,
    height: 21,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#e0e0e0",
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
    backgroundColor: "#dddddd",
  },
  postTitle: {
    fontSize: 14,
    fontFamily: "interBold",
    color: "#444",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 14,
    fontFamily: "inter",
    color: "#444",
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
