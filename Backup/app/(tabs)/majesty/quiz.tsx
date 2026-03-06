import Header from "@/components/header";
import QuizSectionMajesty from "@/components/QuizSectionMajesty";
import { baseUrl } from "@/config";
import axiosInstance from "@/helpers/axiosInstance";
import { useLocalSearchParams } from "expo-router";
import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<any>({});
  const [showQuizResultModal, setShowQuizResultModal] = useState(false);
  const [quize, setQuize] = useState([]);
  const [isQuizLoading, setIsQuizLoading] = useState(true);

  const { id } = useLocalSearchParams();
  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setShowQuizResultModal(true);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      Alert.alert(
        "Please select an answer",
        "You must select an answer before proceeding."
      );
      return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      Alert.alert("Quiz Complete!", "Thank you for participating in the quiz.");
      // Reset quiz
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
    }
  };

  const fetchQuizeDetails = async () => {
    setIsQuizLoading(true);
    try {
      const { data } = await axiosInstance.get(baseUrl + "/quizzes/" + id);
      console.log("Quize details: ", data.quiz);
      setQuize(data.quiz);
      setIsQuizLoading(false);
    } catch (error) {
      console.log("Error fetching quizes:", error);
      // setIsQuizLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizeDetails();
  }, []);
  if (isQuizLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#48732C" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header back={true} title="Majesty Quizes" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {quize?.questions?.map((quiz: any, index) => (
          <QuizSectionMajesty key={quiz.id} question={quiz} qusNo={index} />
        ))}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  quizContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    backgroundColor: "#F9F9F9",
    padding: 20,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizTitle: {
    fontSize: 16,
    color: "#48732C",
    fontFamily: "interBold",
  },
  quizCount: {
    fontSize: 14,
    color: "#444",
    fontFamily: "inter",
  },
});
