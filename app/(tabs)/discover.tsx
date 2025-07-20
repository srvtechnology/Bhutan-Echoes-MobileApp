import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  Bell,
  Download,
  Play,
  FileText,
  Volume2,
} from "lucide-react-native";
import Header from "@/components/header";
import ResourceFilter from "@/components/modals/resourceFilter";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "PDF" | "Audio";
  url: string;
  size?: string;
}

export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"All" | "PDF" | "Audio">(
    "All"
  );

  const resources: Resource[] = [
    {
      id: "1",
      title: "Resource 1 - PDF",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      type: "PDF",
      url: "https://example.com/resource1.pdf",
      size: "2.5 MB",
    },
    {
      id: "2",
      title: "Resource 2 - Audio",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      type: "Audio",
      url: "https://example.com/resource2.mp3",
      size: "15.2 MB",
    },
    {
      id: "3",
      title: "Resource 1 - PDF",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      type: "PDF",
      url: "https://example.com/resource3.pdf",
      size: "1.8 MB",
    },
    {
      id: "4",
      title: "Bhutanese Literature Collection",
      description:
        "A comprehensive collection of traditional Bhutanese literary works and poems.",
      type: "PDF",
      url: "https://example.com/bhutan-literature.pdf",
      size: "5.2 MB",
    },
    {
      id: "5",
      title: "Traditional Folk Songs",
      description:
        "Audio recordings of traditional Bhutanese folk songs and cultural music.",
      type: "Audio",
      url: "https://example.com/folk-songs.mp3",
      size: "25.8 MB",
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "All" || resource.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (resource: Resource) => {
    Alert.alert("Download", `Download ${resource.title}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Download",
        onPress: () => console.log("Downloading:", resource.title),
      },
    ]);
  };

  const handleView = (resource: Resource) => {
    if (resource.type === "PDF") {
      Alert.alert("View PDF", `Opening ${resource.title}...`);
    } else {
      Alert.alert("Play Audio", `Playing ${resource.title}...`);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText size={41} color="#FF6B6B" />;
      case "Audio":
        return <Volume2 size={41} color="#48732C" />;
      default:
        return <FileText size={41} color="#666" />;
    }
  };

  const getActionButton = (resource: Resource) => {
    return (
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleView(resource)}
      >
        {resource.type === "PDF" ? (
          <Text style={styles.viewButtonText}>View</Text>
        ) : (
          <Play size={16} color="white" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ position: "relative" }}>
        <Header title="Resources for free" back={false} />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={24} color="#48732C" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Resources List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filteredResources.map((resource) => (
          <View key={resource.id} style={styles.resourceItem}>
            <View style={styles.resourceContent}>
              <View style={styles.resourceIcon}>
                {getResourceIcon(resource.type)}
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>
                  {resource.description}
                </Text>
                {/* {resource.size && (
                  <Text style={styles.resourceSize}>Size: {resource.size}</Text>
                )} */}
              </View>
            </View>
            <View style={styles.resourceActions}>
              {getActionButton(resource)}
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownload(resource)}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No resources found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Filter Modal */}
      <ResourceFilter
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        setSelectedFilter={setSelectedFilter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterButton: {
    position: "absolute",
    right: 55,
    top: 18,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dddddd",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    fontFamily: "inter",
  },
  scrollView: {
    flex: 1,
  },
  resourceItem: {
    backgroundColor: "#F9F9F9",
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 8,
  },
  resourceContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    paddingBottom: 15,
  },
  resourceIcon: {
    marginRight: 15,
    padding: 8,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
    fontFamily: "inter",
  },
  resourceDescription: {
    fontSize: 11,
    color: "#000",
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: "inter",
  },
  resourceSize: {
    fontSize: 12,
    color: "#eee",
  },
  resourceActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#48732B",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  viewButtonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "inter",
  },
  downloadButton: {
    backgroundColor: "#48732C",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButtonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "inter",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});
