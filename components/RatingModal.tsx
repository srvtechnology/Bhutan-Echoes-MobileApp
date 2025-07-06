import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { X } from 'lucide-react-native';
import StarRating from './StarRating';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  userName: string;
}

export default function RatingModal({ visible, onClose, onSubmit, userName }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
      setRating(0);
      setComment('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="pageSheet"
      transparent
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Rating</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.ratingSection}>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size={40}
            />
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
            </View>
            <Text style={styles.username}>{userName}</Text>
          </View>

          <TextInput
            style={styles.commentInput}
            placeholder="Write your comments"
            multiline
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              rating > 0 && styles.submitButtonActive
            ]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text style={[
              styles.submitButtonText,
              rating > 0 && styles.submitButtonTextActive
            ]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  modalContent:{height: 380, backgroundColor: 'white', margin:15} ,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 17,
    fontFamily: 'interMedium',
    color: '#000',
  },
  closeButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#48732C",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ratingSection: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#48732C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'inter',
  },
  username: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'interMedium'
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingTop: 10,
    fontFamily: 'inter',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: 200,
    height: 50,
    justifyContent: 'center',
  },
  submitButtonActive: {
    backgroundColor: '#48732C',
  },
  submitButtonText: {
    fontSize: 25,
    color: '#999',
    fontFamily: 'interMedium',
  },
  submitButtonTextActive: {
    color: 'white',
  },
});