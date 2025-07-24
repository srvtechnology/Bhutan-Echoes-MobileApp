/** @format */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Paperclip, User, X } from "lucide-react-native";
import { Video } from "expo-av";
import Toast from "react-native-toast-message";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

interface Props {
  showPostModal: boolean;
  setShowPostModal: (e: any) => void;
  onPostCreated: (post: any) => void;
  user: any;
}

const AddPost: React.FC<Props> = ({
  showPostModal,
  setShowPostModal,
  onPostCreated,
  user,
}) => {
  const [postText, setPostText] = useState("");
  const [attachment, setAttachment] = useState<{
    uri: string;
    type: string;
    name: string;
    fileType: string;
  } | null>(null);

  const pickAttachment = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // allows image + video
      allowsEditing: true,
      quality: 1,
    });

    console.log("result", result);

    if (!result.cancelled) {
      const fileSize = result.assets[0].fileSize;
      const fileSizeInMB = fileSize / (1024 * 1024);

      if (fileSizeInMB > 10) {
        Toast.show({
          type: "error",
          text1: "File size exceeds 10MB limit.",
        });
        return;
      }
      setAttachment({
        uri: result.assets[0].uri,
        fileType: result.assets[0].type || "image",
        type: result.assets[0].mimeType || "image/jpeg",
        name: result.assets[0].fileName || "image.jpg",
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
                  {user.user_image ? (
                    <Image
                      source={{ uri: user.user_image }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <User size={20} color={"#444"} />
                  )}
                </View>
                <Text style={styles.username}>{user.name}</Text>
              </View>

              <TextInput
                style={styles.postInput}
                placeholder="Write something! (Like Poems, Photos, Story...)"
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
                      style={{ width: "100%", height: 160, marginVertical: 10 }}
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
