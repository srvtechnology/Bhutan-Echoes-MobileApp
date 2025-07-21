import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  PermissionsAndroid,
} from "react-native";
import {
  Search,
  Filter,
  Bell,
  Download,
  Play,
  FileText,
  Volume2,
} from "lucide-react-native";
import RNFS from "react-native-fs";
import Header from "@/components/header";
import ResourceFilter from "@/components/modals/resourceFilter";
import axios from "axios";
import { baseUrl } from "@/config";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import * as MediaLibrary from "expo-media-library";
import Share from "react-native-share";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFetchBlob from "rn-fetch-blob";

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
  const [hasPermission, setHasPermission] = useState(false);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource?.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "All" || resource.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });
  // Request permission (Android only)

  const checkStoragePermission = async () => {
    if (Platform.OS === "android") {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      console.log("==== result=====", result);

      if (!result) {
        const resultRequest = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        console.log("==== resultRequest=====", resultRequest);

        if (resultRequest === "never_ask_again") {
          Alert.alert(
            "Permission Needed",
            "Storage permission is required to download files. Please enable it in settings.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => openSettings(),
              },
            ]
          );
          setHasPermission(false);
        } else if (resultRequest === "granted") {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } else {
        setHasPermission(true);
      }
    } else {
      const result = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
      setHasPermission(result === RESULTS.GRANTED);
    }
  };

  const shareFileiOS = async (filePath: string) => {
    try {
      await Share.open({
        url: `file://${filePath}`,
        type: "*/*",
        showAppsToView: true,
      });
    } catch (e) {
      console.log("Share cancelled");
    }
  };
  const getDownloadPath = async (fileName: string): Promise<string> => {
    if (Platform.OS === "android") {
      const folderPath = `${RNFS.DownloadDirectoryPath}/BhutanEchoes`;
      const exists = await RNFS.exists(folderPath);
      if (!exists) {
        await RNFS.mkdir(folderPath);
      }
      return `${folderPath}/${fileName}`;
    } else {
      const folderPath = `${RNFS.DocumentDirectoryPath}/BhutanEchoes`;
      const exists = await RNFS.exists(folderPath);
      if (!exists) {
        await RNFS.mkdir(folderPath);
      }
      return `${folderPath}/${fileName}`;
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      console.log("result", result);

      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const checkPermission = async (url: string, name: string) => {
    const perm =
      Platform.OS === "android" && Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_AUDIO
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

    let status = await check(perm);

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        "Permission blocked",
        "You must allow storage permission in Settings",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Settings", onPress: () => openSettings() },
        ]
      );
      return false;
    }

    if (status === RESULTS.DENIED) {
      status = await request(perm);
    }

    if (status === RESULTS.GRANTED) {
      actualDownload(url, name);
    }
    return false;
  };

  const actualDownload = async (url: string, name: string) => {
    const { dirs } = RNFetchBlob.fs;
    console.log("dirs", dirs);

    const dirToSave =
      Platform.OS === "ios" ? dirs.DocumentDir : dirs.DownloadDir;
    console.log("dirToSave", dirToSave);

    const configfb = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: name,
        path: `${dirs.DownloadDir}/${name}`,
      },
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: name,
      path: `${dirToSave}/${name}`,
    };
    const configOptions = Platform.select({
      ios: configfb,
      android: configfb,
    });

    console.log("configOptions", configOptions);

    try {
      await RNFetchBlob.config(configOptions || {})
        .fetch("GET", url, {})
        .then((res) => {
          if (Platform.OS === "ios") {
            RNFetchBlob.fs.writeFile(configfb.path, res.data, "base64");
            RNFetchBlob.ios.previewDocument(configfb.path);
          }
          if (Platform.OS === "android") {
            console.log("file downloaded");
          }
        })
        .catch((e) => {
          console.log("invoice Download==>", e);
        });
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  const getPermission = async (url: string, name: string) => {
    if (Platform.OS === "ios") {
      actualDownload(url, name);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        console.log("granted ====", granted);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          actualDownload(url, name);
        } else {
          console.log("please grant permission");
        }
      } catch (err) {
        console.log("permission error", err);
      }
    }
  };

  // useEffect(() => {
  //   checkStoragePermission();
  // }, []);

  const downloadFile = async (fileUrl: string, fileName: string) => {
    // requestStoragePermission();
    // const canDownload = await checkStoragePermission();
    // if (!canDownload) {
    //   Alert.alert("Permission denied");
    //   return;
    // }
    try {
      // if (Platform.OS === "android") {
      //   const hasPermission = await requestStoragePermission();
      //   console.log("hasPermission", hasPermission);

      //   if (!hasPermission) {
      //     Alert.alert(
      //       "Permission denied",
      //       "Cannot download without permission."
      //     );
      //     return;
      //   }
      // }

      const path = await getDownloadPath(fileName);
      const token = await AsyncStorage.getItem("token");
      const options = {
        fromUrl: fileUrl,
        toFile: `${path}/file.pdf`,
        headers: {
          Authorization: `Bearer ${token}`, // or custom header key
        },
      };
      console.log("options", options);

      const download = RNFS.downloadFile(options);
      console.log("Download Result:", download);

      const { statusCode } = await download.promise;

      if (statusCode === 200) {
        Alert.alert("✅ Download Complete", "File saved successfully!");

        if (Platform.OS === "ios") {
          await Share.open({
            url: `file://${path}`,
            title: "Share File",
          });
        }
      } else {
        Alert.alert("❌ Download Failed", `Status code: ${statusCode}`);
      }

      // const downloadPath =
      //   Platform.OS === "android"
      //     ? `${RNFS.DownloadDirectoryPath}/${fileName}`
      //     : `${RNFS.DocumentDirectoryPath}/${fileName}`; // iOS sandbox

      // const options = {
      //   fromUrl: fileUrl,
      //   toFile: downloadPath,
      //   background: true,
      //   discretionary: true,
      // };
      // try {
      //   if (Platform.OS === "ios") {
      //     shareFileiOS(downloadPath);
      //   }
      //   const res = await RNFS.downloadFile(options).promise;
      //   if (res.statusCode === 200) {
      //     Alert.alert(
      //       "Download complete",
      //       `File saved to ${
      //         Platform.OS === "android"
      //           ? "Downloads folder"
      //           : "Files > App folder"
      //       }`
      //     );
      //   } else {
      //     Alert.alert("Download failed", `Status code: ${res.statusCode}`);
      //   }

      console.log("✅ File downloaded to:", path);
      Toast.show({
        type: "success",
        text1: "Download successful.",
      });
    } catch (error) {
      console.error("❌ Download error:", error);
      Toast.show({
        type: "error",
        text1: "Download failed.",
      });
    }
  };

  const handleDownload = (resource: Resource) => {
    Alert.alert("Download", `Download ${resource.title}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Download",
        onPress: () => {
          const url =
            resource?.type === "ebook"
              ? resource?.file_path
              : resource?.audio_url;
          const name = url?.split("/").pop();

          console.log("name", name);

          // downloadFile(url, name);
          // getPermission(url, name);
          checkPermission(url, name);
        },
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
        {filteredResources.map((resource) => (
          <View key={resource?.id} style={styles.resourceItem}>
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
