import React, { useState, useCallback } from "react";
import { View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const getYoutubeId = (url: string) => {
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const YouTubePlayer = ({
  url,
  height = 220,
}: {
  url: string;
  height: number;
}) => {
  const [playing, setPlaying] = useState(false);

  const videoId = getYoutubeId(url);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  if (!videoId) return null;

  return (
    <View style={{}}>
      <YoutubePlayer
        height={height}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />
    </View>
  );
};

export default YouTubePlayer;
