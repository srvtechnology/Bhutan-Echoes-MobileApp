import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  size = 32, 
  readonly = false 
}: StarRatingProps) {
  const handleStarPress = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleStarPress(index)}
          disabled={readonly}
          style={styles.starButton}
        >
          <Star
            size={size}
            color={index < rating ? '#FFD700' : '#E0E0E0'}
            fill={index < rating ? '#FFD700' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginHorizontal: 2,
  },
});