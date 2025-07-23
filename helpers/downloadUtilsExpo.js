import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";

// Request permissions
const requestPermissions = async () => {
  try {
    if (Platform.OS === "android") {
      // For Android, request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Storage access is needed to save files"
        );
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Permission error:", error);
    return false;
  }
};

// Get file information
const getFileInfo = (url) => {
  const fileName = url.split("/").pop() || "file";
  const extension = fileName.split(".").pop()?.toLowerCase();

  return {
    fileName,
    extension,
    mimeType: getMimeType(extension),
  };
};

// Get MIME type
const getMimeType = (extension) => {
  const mimeTypes = {
    pdf: "application/pdf",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    aac: "audio/aac",
    ogg: "audio/ogg",
    mp4: "video/mp4",
    mov: "video/quicktime",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
  };
  return mimeTypes[extension] || "application/octet-stream";
};

// Main download function
export const downloadFile = async (fileUrl, customFileName = null) => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return false;
    }

    const fileInfo = getFileInfo(fileUrl);
    const fileName = customFileName || fileInfo.fileName;

    // Alert.alert("Download Started", `Downloading ${fileName}...`);

    // Download to cache first
    const tempPath = `${FileSystem.cacheDirectory}${fileName}`;
    const downloadResult = await FileSystem.downloadAsync(fileUrl, tempPath);

    if (downloadResult.status !== 200) {
      throw new Error(`Download failed with status: ${downloadResult.status}`);
    }

    console.log("File downloaded to temp:", downloadResult.uri);

    // Save to accessible location based on platform
    if (Platform.OS === "android") {
      await saveToAndroidDownloads(downloadResult.uri, fileName, fileInfo);
    } else {
      await saveToIOSDocuments(downloadResult.uri, fileName, fileInfo);
    }

    return true;
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert(
      "Download Failed",
      error.message || "An error occurred while downloading the file"
    );
    return false;
  }
};

// Save to Android Downloads folder
const saveToAndroidDownloads = async (tempUri, fileName, fileInfo) => {
  try {
    // Method 1: Use MediaLibrary to save to Downloads (works for most file types)
    const asset = await MediaLibrary.createAssetAsync(tempUri);

    // Try to create/get Downloads album
    let album = await MediaLibrary.getAlbumAsync("Downloads");
    if (!album) {
      album = await MediaLibrary.createAlbumAsync("Downloads", asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    Alert.alert(
      "Download Complete!",
      `${fileName} saved to Downloads folder.\nYou can find it in Files > Downloads`,
      [
        { text: "OK", style: "default" },
        {
          text: "Open Downloads",
          onPress: () => openDownloadsFolder(),
          style: "default",
        },
      ]
    );
  } catch (error) {
    console.log("MediaLibrary method failed, trying sharing...", error);

    // Fallback: Use sharing dialog to save to Downloads
    try {
      await Sharing.shareAsync(tempUri, {
        dialogTitle: `Save ${fileName}`,
        mimeType: fileInfo.mimeType,
      });
    } catch (shareError) {
      if (shareError.message !== "User did not share") {
        throw shareError;
      }
      Alert.alert("Download Complete", `${fileName} downloaded successfully`);
    }
  }
};

// Save to iOS Documents
const saveToIOSDocuments = async (tempUri, fileName, fileInfo) => {
  try {
    // For iOS, use sharing which allows saving to Files app
    await Sharing.shareAsync(tempUri, {
      dialogTitle: `Save ${fileName} to Files`,
      mimeType: fileInfo.mimeType,
    });

    Alert.alert(
      "Download Complete!",
      `${fileName} is ready to save.\n\nTip: Choose "Save to Files" > "On My iPhone/iPad" > "Downloads" for easy access.`,
      [{ text: "OK", style: "default" }]
    );
  } catch (error) {
    if (error.message === "User did not share") {
      Alert.alert("Download Complete", `${fileName} downloaded successfully`);
    } else {
      throw error;
    }
  }
};

// Open Downloads folder on Android
const openDownloadsFolder = async () => {
  if (Platform.OS === "android") {
    try {
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: "content://com.android.providers.downloads.documents/root/downloads",
        type: "resource/folder",
      });
    } catch (error) {
      // Fallback: Open file manager
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: "content://com.android.externalstorage.documents/root/primary",
          type: "resource/folder",
        });
      } catch (fallbackError) {
        Alert.alert(
          "Info",
          "Please check your Downloads folder in the Files app"
        );
      }
    }
  }
};

// Enhanced download with progress
export const downloadFileWithProgress = async (
  fileUrl,
  customFileName = null,
  onProgress = null
) => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return false;

    const fileInfo = getFileInfo(fileUrl);
    const fileName = customFileName || fileInfo.fileName;
    const tempPath = `${FileSystem.cacheDirectory}${fileName}`;

    Alert.alert("Download Started", `Downloading ${fileName}...`);

    // Create download resumable for progress tracking
    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      tempPath,
      {},
      (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        if (onProgress) {
          onProgress(Math.floor(progress * 100));
        }
      }
    );

    const downloadResult = await downloadResumable.downloadAsync();

    if (!downloadResult) {
      throw new Error("Download was cancelled or failed");
    }

    console.log("File downloaded to temp:", downloadResult.uri);

    // Save to accessible location
    if (Platform.OS === "android") {
      await saveToAndroidDownloads(downloadResult.uri, fileName, fileInfo);
    } else {
      await saveToIOSDocuments(downloadResult.uri, fileName, fileInfo);
    }

    return true;
  } catch (error) {
    console.error("Download with progress error:", error);
    Alert.alert(
      "Download Failed",
      error.message || "An error occurred while downloading the file"
    );
    return false;
  }
};

// Simple method that directly uses system download manager (Android only)
export const downloadWithSystemManager = async (
  fileUrl,
  customFileName = null
) => {
  if (Platform.OS !== "android") {
    Alert.alert(
      "Not Available",
      "System download manager is only available on Android"
    );
    return false;
  }

  try {
    const fileInfo = getFileInfo(fileUrl);
    const fileName = customFileName || fileInfo.fileName;

    // Use Android's built-in download manager via Intent
    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: fileUrl,
      flags: 1,
    });

    Alert.alert(
      "Download Started",
      `${fileName} download started using system download manager. Check your notification panel.`
    );

    return true;
  } catch (error) {
    console.error("System download error:", error);
    Alert.alert("Download Failed", "Could not start system download");
    return false;
  }
};

// Check if file exists in Downloads
export const checkFileInDownloads = async (fileName) => {
  try {
    if (Platform.OS === "android") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") return false;

      const assets = await MediaLibrary.getAssetsAsync({
        first: 1000,
        mediaType: MediaLibrary.MediaType.unknown,
        album: "Downloads",
      });

      return assets.assets.some((asset) => asset.filename === fileName);
    }
    return false; // For iOS, can't easily check Files app
  } catch (error) {
    console.error("Check file error:", error);
    return false;
  }
};

// Get download location info
export const getDownloadLocationInfo = () => {
  if (Platform.OS === "android") {
    return {
      location: "Downloads folder",
      path: "Files app > Downloads",
      accessible: true,
    };
  } else {
    return {
      location: "Files app - On My iPhone/iPad",
      path: "Files app > On My iPhone/iPad > Downloads",
      accessible: true,
    };
  }
};
