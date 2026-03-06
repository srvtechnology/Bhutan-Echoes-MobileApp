import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { baseUrl } from "@/config";
import Header from "@/components/header";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import axiosInstance from "@/helpers/axiosInstance";

export default function Quizes() {
  const [quizes, setQuizes] = useState([]);
  const [isQuizLoading, setIsQuizLoading] = useState(true);

  const fetchQuizes = async () => {
    setIsQuizLoading(true);
    try {
      const { data } = await axiosInstance.get(baseUrl + "/quizzes");
      console.log("Quizes", data.quizzes);
      setQuizes(data.quizzes);
      setIsQuizLoading(false);
    } catch (error) {
      console.log("Error fetching quizes:", error);
      // setIsQuizLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizes();
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
        {quizes.map((quiz: any) => (
          <TouchableOpacity
            key={quiz.id}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/majesty/quiz",
                params: {
                  id: quiz.id,
                },
              })
            }
          >
            <View key={quiz.id} style={styles.quizContainer}>
              <View>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizCount}>
                  No of Questions: {quiz?.questions_count}
                </Text>
              </View>
              <ChevronRight size={26} color={"#48732C"} />
            </View>
          </TouchableOpacity>
        ))}
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
    paddingTop: 20,
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
