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
import { Paperclip, X } from "lucide-react-native";
import { Video } from "expo-av";

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
  } | null>(null);

  const pickAttachment = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // allows image + video
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setAttachment({
        uri: result.assets[0].uri,
        type: result.assets[0].type || "image",
      });
    }
  };

  const handlePost = async () => {
    if (!postText && !attachment) return;

    const newPost = {
      id: Date.now().toString(),
      text: postText,
      attachment,
    };

    // Here you'd call your API
    console.log("Posting:", newPost);

    onPostCreated(newPost);
    setPostText("");
    setAttachment(null);
    setShowPostModal(false);
  };

  return (
    <Modal
      visible={showPostModal}
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent
    >
      <View style={styles.modalContainer}>
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
              <Image
                source={require("../../assets/icons/camera.png")}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.username}>Tshering</Text>
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
            <View style={{ alignItems: "center" }}>
              {attachment.type === "image" ? (
                <Image
                  source={{ uri: attachment.uri }}
                  style={{ width: '100%', height: '100%' }}
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
                (postText.length > 0 || attachment) && styles.postButtonActive,
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
  );
};

const styles = StyleSheet.create({
  // same styles as before
  avatar: {
    width: 41,
    height: 41,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 15,
  },
  commentBox: { height: 400, backgroundColor: "#fff" },
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
    flex: 1,
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
