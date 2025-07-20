import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Play,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
} from "lucide-react-native";
import Header from "@/components/header";
import { Video } from "expo-av";
import QuizSectionMajesty from "@/components/QuizSectionMajesty";
import axios from "axios";
import { baseUrl } from "@/config";

const { width: screenWidth } = Dimensions.get("window");

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function MajestyTimelineScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [quizes, setQuizes] = useState([]);
  const [quizScore, setQuizScore] = useState<any>({});
  const [showQuizResultModal, setShowQuizResultModal] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.round(contentOffset.x / screenWidth);
    setCurrentImageIndex(imageIndex);
  };

  const quizQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question: "How old is this festival?",
      options: ["1 Year", "5 Years", "10 Years", "12 years"],
      correctAnswer: 2,
    },
    {
      id: "q2",
      question: "When was His Majesty born?",
      options: ["1980", "1981", "1982", "1983"],
      correctAnswer: 1,
    },
    {
      id: "q3",
      question: "What is the capital of Bhutan?",
      options: ["Thimphu", "Paro", "Punakha", "Jakar"],
      correctAnswer: 0,
    },
  ];

  const audioResources = [
    {
      id: "1",
      title: "Resource 2 - Audio",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      duration: "15:30",
    },
    {
      id: "2",
      title: "Royal Speech - National Day",
      description:
        "His Majesty's address to the nation on National Day celebration.",
      duration: "22:45",
    },
  ];

  const eventImages = [
    "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg",
    "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg",
    "https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg",
  ];

  const royalPhotos = [
    "https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg",
    "https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg",
    "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg",
    "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg",
  ];

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const fetchQuizes = async () => {
    setIsQuizLoading(true);
    try {
      const { data } = await axios.get(baseUrl + "/live-quizzes");
      console.log("Quizes", data.live_quizzes[0]);
      setQuizes(data.live_quizzes[0]);
      setIsQuizLoading(false);
    } catch (error) {
      console.log("Error fetching quizes:", error);
      // setIsQuizLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizes();
  }, []);

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

  const handlePlayAudio = (resource: any) => {
    Alert.alert("Play Audio", `Playing: ${resource.title}`);
  };

  const handlePhotoScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const photoIndex = Math.round(contentOffset.x / (screenWidth - 40));
    setCurrentPhotoIndex(photoIndex);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header back={false} title="Majesty Timeline" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Royal Information */}
        <View style={styles.royalInfoSection}>
          <View style={styles.organizationSection}>
            <UserCircle2 size={25} color={"purple"} />
            <Text style={styles.organizationName}>Bhutan Echoes</Text>
          </View>
          <Text style={styles.royalDescription}>
            His Majesty King Jigme Khesar Namgyel Wangchuck is the fifth king of
            Bhutan.
          </Text>
        </View>

        {/* Hero Image */}
        <View style={styles.videoSection}>
          <Video
            source={{
              uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            }}
            style={styles.postVideo}
            useNativeControls
            // resizeMode="contain"
            shouldPlay={false}
            isMuted={false}
            // poster="https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg"
          />
        </View>

        {/* Quiz Section */}
        {!isQuizLoading && (
          <QuizSectionMajesty
            questions={quizes?.questions}
            onQuizComplete={handleQuizComplete}
          />
        )}

        {/* Audio Resources */}
        <View style={styles.audioSection}>
          {audioResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.audioItem}
              onPress={() => handlePlayAudio(resource)}
            >
              <View style={styles.audioIcon}>
                <Play size={24} color="white" />
              </View>
              <View style={styles.audioInfo}>
                <Text style={styles.audioTitle}>{resource.title}</Text>
                <Text style={styles.audioDescription}>
                  {resource.description}
                </Text>
                {/* {resource.duration && (
                  <Text style={styles.audioDuration}>
                    Duration: {resource.duration}
                  </Text>
                )} */}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Message from His Majesty */}
        <View style={styles.messageSection}>
          <Text style={styles.messageTitle}>Message from His Majesty</Text>
          <Text style={styles.messageContent}>
            His Majesty King Jigme Khesar Namgyel Wangchuck is the fifth king of
            Bhutan. Known for his humble personality, his approachability and
            his popularity, he is lovingly called the People's King in the
            country. Very few people know that is Majesty was born in Kathmandu,
            Nepal.
          </Text>
        </View>

        {/* Recent Photos */}
        <View style={styles.photosSection}>
          <Text style={styles.photosTitle}>Recent photos of His Majesty</Text>

          <View style={styles.imageSection}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
            >
              {eventImages.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {eventImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  },

  royalInfoSection: {
    backgroundColor: "white",
    marginTop: 10,
    paddingTop: 20,
  },
  organizationSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  organizationName: {
    fontSize: 12,
    fontFamily: "interMedium",
    color: "#222",
    marginLeft: 5,
  },
  royalDescription: {
    backgroundColor: "#dddddd",
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontFamily: "interMedium",
    paddingVertical: 10,
  },
  videoSection: {},
  postVideo: {
    width: "100%",
    height: 215,
  },
  quizSection: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginTop: 10,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  quizOptions: {
    marginBottom: 20,
  },

  audioSection: {
    paddingVertical: 10,
    backgroundColor: "#F9F9F9",
  },
  audioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#48732B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#333",
    marginBottom: 4,
  },
  audioDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
    fontFamily: "inter",
  },
  audioDuration: {
    fontSize: 12,
    color: "#999",
  },
  messageSection: {
    backgroundColor: "#dddddd",
    padding: 20,
    marginTop: 10,
  },
  messageTitle: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#000",
    marginBottom: 10,
  },
  messageContent: {
    fontSize: 14,
    color: "#000",
    lineHeight: 22,
    textAlign: "justify",
    fontFamily: "inter",
  },
  imageSection: {
    position: "relative",
  },
  eventImage: {
    width: screenWidth - 20,
    height: 220,
  },
  imageIndicators: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "white",
    width: 24,
  },
  photosSection: {
    backgroundColor: "#dddddd",
    paddingTop: 20,
    marginTop: 10,
  },
  photosTitle: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#000",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});
