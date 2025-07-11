import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import QuizResult from "./modals/quizResult";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  onQuizComplete?: (score: any) => void;
}

export default function QuizSection({
  questions,
  onQuizComplete,
}: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
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
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate score
      const score = questions.reduce((acc, question) => {
        const userAnswer = selectedAnswers[question.id];
        return acc + (userAnswer === question.correctAnswer ? 1 : 0);
      }, 0);

      onQuizComplete?.({
        score,
        correct: score,
        wrong: questions.length - score,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Quiz {currentQuestionIndex + 1}: {currentQuestion.question}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswers[currentQuestion.id] === index &&
                styles.selectedOption,
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswers[currentQuestion.id] === index &&
                  styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedAnswers[currentQuestion.id] !== undefined &&
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
