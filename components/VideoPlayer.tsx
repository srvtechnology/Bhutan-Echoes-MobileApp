import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View, Button } from "react-native";

export default function VideoScreen({ url }: { url: string }) {
  const player = useVideoPlayer(url, (player) => {
    player.loop = false;
    // player.play();
  });

  //   const { isPlaying } = useEvent(player, "playingChange", {
  //     isPlaying: player.playing,
  //   });

  return (
    <View style={styles.contentContainer}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      {/* <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: 200,
  },
  controlsContainer: {
    padding: 10,
  },
});
