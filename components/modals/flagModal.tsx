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
import { X } from "lucide-react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
  showPostModal: boolean;
  setShowPostModal: (e: any) => void;
  onFlagSubmit: (reason: string, details: string) => void;
}

const FlagModal: React.FC<Props> = ({
  showPostModal,
  setShowPostModal,
  onFlagSubmit,
}) => {
  const [flagText, setFlagText] = useState("");
  const [flagDetails, setFlagDetails] = useState("");

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
            <View style={styles.modalContainer}>
              <View style={styles.commentBox}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Report User</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowPostModal(false)}
                  >
                    <X size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.usernameContainer}>
                  <Text style={styles.username}>
                    Are you sure? You want to report this user?
                  </Text>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                  <Text style={styles.inputHeading}>Provide Reason</Text>
                  <TextInput
                    style={styles.postInput}
                    placeholder="Write something!"
                    placeholderTextColor={"#888"}
                    value={flagText}
                    onChangeText={setFlagText}
                  />
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                  <Text style={styles.inputHeading}>Details</Text>
                  <TextInput
                    style={styles.postInput}
                    placeholder="Write something!"
                    placeholderTextColor={"#888"}
                    value={flagDetails}
                    onChangeText={setFlagDetails}
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[
                      styles.postButton,
                      flagText.length > 0 && styles.postButtonActive,
                    ]}
                    onPress={() => onFlagSubmit(flagText, flagDetails)}
                  >
                    <Text
                      style={[
                        styles.postButtonText,
                        flagText.length > 0 && styles.postButtonTextActive,
                      ]}
                    >
                      Okay
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
  usernameContainer: {
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  username: {
    fontSize: 17,
    fontFamily: "interMedium",
    color: "#000",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 15,
  },
  commentBox: {
    backgroundColor: "#fff",
    paddingBottom: 30,
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
  inputHeading: {
    fontSize: 12,
    fontFamily: "interMedium",
    color: "#000",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  postInput: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    fontSize: 14,
    color: "#000",
    fontFamily: "inter",
    backgroundColor: "#eee",
    // height: 40,
    borderRadius: 8,
  },
  modalActions: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
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

export default FlagModal;
