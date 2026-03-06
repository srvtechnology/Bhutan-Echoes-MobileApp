import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/header";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { baseUrl } from "@/config";
import { showToast } from "@/components/ToastHelper";
import moment from "moment";
import axiosInstance from "@/helpers/axiosInstance";

export default function LiveEvents() {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filteredEvents = events.filter((event: any) =>
    event.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(baseUrl + "/live-sessions");
      console.log("Events:", data);

      setEvents(data.live_sessions);
      setLoading(false);
    } catch (error) {
      console.log("Fetch posts error:", error);
      showToast("error", "Error fetching posts", "Please try again.");
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Live Events" />
      {loading && (
        <View style={{ alignItems: "center", paddingTop: 20 }}>
          <ActivityIndicator size="large" color="#48732C" />
        </View>
      )}
      {!loading && filteredEvents.length === 0 && (
        <View style={{ alignItems: "center", paddingTop: 20 }}>
          <Text
            style={{ fontFamily: "interMedium", fontSize: 16, color: "#333" }}
          >
            No data found
          </Text>
        </View>
      )}
      {!loading && filteredEvents.length > 0 && (
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.search}>
                <Search size={26} color={"#888"} style={styles.searchIcon} />
                <TextInput
                  placeholder="Search Events"
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
            </>
          }
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={`event- ${item?.id}`}
              style={styles.featuredCard}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/eventDetails",
                  params: { id: item?.id },
                })
              }
            >
              <Image
                source={{ uri: item?.thumbnail }}
                style={styles.featuredImage}
              />
              <View style={styles.eventDetails}>
                <Text style={styles.featuredTitle}>Event: {item?.title}</Text>
                <Text style={styles.featuredTitle}>
                  Date: {moment(item?.start_time).format("D MMM, YY")} -{" "}
                  {moment(item?.end_time).format("D MMM, YY")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
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
  search: {
    backgroundColor: "#dddddd",
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    fontStyle: "italic",
    fontFamily: "inter",
    fontSize: 15,
    color: "#888",
    width: "90%",
  },
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 17,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    backgroundColor: "#F9F9F9",
  },
  featuredImage: {
    height: 181,
    width: "100%",
    borderRadius: 17,
  },
  featuredContent: {
    padding: 25,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  eventDetails: {
    padding: 10,
  },
  featuredTitle: {
    fontSize: 12,
    fontFamily: "inter",
    color: "#000",
    marginBottom: 2,
  },
  saveButton: {},
  saveButtonText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: "interBold",
  },
});
