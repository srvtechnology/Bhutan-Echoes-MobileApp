import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import QuizResult from "./modals/quizResult";
import Toast from "react-native-toast-message";
import { baseUrl } from "@/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  onQuizComplete?: (score: any) => void;
  isLoading?: boolean;
}

export default function QuizSection({
  questions,
  onQuizComplete,
  isLoading,
}: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [selectedAnswer, setSelectedAnswer] = useState({
    questionId: "",
    answerId: "",
    liveQuizId: "",
  });
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
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

      const { data } = await axios.post(
        `${baseUrl}/live-quizzes/${liveQuizId}/questions/${questionId}/answer `,
        { selected_answer_id: answerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("submit answer call", data);
    } catch (error) {
      console.log("submit answer error", error);

      Toast.show({
        type: "error",
        text1: "Error submitting answer",
        text2: "Please try again.",
      });
    }
  };
  const handleFinalQuizSumit = async (
    liveQuizId: string | number,
    questionId: string | number,
    answerId: string | number
  ) => {
    console.log(" When Submit called");

    try {
      submitAnswer(liveQuizId, questionId, answerId);
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.get(
        `${baseUrl}/live-quizzes/${liveQuizId}/my-answers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const answers = data.user_answers;
      // console.log("All answers", answers);

      // Calculate score
      const score = answers.reduce((acc, answer) => {
        return acc + (answer.is_correct ? 1 : 0);
      }, 0);

      Toast.show({
        type: "success",
        text1: data.message,
      });
      onQuizComplete?.({
        total: questions.length,
        correct: score,
        wrong: questions.length - score,
      });
      setIsBtnDisabled(true);
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
    if (selectedAnswers[currentQuestion.id] === undefined) {
      Alert.alert(
        "Please select an answer",
        "You must select an answer before submitting."
      );
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      submitAnswer(
        selectedAnswer.liveQuizId,
        selectedAnswer.questionId,
        selectedAnswer.answerId
      );
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinalQuizSumit(
        selectedAnswer.liveQuizId,
        selectedAnswer.questionId,
        selectedAnswer.answerId
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={"#48732C"} size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Quiz {currentQuestionIndex + 1}: {currentQuestion.question}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.answers.map((option, index) => (
          <TouchableOpacity
            disabled={isBtnDisabled}
            key={index}
            style={[
              styles.optionButton,
              selectedAnswers[currentQuestion.id] === index &&
                !isBtnDisabled &&
                styles.selectedOption,
            ]}
            onPress={() => {
              handleAnswerSelect(index);

              setSelectedAnswer({
                questionId: currentQuestion.id,
                answerId: option.id,
                liveQuizId: currentQuestion.live_quiz_id,
              });
            }}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswers[currentQuestion.id] === index &&
                  !isBtnDisabled &&
                  styles.selectedOptionText,
              ]}
            >
              {option.answer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        disabled={isBtnDisabled}
        style={[
          styles.submitButton,
          selectedAnswers[currentQuestion.id] !== undefined &&
            !isBtnDisabled &&
            styles.submitButtonActive,
        ]}
        onPress={handleSubmit}
      >
        <Text
          style={[
            styles.submitButtonText,
            selectedAnswers[currentQuestion.id] !== undefined &&
              styles.submitButtonTextActive,
          ]}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
        </Text>
      </TouchableOpacity>
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
    height: 30,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#48732C",
  },
  optionText: {
    fontSize: 15,
    color: "#000",
    textAlign: "center",
    fontFamily: "inter",
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
});
