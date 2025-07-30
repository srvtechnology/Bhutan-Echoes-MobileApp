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
import React, { useEffect, useState } from "react";
import { User, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
  showPostModal: boolean;
  setShowPostModal: (e: any) => void;
  onSubmitQuestion: (post: any) => void;
  // user: any;
}

const AddQuestion: React.FC<Props> = ({
  showPostModal,
  setShowPostModal,
  onSubmitQuestion,
  // user,
}) => {
  const [postText, setPostText] = useState("");
  const [user, setUser] = useState(null);

  const handlePost = async () => {
    if (!postText) return;

    const newPost = {
      id: Date.now().toString(),
      question: postText,
    };

    onSubmitQuestion(newPost);
    setPostText("");
    setShowPostModal(false);
  };

  const fetchUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      setUser(JSON.parse(user));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
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
        <View style={styles.modalContainer}>
          <View style={styles.commentBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post Your Questions</Text>
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
                  <User size={20} color={"#888"} />
                )}
              </View>
              <Text style={styles.username}>{user?.name}</Text>
            </View>

            <TextInput
              style={styles.postInput}
              placeholder="Post your question"
              placeholderTextColor={"#888"}
              multiline
              value={postText}
              onChangeText={setPostText}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.postButton,
                  postText.length > 0 && styles.postButtonActive,
                ]}
                onPress={handlePost}
              >
                <Text
                  style={[
                    styles.postButtonText,
                    postText.length > 0 && styles.postButtonTextActive,
                  ]}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
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
  avatar: {
    width: 41,
    height: 41,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#dddddd",
    marginLeft: 20,
  },
  avatarText: {
    color: "#444",
    fontSize: 18,
    fontFamily: "inter",
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
  commentBox: { height: 300, backgroundColor: "#fff" },
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
    justifyContent: "center",
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

export default AddQuestion;
