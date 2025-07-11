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
  score: any;
}

const QuizResult: React.FC<Props> = ({
  showPostModal,
  setShowPostModal,
  score,
}) => {
  return (
    <Modal
      visible={showPostModal}
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent
    >
      <View style={styles.modalContainer}>
        <View style={styles.commentBox}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPostModal(false)}
          >
            <X size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.resultContainer}>
            <Image
              source={require("@/assets/images/result.png")}
              resizeMode="contain"
              style={styles.resultImage}
            />
            <Image
              source={require("@/assets/images/stars.png")}
              resizeMode="contain"
              style={styles.starsImage}
            />
            <Text style={styles.ressultTitle}>Cogratulations</Text>
            <Text style={styles.ressultSubTitle}>
              {score.score === 0
                ? "Oops!!"
                : "You did a great job in the quiz!"}
            </Text>
            <View style={styles.border} />
            <View style={styles.scoreContainer}>
              <View style={styles.scoreSubContainer}>
                <Text style={styles.scoreTitle}>Marks Obtained</Text>
                <Text style={styles.score}>{score.score}</Text>
              </View>
              <View style={styles.scoreSubContainer}>
                <Text style={styles.scoreTitle}>Right Answers</Text>
                <Text style={styles.score}>{score.correct}</Text>
              </View>
              <View style={styles.scoreSubContainer}>
                <Text style={styles.scoreTitle}>Wrong Answers</Text>
                <Text style={styles.score}>{score.wrong}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 15,
    position: "relative",
  },
  commentBox: { paddingBottom: 50, paddingTop: 20, backgroundColor: "#fff" },
  closeButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#48732C",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: 10,
  },
  resultContainer: {
    alignItems: "center",
    position: "relative",
  },
  resultImage: { height: 90, width: 90 },
  starsImage: {
    position: "absolute",
    right: 25,
    top: 50,
    height: 90,
  },
  ressultTitle: {
    fontSize: 22,
    fontFamily: "interBold",
    marginTop: 4,
    color: "#000",
  },
  ressultSubTitle: {
    fontSize: 14,
    fontFamily: "interMedium",
    marginTop: 4,
    color: "#555",
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: "#cecece",
    marginTop: 30,
    width: "92%",
    marginBottom: 12,
    marginHorizontal: 70,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreSubContainer: {
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#cecece",
    paddingHorizontal: 10,
  },
  scoreTitle: {
    fontSize: 12,
    fontFamily: "interMedium",
    color: "#000",
  },
  score: {
    fontSize: 14,
    fontFamily: "inter",
    color: "#000",
  },
});

export default QuizResult;
