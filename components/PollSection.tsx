import { baseUrl } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface PollSectionProps {
  poll: any[];
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
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string | null;
  }>({});
  const [votedPolls, setVotedPolls] = useState<{ [key: number]: boolean }>({});
  const [voteResults, setVoteResults] = useState<any[]>(poll);

  const totalVotes = poll.map((e) => ({
    ...e,
    options: e.options.map((option) => ({
      ...option,
      votes: 0,
    })),
  }));

  const handleVote = (pollId: number, optionId: string) => {
    if (!votedPolls[pollId]) {
      setSelectedOptions((prev) => ({ ...prev, [pollId]: optionId }));
    }
  };

  const getPollResult = async (pollId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.get(
        `${baseUrl}/live-polls/${pollId}/results`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const votesMap = new Map();
      data.results.forEach((result) => {
        votesMap.set(result.option_id, result.votes);
      });

      const updatedPolls = voteResults.map((p) => {
        if (p.id === pollId) {
          const updatedOptions = p.options.map((option) => ({
            ...option,
            votes: votesMap.get(option.id) || 0,
          }));
          return { ...p, options: updatedOptions };
        }
        return p;
      });

      setVoteResults(updatedPolls);
      setVotedPolls((prev) => ({ ...prev, [pollId]: true }));
    } catch (error) {
      console.error("Error fetching poll results:", error);
    }
  };

  const submitPoll = async (pollId: number) => {
    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.post(
        `${baseUrl}/live-polls/${pollId}/vote`,
        { option_id: selectedOption },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getPollResult(pollId);
    } catch (error) {
      console.error("Error submitting poll:", error);
    }
  };

  const handleSubmit = (pollId: string | number) => {
    if (selectedOption && !hasVoted) {
      submitPoll(pollId);
      // setHasVoted(true);
      // onVote?.(pollId, selectedOption);
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
    <View>
      {voteResults.map((poll) => {
        const selected = selectedOptions[poll.id];
        const hasVoted = votedPolls[poll.id];
        return (
          <View key={poll.id} style={styles.container}>
            <Text style={styles.question}>{poll.question}</Text>

            <View style={styles.optionsContainer}>
              {poll.options.map((option) => {
                const isSelected = selected === option.id;
                const percentage = hasVoted ? option.votes : 0;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      isSelected && styles.selectedOption,
                      hasVoted && styles.votedOption,
                    ]}
                    onPress={() => handleVote(poll.id, option.id)}
                    disabled={hasVoted}
                  >
                    {hasVoted && (
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${percentage}%` },
                        ]}
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
                        {option.option}
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
                  selected && styles.submitButtonActive,
                ]}
                onPress={() => submitPoll(poll.id)}
                disabled={!selected}
              >
                <Text
                  style={[
                    styles.submitButtonText,
                    selected && styles.submitButtonTextActive,
                  ]}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
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
