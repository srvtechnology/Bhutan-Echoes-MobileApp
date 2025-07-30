import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import Toast from "react-native-toast-message";
import { baseUrl } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/helpers/axiosInstance";

interface QuizSectionProps {
  question: any[];
  qusNo: string;
}

export default function QuizSectionMajesty({
  question,
  qusNo,
}: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [result, setResult] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionIndex,
    }));
  };
  const submitAnswer = async (
    liveQuizId: string | number,
    questionId: string | number,
    answerId: string | number
  ) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(
        "quesion answer id",
        token,
        questionId,
        answerId,
        `${baseUrl}/live-quizzes/${liveQuizId}/questions/${questionId}/answer `
      );

      const { data } = await axiosInstance.post(
        `${baseUrl}/live-quizzes/1/questions/${questionId}/answer `,
        { selected_answer_id: answerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("submit answer call", data);

      Toast.show({
        type: "success",
        text1: data.message,
      });
      // onQuizComplete?.({
      //   total: questions.length,
      //   correct: data.user_right,
      //   wrong: data.user_wrong,
      // });
    } catch (error) {
      console.log("submit answer error", error);

      Toast.show({
        type: "error",
        text1: "Error submitting answer",
        text2: "Please try again.",
      });
    }
  };
  const handleSubmit = () => {
    if (selectedAnswers[question.id] === undefined) {
      Alert.alert(
        "Please select an answer",
        "You must select an answer before submitting."
      );
      return;
    }

    setIsCorrectAnswer(
      selectedAnswers[question?.id] == question?.correct_answer
    );
    setIsBtnDisabled(true);
    setResult(true);
  };

  return (
    <View
      style={[
        styles.container,
        result && !isCorrectAnswer && styles.redBorder,
        result && isCorrectAnswer && styles.greenBrorder,
      ]}
    >
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Quiz {qusNo}: {question.question}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            disabled={isBtnDisabled}
            key={index}
            style={[
              styles.optionButton,
              selectedAnswers[question.id] === index && styles.selectedOption,
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswers[question.id] === index &&
                  styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resultContainer}>
        <TouchableOpacity
          disabled={selectedAnswers[question.id] === undefined || isBtnDisabled}
          style={[
            styles.submitButton,
            selectedAnswers[question.id] !== undefined &&
              !isBtnDisabled &&
              styles.submitButtonActive,
          ]}
          onPress={handleSubmit}
        >
          <Text
            style={[
              styles.submitButtonText,
              selectedAnswers[question.id] !== undefined &&
                styles.submitButtonTextActive,
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
        {result && (
          <Text style={styles.correctAnswerText}>
            Correct Answer: {question.options[question.correct_answer]}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
    padding: 20,
    borderRadius: 8,
    margin: 10,
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questionHeader: {
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 15,
    fontFamily: "inter",
    color: "#000",
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    backgroundColor: "white",
    marginBottom: 10,
    width: "48%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  selectedOption: {
    backgroundColor: "#48732C",
  },
  correctOption: {
    backgroundColor: "#a90000ff",
  },
  optionText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    fontFamily: "inter",
  },
  redBorder: {
    borderWidth: 2,
    borderColor: "#d40101ff",
  },
  greenBrorder: {
    borderWidth: 2,
    borderColor: "#48732C",
  },
  selectedOptionText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    width: "48%",
    height: 30,
    justifyContent: "center",
  },
  submitButtonActive: {
    backgroundColor: "#48732C",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "600",
  },
  submitButtonTextActive: {
    color: "white",
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#48732C",
    textAlign: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  retakeButton: {
    backgroundColor: "#48732C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  retakeButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  resultContainer: {},
  correctAnswerText: {
    fontSize: 16,
    color: "#48732C",
    fontFamily: "interBold",
    marginTop: 10,
  },
});
