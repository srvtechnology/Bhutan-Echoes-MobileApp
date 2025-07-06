import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import StarRating from './StarRating';
import { Star } from 'lucide-react-native';

export interface Comment {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

interface CommentsListProps {
  comments: Comment[];
  title?: string;
}

export default function CommentsList({ comments}: CommentsListProps) {
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Star size={22} color="#FFD700" fill={'#FFD700'} />
          <Text style={styles.ratingText}>{item.rating} Star</Text>
        </View>
      </View>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  commentItem: {
    backgroundColor: '#F9F9F9',
    margin: 15,
    padding: 16,
    borderRadius: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 41,
    height: 41,
    borderRadius: 22,
    backgroundColor: '#48732C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'inter',
  },
  userName: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'interMedium'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 17,
    color: '#000',
    marginLeft: 8,
    fontFamily: 'interMedium',
  },
  commentText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'interMedium',
    lineHeight: 17,
    marginLeft: 50
  },
});