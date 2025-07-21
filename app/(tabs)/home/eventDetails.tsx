import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Bell, Plus, Star } from "lucide-react-native";
import VideoPlayer from "@/components/VideoPlayer";
import StarRating from "@/components/StarRating";
import QuizSection from "@/components/QuizSection";
import RatingModal from "@/components/RatingModal";
import CommentsList, { Comment } from "@/components/CommentsList";
import PollSection from "@/components/PollSection";
import Header from "@/components/header";
import { Video } from "expo-av";
import QuizResult from "@/components/modals/quizResult";
import { baseUrl } from "@/config";
import axios from "axios";
import AddQuestion from "@/components/modals/addQuestion";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function EventDetailsScreen() {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [quizScore, setQuizScore] = useState<any>({});
  const [showQuizResultModal, setShowQuizResultModal] = useState(false);
  const [eventRating, setEventRating] = useState(4.2);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizLoading, setIsQuizLoading] = useState(true);
  const [quizes, setQuizes] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isPollsLoading, setIsPollsLoading] = useState(true);
  const [polls, setPolls] = useState([]);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>();
  const [liveSessionDetails, setLiveSessionDetails] = useState("");
  const [userDetails, setUserDetails] = useState({});

  const { id } = useLocalSearchParams();

  const pollData = {
    id: "poll1",
    question: "Drukyul's Literature Arts Festival, Your feedback?",
    options: [
      { id: "excellent", text: "Excellent", votes: 45 },
      { id: "average", text: "Average", votes: 12 },
      { id: "improve", text: "Need to improve", votes: 8 },
      { id: "bad", text: "Very bad", votes: 2 },
    ],
  };

  const fetchUserFromAsync = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      console.log("user", user);
      setUserDetails(JSON.parse(user));
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  const fetchLiveSessionDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(baseUrl + "/live-sessions/" + id);
      // console.log("Session details", id, data.live_session);
      setLiveSessionDetails(data.live_session);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching Session details:", error);
      setIsLoading(false);
    }
  };
  const fetchQuizes = async () => {
    setIsQuizLoading(true);
    try {
      const { data } = await axios.get(baseUrl + "/live-quizzes");
      console.log("Quizes", data.live_quizzes[0]);
      setQuizes(data.live_quizzes[0]);
      setIsQuizLoading(false);
    } catch (error) {
      console.log("Error fetching quizes:", error);
      setIsQuizLoading(false);
    }
  };

  const fetchPolls = async () => {
    setIsPollsLoading(true);
    try {
      const { data } = await axios.get(baseUrl + "/live-polls");
      // console.log("polls ", data.live_polls);
      setPolls(data.live_polls);
      setIsPollsLoading(false);
    } catch (error) {
      console.log("Error fetching polls :", error);
      setIsPollsLoading(false);
    }
  };

  const fetchComments = async () => {
    setIsCommentsLoading(true);
    try {
      const { data } = await axios.get(baseUrl + "/feedback");
      // console.log("Comments", data);
      setComments(data.feedback);
      setIsCommentsLoading(false);
    } catch (error) {
      console.log("Error fetching Session details:", error);
      setIsCommentsLoading(false);
    }
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userName: "Tshering",
      rating,
      comment,
      timestamp: new Date(),
    };
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.post(
        baseUrl + "/feedback",
        {
          session_id: liveSessionDetails?.id,
          rating,
          comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Rating submitted:", data);
      Toast.show({
        type: "success",
        text1: data.message,
      });
      const commentData = { ...data.feedback, user: userDetails };

      setComments((prev) => [commentData, ...prev]);
    } catch (error) {
      console.log("Error submitting rating:", error);
      Toast.show({
        type: "error",
        text1: "Error submitting rating. Please try again.",
      });
    }

    // Update overall event rating (simple average)
    const totalRating = comments.reduce((sum, c) => sum + c.rating, 0) + rating;
    const newEventRating = totalRating / (comments.length + 1);
    setEventRating(Number(newEventRating.toFixed(1)));
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setShowQuizResultModal(true);
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    console.log("Poll vote:", pollId, optionId);
  };

  const handleSubmitQuestion = async (question: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.post(
        baseUrl + "/live-questions",
        {
          session_id: liveSessionDetails?.id,
          question: question?.question,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Question submitted:", data);
      Toast.show({
        type: "success",
        text1: data.message,
      });
    } catch (error) {
      console.log("Error submitting question:", error);
      Toast.show({
        type: "error",
        text1: "Error submitting question. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchUserFromAsync();
    fetchLiveSessionDetails();
    fetchQuizes();
    fetchPolls();
    fetchComments();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator color={"#48732C"} size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title={liveSessionDetails?.title} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Event Rating</Text>
          <StarRating rating={Math.floor(eventRating)} readonly size={20} />
        </View>
        {/* Video Player */}
        <View style={styles.videoSection}>
          <VideoPlayer url={liveSessionDetails?.youtube_link} />
        </View>

        {/* Quiz Section */}
        {!isQuizLoading && (
          <QuizSection
            isLoading={isQuizLoading}
            questions={quizes.questions}
            onQuizComplete={handleQuizComplete}
          />
        )}

        {/* Poll Section */}
        {!isPollsLoading && (
          <PollSection
            poll={polls}
            onVote={handlePollVote}
            isLoading={isPollsLoading}
          />
        )}

        {/* Comments List */}
        {!isCommentsLoading && (
          <CommentsList comments={comments} isLoading={isCommentsLoading} />
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Rating Button */}
      <View style={styles.ratingButtonSection}>
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowAddQuestionModal(true)}
          >
            <Plus size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.fabText}>Have Questions?</Text>
        </View>

        <TouchableOpacity
          style={styles.ratingButton}
          onPress={() => setShowRatingModal(true)}
        >
          <Text style={styles.ratingButtonText}>
            Give your comments for this event
          </Text>
          <Star size={22} color="#FFD700" fill={"#FFD700"} />
        </TouchableOpacity>
      </View>

      {/* Rating Modal */}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        user={userDetails}
      />
      <QuizResult
        showPostModal={showQuizResultModal}
        setShowPostModal={setShowQuizResultModal}
        score={quizScore}
      />
      {showAddQuestionModal && (
        <AddQuestion
          showPostModal={showAddQuestionModal}
          setShowPostModal={setShowAddQuestionModal}
          onSubmitQuestion={handleSubmitQuestion}
          user={userDetails}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#48732C",
    marginBottom: 8,
    lineHeight: 24,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#000",
    marginRight: 8,
    fontFamily: "inter",
  },
  notificationButton: {
    position: "relative",
    marginLeft: 15,
  },
  notificationBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  videoSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  postVideo: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  ratingButtonSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingButton: {
    backgroundColor: "#dddddd",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  ratingButtonText: {
    color: "#666",
    fontSize: 15,
    fontFamily: "inter",
    fontStyle: "italic",
  },
  bottomSpacing: {
    height: 100,
  },
  fabContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    width: 38,
    height: 38,
    borderRadius: 28,
    backgroundColor: "#48732C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 8,
    fontFamily: "inter",
    color: "#000",
    marginTop: 6,
  },
});
