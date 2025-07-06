import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Bell, Star } from 'lucide-react-native';
import VideoPlayer from '@/components/VideoPlayer';
import StarRating from '@/components/StarRating';
import QuizSection from '@/components/QuizSection';
import RatingModal from '@/components/RatingModal';
import CommentsList, { Comment } from '@/components/CommentsList';
import PollSection from '@/components/PollSection';
import Header from '@/components/header';
import { Video } from 'expo-av';

export default function EventDetailsScreen() {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [eventRating, setEventRating] = useState(4.2);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userName: 'Tshering',
      rating: 5,
      comment: 'Event is awesome, Really enjoying.',
      timestamp: new Date(),
    },
    {
      id: '2',
      userName: 'Kinley',
      rating: 4.5,
      comment: 'Event is awesome, Really enjoying.',
      timestamp: new Date(),
    },
  ]);

  const quizQuestions = [
    {
      id: 'q1',
      question: 'How old is this festival?',
      options: ['1 Year', '5 Years', '10 Years', '12 years'],
      correctAnswer: 2,
    },
    {
      id: 'q2',
      question: 'What is the main theme of this festival?',
      options: ['Literature', 'Music', 'Dance', 'Art'],
      correctAnswer: 0,
    },
  ];

  const pollData = {
    id: 'poll1',
    question: 'Drukyul\'s Literature Arts Festival, Your feedback?',
    options: [
      { id: 'excellent', text: 'Excellent', votes: 45 },
      { id: 'average', text: 'Average', votes: 12 },
      { id: 'improve', text: 'Need to improve', votes: 8 },
      { id: 'bad', text: 'Very bad', votes: 2 },
    ],
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userName: 'Tshering',
      rating,
      comment,
      timestamp: new Date(),
    };
    setComments(prev => [newComment, ...prev]);
    
    // Update overall event rating (simple average)
    const totalRating = comments.reduce((sum, c) => sum + c.rating, 0) + rating;
    const newEventRating = totalRating / (comments.length + 1);
    setEventRating(Number(newEventRating.toFixed(1)));
  };

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    console.log('Poll vote:', pollId, optionId);
  };

  return (
    <SafeAreaView style={styles.container}>
       {/* Header */}
        <Header title="Drukyul’s Literature Arts Festival" />
        

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
       <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Event Rating</Text>
              <StarRating rating={Math.floor(eventRating)} readonly size={20} />
            </View>
        {/* Video Player */}
        <View  style={styles.videoSection}>
            <Video
              source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
              style={styles.postVideo}
              useNativeControls
              resizeMode="contain"
              shouldPlay={false}
              // poster="https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg"
            />
          </View>

        {/* Quiz Section */}
        <QuizSection 
          questions={quizQuestions}
          onQuizComplete={handleQuizComplete}
        />

        {/* Poll Section */}
        <PollSection 
          poll={pollData}
          onVote={handlePollVote}
        />

        {/* Comments List */}
        <CommentsList comments={comments} />

        {/* Rating Button */}
        <View style={styles.ratingButtonSection}>
          <TouchableOpacity 
            style={styles.ratingButton}
            onPress={() => setShowRatingModal(true)}
          >
            <Text style={styles.ratingButtonText}>Give your comments for this event</Text>
            <Star size={22} color="#FFD700" fill={'#FFD700'} />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />

      </ScrollView>

      {/* Rating Modal */}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        userName="Tshering"
      />
       
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#48732C',
    marginBottom: 8,
    lineHeight: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#000',
    marginRight: 8,
    fontFamily: 'inter'
  },
  notificationButton: {
    position: 'relative',
    marginLeft: 15,
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  postVideo: {
    width: "100%",
    height: 200,
    borderRadius:8
  },
  ratingButtonSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginTop: 20,
  },
  ratingButton: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  ratingButtonText: {
    color: '#666',
    fontSize: 15,
    fontFamily: 'inter',
    fontStyle: 'italic'
  },
  bottomSpacing: {
    height: 100,
  },
});