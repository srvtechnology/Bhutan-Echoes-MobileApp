import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect } from "react";
import { theme } from "@/theme/theme";
import { useEventStore } from "@/store/eventStore";

export default function Sponsers() {
  // const { sponsors, fetchEvents, fetchSponsors } = useEventStore();

  // useEffect(() => {
  //   fetchEvents();
  //   fetchSponsors();
  // }, []);

  const sponsors = [
    {
      id:1,
      url: require("../assets/images/sponser.jpeg")
    }
  ]
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
      <Text
        style={{
          fontSize: 12,
          fontFamily: theme.typography.fontFamily.medium,
          color: theme.colors.primary,
        }}
      >
        Our Sponsors
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          // paddingVertical: 12,
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sponsors.map((sponsor) => (
            <View
              key={sponsor.id}
              style={{
                marginRight: 6,
              }}
            >
              <Image
                source={sponsor.url}
                resizeMode="contain"
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
