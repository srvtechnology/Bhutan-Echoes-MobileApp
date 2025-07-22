/** @format */

import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Pdf from "react-native-pdf";

interface Props {
  showPostModal: boolean;
  setShowPostModal: (e: any) => void;
  url: string;
}

const ViewPdf: React.FC<Props> = ({ showPostModal, setShowPostModal, url }) => {
  const [postText, setPostText] = useState("");
  const [attachment, setAttachment] = useState<{
    uri: string;
    type: string;
    name: string;
    fileType: string;
  } | null>(null);

  return (
    <Modal
      visible={showPostModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        setShowPostModal(!showPostModal);
      }}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.centeredView}>
          <View style={styles.commentBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post Your Loveeee</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPostModal(false)}
              >
                <X size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View
              style={
                {
                  // padding: 20,
                }
              }
            >
              <Pdf
                trustAllCerts={false}
                source={{
                  uri: url,
                  cache: true,
                }}
                style={{
                  height: "95%",
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`number of pages: ${numberOfPages}`);
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    // padding: 15,
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

export default ViewPdf;
