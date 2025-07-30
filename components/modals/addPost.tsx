/** @format */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Paperclip, User, X } from "lucide-react-native";
import { Video } from "expo-av";
import Toast from "react-native-toast-message";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImageManipulator from "expo-image-manipulator";

interface Props {
  showPostModal: boolean;
  setShowPostModal: (e: any) => void;
  onPostCreated: (post: any) => void;
}

const AddPost: React.FC<Props> = ({
  showPostModal,
  setShowPostModal,
  onPostCreated,
}) => {
  const [postText, setPostText] = useState("");
  const [attachment, setAttachment] = useState<{
    uri: string;
    type: string;
    name: string;
    fileType: string;
  } | null>(null);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      console.log("user", user);

      setUser(JSON.parse(user));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const cropToAspectRatio = async (imageAsset, [aspectX, aspectY]) => {
    try {
      const { width, height, uri } = imageAsset;
      const targetAspect = aspectX / aspectY;
      const currentAspect = width / height;

      let cropWidth, cropHeight, originX, originY;

      if (currentAspect > targetAspect) {
        // Image is wider than target aspect
        cropHeight = height;
        cropWidth = height * targetAspect;
        originX = (width - cropWidth) / 2;
        originY = 0;
      } else {
        // Image is taller than target aspect
        cropWidth = width;
        cropHeight = width / targetAspect;
        originX = 0;
        originY = (height - cropHeight) / 2;
      }

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX,
              originY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return {
        ...imageAsset,
        ...manipulatedImage,
      };
    } catch (error) {
      console.error("Error cropping to aspect ratio:", error);
      return imageAsset;
    }
  };

  const pickAttachment = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // allows image + video
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });

    // console.log("result:", result);

    if (!result.cancelled) {
      let finalImage = result.assets[0];

      const fileSize = finalImage.fileSize || 0;
      const fileSizeInMB = fileSize / (1024 * 1024);

      if (fileSizeInMB > 10) {
        Toast.show({
          type: "error",
          text1: "File size exceeds 10MB limit.",
        });
        return;
      }
      if (Platform.OS === "ios") {
        finalImage = await cropToAspectRatio(finalImage, [1, 1]);
      }
      setAttachment({
        uri: finalImage.uri,
        fileType: finalImage.type || "image",
        type: finalImage.mimeType || "image/jpeg",
        name: finalImage.fileName || "image.jpg",
      });
    }
  };

  const handlePost = async () => {
    if (!postText && !attachment) {
      Toast.show({
        type: "error",
        text1: "Please write a post or attach a media.",
      });
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      text: postText,
      attachment,
    };

    // Here you'd call your API
    // console.log("Posting:", newPost);

    if (
      (attachment?.type === "video" || attachment?.type === "image") &&
      !postText
    ) {
      Toast.show({
        type: "error",
        text1: "Please write a description.",
      });
      return;
    }
    onPostCreated(newPost);
    setPostText("");
    setAttachment(null);
    setShowPostModal(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          visible={showPostModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setShowPostModal(!showPostModal);
          }}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.centeredView}>
              <View style={styles.commentBox}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Post Your Love</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowPostModal(false)}
                  >
                    <X size={18} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalUserInfo}>
                  <View style={styles.avatar}>
                    {user?.user_image ? (
                      <Image
                        source={{ uri: user?.user_image }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <User size={20} color={"#444"} />
                    )}
                  </View>
                  <Text style={styles.username}>{user?.name}</Text>
                </View>

                <TextInput
                  style={styles.postInput}
                  placeholder="Write something! (Like Poems, Photos, Story...)"
                  placeholderTextColor={"#888"}
                  multiline
                  value={postText}
                  onChangeText={setPostText}
                  textAlignVertical="top"
                />

                {attachment && (
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    {attachment.fileType === "image" ? (
                      <Image
                        source={{ uri: attachment.uri }}
                        style={{
                          width: "100%",
                          height: 160,
                          marginVertical: 10,
                        }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Video
                        source={{ uri: attachment.uri }}
                        style={styles.postVideo}
                        useNativeControls
                        resizeMode="contain"
                        shouldPlay={false}
                      />
                    )}
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.attachButton}
                    onPress={pickAttachment}
                  >
                    <Paperclip size={24} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.postButton,
                      (postText.length > 0 || attachment) &&
                        styles.postButtonActive,
                    ]}
                    onPress={handlePost}
                  >
                    <Text
                      style={[
                        styles.postButtonText,
                        (postText.length > 0 || attachment) &&
                          styles.postButtonTextActive,
                      ]}
                    >
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
  },
  commentBox: { width: "100%", backgroundColor: "#fff" },
  avatar: {
    width: 31,
    height: 31,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#e0e0e0",
    marginLeft: 20,
  },
  avatarImage: { height: 41, width: 41, borderRadius: 22 },
  username: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "interBold",
    color: "#000",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: "relative",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "interMedium",
    color: "#000",
  },
  modalUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  closeButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#48732C",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
  },
  postInput: {
    paddingHorizontal: 20,
    paddingTop: 10,
    fontSize: 14,
    color: "#000",
    fontFamily: "inter",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  attachButton: { padding: 10 },
  postButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  postButtonActive: { backgroundColor: "#48732C" },
  postButtonText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "interMedium",
  },
  postButtonTextActive: { color: "white" },
  postVideo: {
    width: "100%",
    height: 200,
  },
});

export default AddPost;
