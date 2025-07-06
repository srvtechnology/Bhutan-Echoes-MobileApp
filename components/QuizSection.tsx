import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  onQuizComplete?: (score: number) => void;
}

export default function QuizSection({
  questions,
  onQuizComplete,
}: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: any, optionIndex: number) => {    
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    // if (selectedAnswers[currentQuestion.id] === undefined) {
    //   Alert.alert(
    //     "Please select an answer",
    //     "You must select an answer before submitting."
    //   );
    //   return;
    // }

    // if (currentQuestionIndex < questions.length - 1) {
    //   setCurrentQuestionIndex((prev) => prev + 1);
    // } else {
    //   // Calculate score
    //   const score = questions.reduce((acc, question) => {
    //     const userAnswer = selectedAnswers[question.id];
    //     return acc + (userAnswer === question.correctAnswer ? 1 : 0);
    //   }, 0);

    //   setShowResults(true);
    //   onQuizComplete?.(score);
    // }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = questions.reduce((acc, question) => {
      const userAnswer = selectedAnswers[question.id];
      return acc + (userAnswer === question.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <View style={styles.container}>
        <Text style={styles.resultsTitle}>Quiz Complete!</Text>
        <Text style={styles.scoreText}>
          Your Score: {score}/{questions.length}
        </Text>
        <TouchableOpacity style={styles.retakeButton} onPress={resetQuiz}>
          <Text style={styles.retakeButtonText}>Retake Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View key={item.id} style={styles.container}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>
                Quiz {index + 1}: {item.question}
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {item.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswers[item.id] === index && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswerSelect(item.id, index)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedAnswers[item.id] === index &&
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
                selectedAnswers[item.id] !== undefined &&
                  styles.submitButtonActive,
              ]}
              onPress={handleSubmit}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  selectedAnswers[item.id] !== undefined &&
                    styles.submitButtonTextActive,
                ]}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
