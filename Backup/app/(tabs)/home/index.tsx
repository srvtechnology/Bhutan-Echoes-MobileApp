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
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { User, Plus, Flag, Activity } from "lucide-react-native";
import CustomText from "@/components/ui/CustomText";
import Header from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import AddPost from "@/components/modals/addPost";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { baseUrl } from "@/config";
import { Video } from "expo-av";
import { showToast } from "@/components/ToastHelper";
import Carousel from "react-native-reanimated-carousel";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlagModal from "@/components/modals/flagModal";
import VideoPlayer from "@/components/VideoPlayer";
import PostConsentModal from "@/components/modals/postConsent";
import axiosInstance from "@/helpers/axiosInstance";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [postId, setPostId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isConsentModal, setIsConsentModal] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await axiosInstance.get(baseUrl + "/timeline-entries");
      setPosts(data.timeline_entries);
    } catch (error) {
      console.log("Fetch posts error:", error);
      showToast("error", "Error fetching posts", "Please try again.");
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  }, []);
  const fetchUserDetailsFromLocalStorage = async () => {
    try {
      const userDetails = await AsyncStorage.getItem("user");
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
      const { data } = await axiosInstance.get(baseUrl + "/events");
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

      const res = await axiosInstance.post(
        baseUrl + "/timeline-entries",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Toast.show({
        type: "success",
        text1: res.data.message,
      });
      const postData = {
        ...res.data.timeline_entry,
        user_name: userDetails.name,
        user_image: userDetails.image,
      };
      const newPosts = [...posts];
      newPosts.unshift(postData);

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
        const res = await axiosInstance.post(
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

  const InstagramLikeFeedItem = ({ post }: any) => {
    const [imageAspectRatio, setImageAspectRatio] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      if (post.media_type === "image" && post.media_url) {
        // Get actual image dimensions
        Image.getSize(
          post.media_url,
          (width, height) => {
            setImageAspectRatio(width / height);
            setImageLoaded(true);
          },
          (error) => {
            console.log("Failed to get image size:", error);
            setImageError(true);
            setImageLoaded(true);
          }
        );
      }
    }, [post.media_url]);

    // Calculate optimal image height
    const getOptimalImageHeight = () => {
      // Instagram's constraints
      const MIN_HEIGHT = SCREEN_WIDTH * 0.6; // Minimum height
      const MAX_HEIGHT = SCREEN_WIDTH * 1.25; // Maximum height

      if (imageError) return SCREEN_WIDTH; // Fallback to square

      const calculatedHeight = SCREEN_WIDTH / imageAspectRatio;

      // Clamp between min and max
      return Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, calculatedHeight));
    };

    if (!imageLoaded) {
      return (
        <View style={[styles.imagePlaceholder, { height: SCREEN_WIDTH }]}>
          <Text style={styles.loadingText}>Loading image...</Text>
        </View>
      );
    }

    const imageHeight = getOptimalImageHeight();

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.media_url }}
          style={[
            styles.feedImage,
            {
              height: imageHeight,
              width: SCREEN_WIDTH,
            },
          ]}
          resizeMode="cover" // Key for Instagram-like display
          onError={() => setImageError(true)}
          onLoad={() => console.log("Image loaded successfully")}
        />
      </View>
    );
  };

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
            <InstagramLikeFeedItem post={post} />
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
    router.push("/(tabs)/home/normalEvents");
  };

  const dummyBanners = [
    {
      id: 1,
      image: require("../../../assets/images/bannerBg.png"),
      title: "Lorem Ipsum Dolor",
    },
    {
      id: 2,
      image: require("../../../assets/images/bannerBg.png"),
      title: "Lorem Ipsum Dolor",
    },
    {
      id: 3,
      image: require("../../../assets/images/bannerBg.png"),
      title: "Lorem Ipsum Dolor",
    },
  ];

  const handleAddPostClick = async () => {
    const isConsentGiven = await AsyncStorage.getItem("consent");
    if (isConsentGiven === "Y") {
      setShowPostModal(true);
    } else {
      setIsConsentModal(true);
      Toast.show({
        type: "info",
        text1: "Please accept this EULA agreement in order to post something.",
      });
    }
  };

  const onConsentClick = async (consent: string) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const { data } = await axiosInstance.post(
        baseUrl + "/update-agree",
        {
          user_agree: consent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await AsyncStorage.setItem("consent", consent);
      setIsConsentModal(false);
      if (consent === "Y") {
        setShowPostModal(true);
      }
    } catch (error) {
      console.log("Error submitting consent:", JSON.stringify(error));
    }
  };

  useEffect(() => {
    fetchUserDetailsFromLocalStorage();
    fetchPosts();
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Bhutan Echoes" back={false} />
      {refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#48732C" />
        </View>
      )}
      {/* User Post */}
      <FlatList
        ListHeaderComponent={
          <>
            {/* Featured Event Card */}
            <View style={styles.featuredCard}>
              <Carousel
                width={SCREEN_WIDTH / 1.1}
                height={200}
                data={dummyBanners}
                // data={featuredEvents}
                renderItem={({ item }: any) => (
                  <ImageBackground
                    resizeMode="cover"
                    resizeMethod="auto"
                    source={item.image}
                    // source={{ uri: item.banner_images[0] }}
                    style={styles.featuredBackground}
                  >
                    {/* <View style={styles.featuredContent}>
                      <Text style={styles.featuredTitle}>{item.title}</Text>
                      <Text style={styles.featuredTitle}>
                        {moment(item.end_date).format("YYYY")}
                      </Text>
                      <Text style={styles.featuredTitle}>
                        {moment(item.start_date).format("D MMMM")} -{" "}
                        {moment(item.end_date).format("D MMMM")}
                      </Text>
                      <Text style={styles.saveButtonText}>SAVE THE DATE</Text>
                    </View> */}
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
                      { backgroundColor: "#fff", borderColor: "#CA3115" },
                    ]}
                  >
                    <View style={[styles.greenBorder, { overflow: "hidden" }]}>
                      <Image
                        style={{ height: 40, width: 40 }}
                        source={require("../../../assets/icons/live.gif")}
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
                              resizeMode="cover"
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
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPostClick}>
        <Plus size={28} color="white" />
      </TouchableOpacity>

      {/* Post Modal */}
      {showPostModal && (
        <AddPost
          setShowPostModal={setShowPostModal}
          showPostModal={showPostModal}
          onPostCreated={handlePostCreated}
        />
      )}
      {/* Flag Modal */}
      <FlagModal
        showPostModal={showFlagModal}
        setShowPostModal={setShowFlagModal}
        onFlagSubmit={handleFlagSubmit}
      />
      <PostConsentModal
        setShowPostModal={setIsConsentModal}
        showPostModal={isConsentModal}
        handleConsent={onConsentClick}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  featuredCard: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
  },
  featuredBackground: {
    // flex: 1,
    // overflow: "hidden",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 8,
    height: 250,
    width: SCREEN_WIDTH / 1.1,
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
    marginHorizontal: 5,
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
    overflow: "hidden",
  },
  eventEmoji: {
    height: "100%",
    width: "100%",
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
    height: "100%",
  },
  postVideo: {
    width: "100%",
    height: 200,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    alignSelf: "center",
  },
  feedImage: {
    backgroundColor: "#f5f5f5", // Loading background
  },
  imagePlaceholder: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  loadingText: {
    color: "#999",
    fontSize: 14,
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
