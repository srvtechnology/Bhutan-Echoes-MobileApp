import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { Pause, Play } from "lucide-react-native";

export default function MajestyAudio(item: any) {
  console.log(item.item);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playButtonId, setPlayButtonId] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const handlePlayAudio = async (e: any) => {
    try {
      // If clicking on the same item while playing, toggle pause/stop
      if (sound && isPlaying && playButtonId === e.id) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        return;
      }

      // If another audio is playing, stop and unload it first
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      const { sound: newSound } = await Audio.Sound.createAsync({
        // uri:          item?.item..media_url
        uri: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
      });

      setSound(newSound);
      setPlayButtonId(e.id);
      await newSound.setVolumeAsync(1.0);
      await newSound.playAsync();
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if ((status as any).didJustFinish) {
          setIsPlaying(false);
          setSound(null);
        }
      });
    } catch (err) {
      console.error("Playback error", err);
    }
  };
  return (
    <View style={styles.audioSection}>
      <TouchableOpacity
        style={styles.audioItem}
        onPress={() => handlePlayAudio(item.item)}
      >
        <View style={styles.audioIcon}>
          {isPlaying ? (
            <Pause size={24} color="white" />
          ) : (
            <Play size={24} color="white" />
          )}
        </View>
        <View style={styles.audioInfo}>
          <Text style={styles.audioTitle}>{item.item.title}</Text>
          <Text style={styles.audioDescription}>{item.item.description}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  audioContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    marginTop: 5,
  },
  audioSection: {
    paddingBottom: 5,
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
});
