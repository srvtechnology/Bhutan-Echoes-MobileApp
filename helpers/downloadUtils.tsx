import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";
import { Platform, Alert, PermissionsAndroid, Linking } from "react-native";
import RNFS from "react-native-fs";

// Request permissions for Android
const requestStoragePermission = async () => {
  if (Platform.OS === "android") {
    try {
      if (Platform.Version >= 33) {
        // For Android 13+ (API 33+), we don't need WRITE_EXTERNAL_STORAGE
        return true;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "This app needs access to your storage to download files",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

// Get file information
const getFileInfo = (url, customName = null) => {
  const urlParts = url.split("/");
  const fileName =
    customName || urlParts[urlParts.length - 1] || "downloaded_file";
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const audioExtensions = ["mp3", "wav", "m4a", "aac", "ogg", "flac", "wma"];
  const isAudio = audioExtensions.includes(extension);
  const isPdf = extension === "pdf";

  return {
    fileName,
    extension,
    isAudio,
    isPdf,
    mimeType: getMimeType(extension),
  };
};

const getMimeType = (extension) => {
  const mimeTypes = {
    pdf: "application/pdf",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    aac: "audio/aac",
    ogg: "audio/ogg",
    flac: "audio/flac",
    wma: "audio/x-ms-wma",
  };
  return mimeTypes[extension] || "application/octet-stream";
};

// Alternative download function that avoids broadcast receiver issues
export const downloadFile = async (
  fileUrl,
  customFileName = null,
  onProgress = null
) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Storage permission is required to download files"
      );
      return false;
    }

    const fileInfo = getFileInfo(fileUrl, customFileName);
    const { fileName, mimeType } = fileInfo;

    Alert.alert("Download Started", `Downloading ${fileName}...`);

    if (Platform.OS === "android") {
      return await downloadFileAndroidSafe(
        fileUrl,
        fileName,
        mimeType,
        onProgress
      );
    } else {
      return await downloadFileIOS(fileUrl, fileName, mimeType, onProgress);
    }
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert(
      "Download Failed",
      error.message || "An error occurred during download"
    );
    return false;
  }
};

// Safe Android download that avoids broadcast receiver issues
const downloadFileAndroidSafe = async (
  fileUrl,
  fileName,
  mimeType,
  onProgress
) => {
  console.log("downloadFileAndroidSafe called");

  try {
    fileUrl =
      "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3";
    // fileUrl = "https://www.irs.gov/pub/irs-pdf/f1040.pdf";

    fileName = "Kalimba.mp3";
    // fileName = "f1040.pdf";
    const { config, fs } = RNFetchBlob;

    // Use internal storage path to avoid permission issues
    const downloadPath = `${fs.dirs.DownloadDir}/${fileName}`;

    // Simple download configuration without using Android Download Manager
    const configOptions = {
      fileCache: true,
      path: downloadPath,
      // Don't use addAndroidDownloads to avoid broadcast receiver issues
    };
    console.log("configOptions", configOptions);

    const task = config(configOptions).fetch("GET", fileUrl);

    if (onProgress) {
      task.progress((received, total) => {
        const progress = (received / total) * 100;
        onProgress(Math.floor(progress));
      });
    }

    const response = await task;
    const filePath = response.path();

    // Verify file exists
    const fileExists = await RNFS.exists(filePath);
    if (!fileExists) {
      throw new Error("File was not saved properly");
    }

    // Use Share to let user save the file to their preferred location
    const shareOptions = {
      title: "Save File",
      url: `file://${filePath}`,
      type: mimeType,
      filename: fileName,
    };

    await Share.open(shareOptions);

    Alert.alert("Download Complete", `${fileName} is ready to be saved`);
    return true;
  } catch (error) {
    if (error.message === "User did not share") {
      Alert.alert("Download Complete", "File downloaded successfully");
      return true;
    }
    console.error("Android download error:", error);
    throw error;
  }
};

// iOS download implementation (unchanged)
const downloadFileIOS = async (fileUrl, fileName, mimeType, onProgress) => {
  try {
    const { config, fs } = RNFetchBlob;
    const documentsPath = fs.dirs.DocumentDir;
    const downloadPath = `${documentsPath}/${fileName}`;

    const configOptions = {
      fileCache: true,
      path: downloadPath,
    };

    const task = config(configOptions).fetch("GET", fileUrl);

    if (onProgress) {
      task.progress((received, total) => {
        const progress = (received / total) * 100;
        onProgress(Math.floor(progress));
      });
    }

    const response = await task;
    const filePath = response.path();

    const shareOptions = {
      title: "Save File",
      url: `file://${filePath}`,
      type: mimeType,
      filename: fileName,
    };

    await Share.open(shareOptions);

    Alert.alert(
      "Download Complete",
      `${fileName} is ready to be saved to your preferred location`
    );
    return true;
  } catch (error) {
    if (error.message === "User did not share") {
      Alert.alert("Download Complete", "File downloaded but not saved");
      return true;
    }
    console.error("iOS download error:", error);
    throw error;
  }
};

// Alternative method using RNFS (React Native File System)
export const downloadFileWithRNFS = async (
  fileUrl,
  customFileName = null,
  onProgress = null
) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Storage permission is required to download files"
      );
      return false;
    }

    const fileInfo = getFileInfo(fileUrl, customFileName);
    const { fileName, mimeType } = fileInfo;

    Alert.alert("Download Started", `Downloading ${fileName}...`);

    // Create download path
    const downloadPath =
      Platform.OS === "ios"
        ? `${RNFS.DocumentDirectoryPath}/${fileName}`
        : `${RNFS.DownloadDirectoryPath}/${fileName}`;

    // Download options
    const options = {
      fromUrl: fileUrl,
      toFile: downloadPath,
      progress: onProgress
        ? (res) => {
            const progress = (res.bytesWritten / res.contentLength) * 100;
            onProgress(Math.floor(progress));
          }
        : undefined,
    };

    // Start download
    const result = await RNFS.downloadFile(options).promise;

    if (result.statusCode === 200) {
      // Use Share to let user save the file
      const shareOptions = {
        title: "Save File",
        url: Platform.OS === "ios" ? downloadPath : `file://${downloadPath}`,
        type: mimeType,
        filename: fileName,
      };

      try {
        await Share.open(shareOptions);
        Alert.alert("Download Complete", `${fileName} is ready to be saved`);
      } catch (shareError) {
        if (shareError.message !== "User did not share") {
          console.error("Share error:", shareError);
        }
        Alert.alert("Download Complete", `${fileName} downloaded successfully`);
      }

      return true;
    } else {
      throw new Error(`Download failed with status code: ${result.statusCode}`);
    }
  } catch (error) {
    console.error("RNFS download error:", error);
    Alert.alert(
      "Download Failed",
      error.message || "An error occurred during download"
    );
    return false;
  }
};

// Fallback download method
export const downloadFileSimple = async (fileUrl, customFileName = null) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Storage permission is required to download files"
      );
      return false;
    }

    const fileInfo = getFileInfo(fileUrl, customFileName);
    const { fileName } = fileInfo;

    // Simply open the URL in browser for download
    const supported = await Linking.canOpenURL(fileUrl);
    if (supported) {
      await Linking.openURL(fileUrl);
      Alert.alert(
        "Download Started",
        `${fileName} download has been initiated in your browser`
      );
      return true;
    } else {
      throw new Error("Cannot open download URL");
    }
  } catch (error) {
    console.error("Simple download error:", error);
    Alert.alert("Download Failed", "Could not initiate download");
    return false;
  }
};
