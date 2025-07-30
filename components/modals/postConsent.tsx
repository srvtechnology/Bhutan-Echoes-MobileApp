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
import WebView from "react-native-webview";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Props {
  showPostModal: boolean;
  setShowPostModal: (e: any) => void;
  handleConsent: (e: string) => void;
}

const PostConsentModal: React.FC<Props> = ({
  showPostModal,
  setShowPostModal,
  handleConsent,
}) => {
  return (
    <SafeAreaProvider>
      <Modal
        visible={showPostModal}
        animationType="fade"
        presentationStyle="overFullScreen"
        transparent
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalContainer}>
            <View style={styles.commentBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  END USER LICENSE AGREEMENT (EULA)
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPostModal(false)}
                >
                  <X size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.consentContainer}>
                <WebView
                  source={{
                    uri: "https://bhutanechos.srvtechnology.com/public/app-aggrement",
                  }}
                  textZoom={150}
                  style={{ flex: 1, width: "100%", height: "100%" }}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleConsent("N")}
                >
                  <Text style={styles.buttonText}>Not Agreed</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleConsent("Y")}
                >
                  <Text style={styles.buttonText}>Agreed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 15,
    position: "relative",
  },
  commentBox: { paddingBottom: 20, backgroundColor: "#fff" },
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
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "interMedium",
    color: "#000",
    marginHorizontal: 30,
    textAlign: "center",
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
    top: 6,
  },
  consentContainer: {
    padding: 20,
    position: "relative",
    height: 300,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  button: {
    backgroundColor: "#48732C",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "interMedium",
  },
});

export default PostConsentModal;
