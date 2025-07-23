import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Search,
  Filter,
  Play,
  Pause,
  FileText,
  Volume2,
} from "lucide-react-native";
import Header from "@/components/header";
import ResourceFilter from "@/components/modals/resourceFilter";
import axios from "axios";
import { baseUrl } from "@/config";
import { Audio } from "expo-av";
import ViewPdf from "@/components/modals/viewPdf";
// import {
//   downloadFile,
//   downloadFileWithRNFS,
//   downloadFileSimple,
// } from "../../helpers/downloadUtils";
import {
  downloadFile,
  downloadFileWithProgress,
} from "../../helpers/downloadUtilsExpo";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "ebook" | "audio";
  file_path?: string;
  audio_url?: string;
  size?: string;
  author?: string;
}

export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "ebook" | "audio"
  >("All");
  const [resources, setResources] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playButtonId, setPlayButtonId] = useState(0);
  const [pdfButtonId, setpdfButtonId] = useState(0);
  const [viewPdf, setViewPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [downloadingItems, setDownloadingItems] = useState(new Set());
  const [downloadProgress, setDownloadProgress] = useState({});

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource?.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "All" || resource.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (resource: Resource) => {
    Alert.alert("Download", `Download ${resource.title}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Download",
        onPress: async () => {
          const url =
            resource?.type === "ebook"
              ? resource?.file_path
              : resource?.audio_url;
          const name = url?.split("/").pop();
          const itemId = resource.id;

          if (downloadingItems.has(itemId)) return;

          setDownloadingItems((prev) => new Set([...prev, itemId]));

          try {
            const success = await downloadFile(url, name);

            if (success) {
              console.log(`Successfully downloaded: ${name}`);
            }
          } finally {
            setDownloadingItems((prev) => {
              const newSet = new Set(prev);
              newSet.delete(itemId);
              return newSet;
            });
          }

          // startDownload(
          //   itemId,
          //   "https://www.irs.gov/pub/irs-pdf/f1040.pdf",
          //   "f1040.pdf"
          // );
        },
      },
    ]);
  };

  const startDownload = async (itemId, url, name) => {
    // Progress callback
    const onProgress = (progress) => {
      setDownloadProgress((prev) => new Map(prev.set(itemId, progress)));
    };

    try {
      // Try primary method first
      let success = await downloadFile(url, name, onProgress);

      // If primary method fails, try RNFS method
      if (!success) {
        success = await downloadFileWithRNFS(url, name, onProgress);
      }

      // If both fail, try simple browser download
      if (!success) {
        success = await downloadFileSimple(url, name);
      }

      if (success) {
        Alert.alert("Success", `${name} download initiated successfully!`);
      }
    } catch (error) {
      Alert.alert("Download Failed", error.message);
    } finally {
      // Clean up states
      setDownloadingItems((prev) => {
        const newMap = new Map(prev);
        newMap.delete(itemId);
        return newMap;
      });
      setDownloadProgress((prev) => {
        const newMap = new Map(prev);
        newMap.delete(itemId);
        return newMap;
      });
    }
  };

  const handleView = (resource: Resource) => {
    if (resource.type === "ebook") {
      setpdfButtonId(resource.id);
      setPdfUrl(resource.file_path);
      setViewPdf(true);
    } else {
      setPlayButtonId(resource.id);
      playAudio(resource);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "ebook":
        return <FileText size={41} color="#FF6B6B" />;
      case "audio":
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
        {resource.type === "ebook" ? (
          <Text style={styles.viewButtonText}>View</Text>
        ) : isPlaying && playButtonId === resource.id ? (
          <Pause size={16} color="white" />
        ) : (
          <Play size={16} color="white" />
        )}
      </TouchableOpacity>
    );
  };

  const fetchMedia = async () => {
    try {
      const { data } = await axios.get(baseUrl + "/media");

      console.log("media", data);
      setResources(data?.media);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  const playAudio = async (resource: Resource) => {
    try {
      // If clicking on the same item while playing, toggle pause/stop
      if (sound && isPlaying && playButtonId === resource.id) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        return;
      }

      // If another audio is playing, stop and unload it first
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      const { sound: newSound } = await Audio.Sound.createAsync({
        // uri:          resource?.audio_url
        uri: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
      });

      setSound(newSound);
      setPlayButtonId(resource.id); // Update the ID immediately
      await newSound.setVolumeAsync(1.0);
      await newSound.playAsync();
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if ((status as any).didJustFinish) {
          setIsPlaying(false);
          setSound(null);
        }
      });
    } catch (err) {
      console.error("Playback error", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return (
    <View style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ position: "relative" }}>
        <Header title="Resources for free" back={false} />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={24} color="#fff" />
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
        {filteredResources.map((resource, index) => {
          const isDownloading = downloadingItems.has(resource.id);
          return (
            <View key={resource?.title + index} style={styles.resourceItem}>
              <View style={styles.resourceContent}>
                <View style={styles.resourceIcon}>
                  {getResourceIcon(resource?.type)}
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>{resource?.title}</Text>

                  <Text style={styles.resourceDescription}>
                    {resource?.author || ""}
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
                  {isDownloading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.downloadButtonText}>Download</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

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
      <ViewPdf
        url={pdfUrl}
        showPostModal={viewPdf}
        setShowPostModal={setViewPdf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterButton: {
    position: "absolute",
    right: 80,
    top: 24,
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
