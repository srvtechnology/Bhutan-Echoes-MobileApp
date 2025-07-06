import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useState } from "react";
import Header from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Search } from "lucide-react-native";

export default function LiveEvents() {
  const [showPostModal, setShowPostModal] = useState(false);

  const handleJoinLiveEvents = () => {
    router.push("/(tabs)/home/liveEvents");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header title="Live Events" />
        {/* Search */}
        <View style={styles.search}>
          <Search size={26} color={"#888"} style={styles.searchIcon} />
          <TextInput placeholder="Search Events" style={styles.searchInput} />
        </View>

        {/* Featured Event Card */}
        <TouchableOpacity onPress={() => router.push("/(tabs)/home/eventDetails")}>
          <View style={styles.featuredCard}>
            <Image
              source={require("../../../assets/images/banner.png")}
              style={styles.featuredImage}
            />
            <View style={styles.eventDetails}>
              <Text style={styles.featuredTitle}>
                Event: Drukyul's Literature and Arts Festival
              </Text>
              <Text style={styles.featuredTitle}>Date: 2nd - 4th August</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  search: {
    backgroundColor: "#D9D9D9",
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
    marginBottom: 10,
    borderRadius: 17,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
