import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

interface PollSectionProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  isLoading?: boolean;
}

export default function PollSection({
  poll,
  onVote,
  isLoading,
}: PollSectionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  const handleVote = (optionId: string) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && !hasVoted) {
      setHasVoted(true);
      onVote?.(poll.id, selectedOption);
    }
  };

  const getVotePercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={"#48732C"} size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{poll.question}</Text>

      <View style={styles.optionsContainer}>
        {poll.options.map((option) => {
          const percentage = getVotePercentage(option.votes);
          const isSelected = selectedOption === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOption,
                hasVoted && styles.votedOption,
              ]}
              onPress={() => handleVote(option.id)}
              disabled={hasVoted}
            >
              {hasVoted && (
                <View
                  style={[styles.progressBar, { width: `${percentage}%` }]}
                />
              )}
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                    hasVoted && styles.votedOptionText,
                  ]}
                >
                  {option.text}
                </Text>
                {hasVoted && (
                  <Text style={styles.percentageText}>{percentage}%</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {!hasVoted && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedOption && styles.submitButtonActive,
          ]}
          onPress={handleSubmit}
          disabled={!selectedOption}
        >
          <Text
            style={[
              styles.submitButtonText,
              selectedOption && styles.submitButtonTextActive,
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      )}

      {hasVoted && (
        <Text style={styles.totalVotesText}>Total votes: {totalVotes}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
    padding: 20,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    margin: 15,
  },
  question: {
    fontSize: 15,
    fontFamily: "inter",
    color: "#333",
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: "white",
    marginBottom: 15,
    position: "relative",
    overflow: "hidden",
    height: 30,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  selectedOption: {
    backgroundColor: "#48732C",
  },
  votedOption: {
    backgroundColor: "#f8f9fa",
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#48732C",
    opacity: 0.1,
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  optionText: {
    fontSize: 14,
    color: "#666",
  },
  selectedOptionText: {
    color: "#fff",
    fontFamily: "inter",
  },
  votedOptionText: {
    color: "#333",
    fontWeight: "500",
  },
  percentageText: {
    fontSize: 14,
    color: "#48732C",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    width: "50%",
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
  totalVotesText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
